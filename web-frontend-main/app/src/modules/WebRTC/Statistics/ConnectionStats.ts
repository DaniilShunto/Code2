// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { maxBy, sumBy } from 'lodash';

import { CandidatePairState, CandidatePairStats } from './CandidatePairState';
import { InboundStreamState } from './InboundStreamState';
import { OutboundStreamState } from './OutboundStreamState';
import { MediaStats } from './StreamState';

export interface StreamStats extends MediaStats {
  type: 'inbound' | 'outbound';
  timestamp: number;
  bitRate?: number;
  packetRate?: number;
  packetLoss?: number;
  packetsDiscarded?: number;
  jitter?: number;
  roundTripTime?: number;
  retransmitRatio?: number;
}

export interface StatsEvent {
  connection: CandidatePairStats;
  inbound?: StreamStats;
  outbound?: StreamStats;
}

export default class ConnectionStats {
  private candidates: Record<string, CandidatePairState> = {};
  private inbound: Record<string, InboundStreamState> = {};
  private outbound: Record<string, OutboundStreamState> = {};

  constructor(reports: RTCStatsReport) {
    this.update(reports);
  }

  public update(reports: RTCStatsReport): StatsEvent | undefined {
    let connection: CandidatePairStats | undefined;
    const streams: StreamStats[] = [];

    for (const [id, report] of reports) {
      switch (report.type) {
        case 'inbound-rtp': {
          let remoteReport;
          if (report.remoteId) {
            remoteReport = reports.get(report.remoteId) as RTCRemoteOutboundRtpStreamStats;
          }

          if (remoteReport && remoteReport.type !== 'remote-outbound-rtp') {
            console.warn(`broken RTCStats remote report ${report.remoteId} for "inbound-rtp"`, remoteReport, report);
            for (const [id, report] of reports) {
              console.debug(`report id ${id}`, report);
            }
            throw new Error(`RTCStats expected remote report got type '${remoteReport?.type}'`);
          }

          const inbound = this.inbound[id];
          if (inbound === undefined) {
            this.inbound[id] = new InboundStreamState(report, remoteReport);
          } else {
            const rates = inbound.update(report, remoteReport);
            // TODO: remove when Safari and Edge are done
            /*
              console.debug(
                `RTP ${report.type} ${report.kind} bitrate:${formatBitRate(rates.bitRate)} ssrc:${report.ssrc} loss: ${
                  (rates.packetLoss || 0) * 100
                }% jitter:${rates.jitter})`,
                rates,
                report,
                remoteReport
              );
            */
            streams.push(rates);
          }
          break;
        }
        case 'outbound-rtp': {
          let remoteReport;
          if (report.remoteId) {
            remoteReport = reports.get(report.remoteId) as RTCRemoteInboundRtpStreamStats;
            if (remoteReport && remoteReport.type !== 'remote-inbound-rtp') {
              console.warn(`broken RTCStats remote report ${report.remoteId} for "outbound-rtp"`, remoteReport, report);
              for (const [id, report] of reports) {
                console.debug(`report id ${id}`, report);
              }
              throw new Error(`RTCStats expected remote report got type '${remoteReport.type}'`);
            }
          }
          const outbound = this.outbound[id];
          if (outbound === undefined) {
            this.outbound[id] = new OutboundStreamState(report, remoteReport);
          } else {
            const rates = outbound.update(report, remoteReport);
            // TODO: remove when Safari and Edge are done
            /*
              console.debug(
                `RTPstats ${report.type} ${report.kind} ssrc:${report.ssrc} bitrate:${formatBitRate(rates.bitRate)} RTT:${
                  (rates?.roundTripTime || 0) * 1000
                }ms loss: ${((rates.packetLoss || 0) * 100).toFixed(1)}% jitter:${((rates?.jitter || 0) * 1000).toFixed(
                  1
                )}ms)`,
                rates,
                report,
                remoteReport
              );
            */
            streams.push(rates);
          }
          break;
        }
        case 'candidate-pair': {
          // we don't care for unsuccessful or inactive candidates
          if (!report.nominated || report.state !== 'succeeded') {
            break;
          }

          const candidate = this.candidates[id];

          const localCandidate = reports.get(report.localCandidateId);
          const remoteCandidate = reports.get(report.remoteCandidateId);

          if (candidate === undefined) {
            this.candidates[id] = new CandidatePairState(report, localCandidate, remoteCandidate);
            break;
          }
          // update rates on connected candidates even if not selected
          const rates = candidate.update(report);

          const transport = reports.get(report.transportId);
          // report.selected is deprecated but still in use in Firefox v97
          // whereas Chrome uses transport.selectedCandidatePairId
          const isSelected = !!report.selected || transport?.selectedCandidatePairId === id;
          if (isSelected) {
            if (connection !== undefined) {
              console.warn('reassign selected candidatePair:', connection, report);
            }

            /* TODO: remove when Safari and Edge are done
              const tLastReceived = report.timestamp - report.lastPacketReceivedTimestamp;
              const tLastSend = report.timestamp - report.lastPacketSentTimestamp;
              console.debug(`tRX: ${tLastReceived.toFixed(1)}ms tTX: ${tLastSend.toFixed(1)}ms}`);
              console.debug(`RTP ${report.type}`, { rates, report, localCandidate, remoteCandidate, transport });
            */
            connection = rates;
          }
          break;
        }
        default:
          break;
      }
    }

    if (connection === undefined) {
      return undefined;
    }

    const aggregateStreams = (streams: StreamStats[], type: 'inbound' | 'outbound'): StreamStats | undefined => {
      const currentDirection = streams.filter((rates) => rates.type === type);
      return {
        timestamp: maxBy(currentDirection, 'timestamp')?.timestamp || 0,
        bitRate: sumBy(currentDirection, 'bitRate'),
        packetRate: sumBy(currentDirection, 'packetRate'),
        packetLoss: maxBy(currentDirection, 'packetLoss')?.packetLoss,
        frameRate: maxBy(currentDirection, 'frameRate')?.frameRate,
        jitter: maxBy(currentDirection, 'jitter')?.jitter,
        roundTripTime: maxBy(currentDirection, 'roundTripTime')?.roundTripTime,
        codingTime: sumBy(currentDirection, 'codingTime'),
        frameSkip: sumBy(currentDirection, 'frameSkip'),
        pictureLoss: sumBy(currentDirection, 'pictureLoss'),
        frameWidth: maxBy(currentDirection, 'frameWidth')?.frameWidth,
        frameHeight: maxBy(currentDirection, 'frameHeight')?.frameHeight,
        type,
      };
    };

    const inbound = aggregateStreams(streams, 'inbound');
    const outbound = aggregateStreams(streams, 'outbound');

    return { connection, inbound, outbound };
  }
}
