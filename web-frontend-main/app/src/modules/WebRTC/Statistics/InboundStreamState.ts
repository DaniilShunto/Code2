// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { StreamStats } from './ConnectionStats';
import { StreamState } from './StreamState';

export class InboundStreamState extends StreamState {
  bytesReceived = 0;
  packetsReceived = 0;
  packetsLost = 0;
  jitter?: number;
  // this is added because remoteReport wasn't use in this state, so esling was complaining TODO stefan
  remoteReporter?: RTCRemoteOutboundRtpStreamStats;

  constructor(report: RTCInboundRtpStreamStats, remoteReport?: RTCRemoteOutboundRtpStreamStats) {
    super(report);
    this.setState(report, remoteReport);
  }

  // TODO stefan - check the remoteReport argument
  protected setState(report: RTCInboundRtpStreamStats, remoteReport?: RTCRemoteOutboundRtpStreamStats) {
    super.setState(report);
    this.bytesReceived = report.bytesReceived || 0;
    this.packetsReceived = report.packetsReceived || 0;
    this.packetsLost = report.packetsLost || 0;
    this.jitter = report.jitter;
    this.remoteReporter = remoteReport;
  }

  public update(report: RTCInboundRtpStreamStats, remoteReport?: RTCRemoteOutboundRtpStreamStats): StreamStats {
    if (this.timestamp >= report.timestamp) {
      throw Error('called twice or for an old report');
    }

    const stats: StreamStats = { type: 'inbound', timestamp: report.timestamp, ...this.updateMedia(report) };
    const dt = (report.timestamp - this.timestamp) / 1000.0;
    if (report.bytesReceived !== undefined) {
      const dBytesSent = report.bytesReceived - this.bytesReceived;
      const byteRate = dBytesSent / dt;
      stats.bitRate = 8 * byteRate;
    }

    if (report.packetsReceived !== undefined) {
      const dPacketsReceived = report.packetsReceived - this.packetsReceived;
      stats.packetRate = dPacketsReceived / dt;
      if (report.packetsLost !== undefined) {
        const dPacketsLost = report.packetsLost - this.packetsLost;
        const packetsSend = dPacketsReceived + dPacketsLost;
        stats.packetLoss = packetsSend > 0 ? dPacketsLost / packetsSend : 0;
      }
    }

    stats.jitter = report.jitter;

    //latency = remoteReport.remoteTimestamp ? remoteReport.timestamp - remoteReport.remoteTimestamp : undefined;
    this.setState(report, remoteReport);
    return stats;
  }
}
