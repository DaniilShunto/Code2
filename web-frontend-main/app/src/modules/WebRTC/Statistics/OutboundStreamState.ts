// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { StreamStats } from './ConnectionStats';
import { StreamState } from './StreamState';

export class OutboundStreamState extends StreamState {
  bytesSent = 0;
  packetsSent = 0;
  retransmittedPacketsSent = 0;
  packetsLost = 0;
  jitter?: number;
  roundTripTime?: number;

  constructor(report: RTCOutboundRtpStreamStats, remoteReport?: RTCRemoteInboundRtpStreamStats) {
    super(report);
    this.setState(report, remoteReport);
  }

  protected setState(report: RTCOutboundRtpStreamStats, remoteReport?: RTCRemoteInboundRtpStreamStats) {
    super.setState(report);
    this.bytesSent = report.bytesSent || 0;
    this.packetsSent = report.packetsSent || 0;
    this.retransmittedPacketsSent = report.retransmittedPacketsSent || 0;
    this.packetsLost = remoteReport?.packetsLost || 0;
    this.jitter = remoteReport?.jitter;
    this.roundTripTime = remoteReport?.roundTripTime;
  }

  public update(report: RTCOutboundRtpStreamStats, remoteReport?: RTCRemoteInboundRtpStreamStats): StreamStats {
    if (this.timestamp >= report.timestamp) {
      throw Error('called twice or for an old report');
    }

    const stats: StreamStats = { type: 'outbound', timestamp: report.timestamp, ...this.updateMedia(report) };
    const dt = (report.timestamp - this.timestamp) / 1000.0;
    if (report.bytesSent !== undefined) {
      const dBytesSent = report.bytesSent - this.bytesSent;
      const byteRate = dBytesSent / dt;
      stats.bitRate = 8 * byteRate;
    }

    if (report.packetsSent !== undefined) {
      const dPacketsSent = report.packetsSent - this.packetsSent;

      stats.packetRate = dPacketsSent / dt;

      if (dPacketsSent > 0) {
        if (remoteReport?.packetsLost !== undefined) {
          const dPacketsLost = remoteReport.packetsLost - this.packetsLost;
          stats.packetLoss = dPacketsLost / dPacketsSent;
        }

        if (report.retransmittedPacketsSent !== undefined) {
          const dPacketsRetransmitted = report.retransmittedPacketsSent - this.retransmittedPacketsSent;
          stats.retransmitRatio = dPacketsRetransmitted / dPacketsSent;
        }
      }
    }

    stats.jitter = remoteReport?.jitter;
    stats.roundTripTime = remoteReport?.roundTripTime;

    this.setState(report, remoteReport);
    return stats;
  }
}
