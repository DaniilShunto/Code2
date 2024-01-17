// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export interface NetworkEndpoint {
  port: number;
  address?: string;
  protocol: RTCIceProtocol;
  networkType?: string;
}

function candidateToEndpoint(candidate: RTCIceCandidate): NetworkEndpoint | undefined {
  const { address, port, protocol, networkType } = candidate;

  const isAddressValid = address && address.length > 0 && address !== '(redacted)';

  if (port === null || protocol === null) {
    return undefined;
  }
  return {
    address: isAddressValid ? address : undefined,
    port,
    protocol,
    networkType,
  };
}

export interface CandidatePairStats {
  timestamp: number;
  avgRTT?: number;
  bitRateDown?: number;
  bitRateUp?: number;
  packetLoss?: number;
  dataLoss?: number;
  remoteEndpoint?: NetworkEndpoint;
  localEndpoint?: NetworkEndpoint;
}

export class CandidatePairState {
  timestamp = 0;
  bytesReceived = 0;
  bytesSent = 0;
  totalRoundTripTime = 0;
  responsesReceived = 0;
  packetsSent = 0;
  packetsDiscardedOnSend = 0;
  bytesDiscardedOnSend = 0;

  remoteEndpoint?: NetworkEndpoint;
  localEndpoint?: NetworkEndpoint;

  constructor(report: RTCIceCandidatePairStats, localCandidate: RTCIceCandidate, remoteCandidate: RTCIceCandidate) {
    this.remoteEndpoint = candidateToEndpoint(remoteCandidate);
    this.localEndpoint = candidateToEndpoint(localCandidate);

    this.setState(report);
  }

  private setState(report: RTCIceCandidatePairStats) {
    this.timestamp = report.timestamp;
    this.bytesReceived = report.bytesReceived || 0;
    this.bytesSent = report.bytesSent || 0;
    this.totalRoundTripTime = report.totalRoundTripTime || 0;
    this.responsesReceived = report.responsesReceived || 0;
    this.packetsSent = report.packetsSent || 0;
    this.packetsDiscardedOnSend = report.packetsDiscardedOnSend || 0;
    this.bytesDiscardedOnSend = report.bytesDiscardedOnSend || 0;
  }

  public update(report: RTCIceCandidatePairStats): CandidatePairStats {
    const rates: CandidatePairStats = {
      timestamp: report.timestamp,
      localEndpoint: this.localEndpoint,
      remoteEndpoint: this.remoteEndpoint,
    };

    /*
     The reports contain absolut or sum values,
     So we need to compute the change since the last report.
     We prefix these delta values with `d`.
     */
    const dt = (report.timestamp - this.timestamp) / 1000.0;
    let dBytesSend;

    if (report.bytesReceived !== undefined && report.bytesSent !== undefined) {
      const dBytesReceived = report.bytesReceived - this.bytesReceived;
      rates.bitRateDown = (dBytesReceived * 8) / dt;
      dBytesSend = report.bytesSent - this.bytesSent;
      rates.bitRateUp = (dBytesSend * 8) / dt;
    }

    // non Firefox (v97) below here
    if (report.responsesReceived && report.totalRoundTripTime) {
      const dReports = report.responsesReceived - this.responsesReceived;
      const dRoundTripTime = report.totalRoundTripTime - this.totalRoundTripTime;
      rates.avgRTT = dReports > 0 ? dRoundTripTime / dReports : report.currentRoundTripTime;
    }

    if (report.packetsSent !== undefined && report.packetsDiscardedOnSend !== undefined) {
      const dPackets = report.packetsSent - this.packetsSent;
      const dLostPackets = report.packetsDiscardedOnSend - this.packetsDiscardedOnSend;
      rates.packetLoss = dPackets > 0 ? dLostPackets / (dPackets + dLostPackets) : 0;
    }

    if (dBytesSend !== undefined && report.bytesDiscardedOnSend !== undefined) {
      const dLostBytes = report.bytesDiscardedOnSend - this.bytesDiscardedOnSend;
      rates.dataLoss = dLostBytes / (dBytesSend + dLostBytes);
    }
    /*
    if (report.availableOutgoingBitrate) {
      // not yet in Firefox
      console.debug(`est. upstream ${formatBitRate(report.availableOutgoingBitrate)}`);
    }
    if (report.availableIncomingBitrate) {
      //Safari only
      console.debug(`est. downstream', ${formatBitRate(report.availableIncomingBitrate)}`);
    }
    */
    this.setState(report);
    return rates;
  }
}
