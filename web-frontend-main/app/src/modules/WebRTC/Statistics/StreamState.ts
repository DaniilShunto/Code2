// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export interface MediaStats {
  frameSkip?: number;
  pictureLoss?: number;
  nackPackets?: number;
  frameRate?: number;
  codingTime?: number;
  frameWidth?: number;
  frameHeight?: number;
}

type AnyRtpStreamStats = RTCOutboundRtpStreamStats | RTCInboundRtpStreamStats;

export class StreamState {
  timestamp = 0;
  kind: 'audio' | 'video';

  nackCount = 0;
  firCount = 0;
  pliCount = 0;

  totalCodingTime = 0;
  frameCount = 0;
  frameWidth?: number;
  frameHeight?: number;

  constructor(report: AnyRtpStreamStats) {
    if (!(report.kind === 'audio' || report.kind === 'video')) {
      throw new Error(`unknown stream kind ${report.kind}`);
    }
    this.kind = report.kind;
    this.setState(report);
  }

  private static frameCount(report: AnyRtpStreamStats): number | undefined {
    if ('framesDecoded' in report) {
      return report.framesDecoded;
    }
    if ('framesEncoded' in report) {
      return report.framesEncoded;
    }
  }

  private static totalCodingTime(report: AnyRtpStreamStats): number | undefined {
    if ('totalDecodeTime' in report) {
      return report.totalDecodeTime;
    }
    if ('totalEncodeTime' in report) {
      return report.totalEncodeTime;
    }
  }

  protected setState(report: AnyRtpStreamStats) {
    this.timestamp = report.timestamp;
    if (report.kind !== this.kind) {
      throw new Error(`stream kind ${this.kind} does not match ${report.kind}`);
    }

    this.nackCount = report.nackCount || 0;
    this.firCount = report.firCount || 0;
    this.pliCount = report.pliCount || 0;

    this.frameCount = StreamState.frameCount(report) || 0;
    this.totalCodingTime = StreamState.totalCodingTime(report) || 0;
    this.frameWidth = report.frameWidth;
    this.frameHeight = report.frameHeight;
  }

  protected updateMedia = (report: AnyRtpStreamStats): MediaStats => {
    const stats: MediaStats = {};
    const dt = (report.timestamp - this.timestamp) / 1000.0;

    switch (report.kind) {
      case 'video':
        if (this.kind !== 'video') {
          throw Error('track stats report type does not match previous one');
        }
        if (report.nackCount !== undefined) {
          stats.nackPackets = report.nackCount - this.nackCount;
        }
        if (report.firCount !== undefined) {
          stats.frameSkip = report.firCount - this.firCount;
        }
        if (report.pliCount !== undefined) {
          stats.pictureLoss = report.pliCount - this.pliCount;
        }

        {
          const frameCount = StreamState.frameCount(report) || 0;
          const totalCodingTime = StreamState.totalCodingTime(report) || 0;
          if (frameCount) {
            stats.frameRate = (frameCount - this.frameCount) / dt;

            if (totalCodingTime) {
              stats.codingTime = totalCodingTime / frameCount;
            }
          }
        }

        stats.frameWidth = report.frameWidth;
        stats.frameHeight = report.frameHeight;
        break;
      case 'audio':
        /* TODO
          if(prevReport.kind !== 'audio') {
            throw Error('track stats report type does not match previous one');
          }
          packetsDiscarded: 0
          */
        break;
      default:
        break;
    }
    return stats;
  };
}
