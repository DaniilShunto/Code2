// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';

import { getEnumKey } from '../../utils/stringUtils';
import { BaseEventEmitter } from '../EventListener';

export const videoSettingToString = (setting: VideoSetting) => getEnumKey(VideoSetting, setting);

export type BandwidthControllerEvent = {
  limit: VideoSetting;
};

/**
 * A multi-level backoff controller for video streams.
 * It will decrease the quality by one level on data loss signaled by
 * `onPacketLoss()`.
 * The backoff starts with `baseInterval` on each quality level and
 * will double after each check as long as the loss persists
 * until `maxInterval` is reached.
 *
 * This controller is quite simple and assumes that there is no accurate bandwidth
 * estimation, therefore it has to "trial and error".
 */

export class BandwidthController extends BaseEventEmitter<BandwidthControllerEvent> {
  private _qualityLimit = VideoSetting.High;

  private backoffExponents = new Map<VideoSetting, number>();

  private backoffStart = performance.now();
  private timeout?: NodeJS.Timeout;

  // all intervals in milliseconds
  protected readonly baseInterval: number;
  protected readonly maxInterval: number;
  protected readonly lockInterval: number;

  public readonly minQuality: VideoSetting;

  /**
   * Creates a multi-level backoff controller.
   *
   * @param minQuality - lowest quality that will not be downgraded further
   * @param baseInterval - smallest interval to wait on loss
   * @param maxInterval - highest interval to wait before re-checking
   * @param lockInterval - interval during the that new loss signals will be ignored (baseInterval > lockInterval)
   */

  constructor(minQuality: VideoSetting, baseInterval: number, maxInterval = 6 * 60_000, lockInterval?: number) {
    super();
    this.minQuality = minQuality;
    this.baseInterval = baseInterval;
    this.maxInterval = maxInterval;
    this.lockInterval = lockInterval || baseInterval / 2;
  }

  private setQualityLimit(limit: VideoSetting) {
    this._qualityLimit = limit;
    this.eventEmitter.emit('limit', limit);
  }

  public get qualityLimit() {
    return this._qualityLimit;
  }

  private readonly backoffEndHandler = this.onBackoffEnd.bind(this);
  private readonly checkEndHandler = this.onCheckEnd.bind(this);

  private getStageBackoffExponent(quality: VideoSetting) {
    return this.backoffExponents.get(quality);
  }

  /**
   * The backoff time starts at the base interval at exponent zero and doubles
   * with each increase.
   *
   * @param exponent - each increase double the backoff time
   * @returns backoffTime = baseInterval * 2 ^ exponent;
   */
  private calculateBackoffTime(exponent: number) {
    return this.baseInterval * (1 << exponent);
  }

  private increaseStageBackoffExponent(quality: VideoSetting) {
    const currentExponent = this.backoffExponents.get(quality);
    if (currentExponent === undefined) {
      this.backoffExponents.set(quality, 0);
    } else {
      const nextExponent = currentExponent + 1;
      const nextBackoffTime = this.calculateBackoffTime(nextExponent);
      if (nextBackoffTime <= this.maxInterval) {
        this.backoffExponents.set(quality, nextExponent);
      } else {
        console.warn(
          `backoff time reached its limit at ${nextBackoffTime / 60_000}min (${
            this.baseInterval
          } * 2^${currentExponent} ms)`
        );
      }
    }
  }

  private resetStageBackoffExponent(quality: VideoSetting) {
    this.backoffExponents.delete(quality);
  }

  private currentBackoffPeriod() {
    const currentBackoffExponent = this.getStageBackoffExponent(this.qualityLimit);
    if (currentBackoffExponent === undefined) {
      return undefined;
    }
    return this.calculateBackoffTime(currentBackoffExponent);
  }

  private startBackoff() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const backoffPeriod = this.currentBackoffPeriod();
    if (backoffPeriod === undefined) {
      throw new Error('invalid backoff state: backoff exponent / time not set while recovering');
    }
    console.debug(
      `backoff for ${backoffPeriod / 1000}s at level ${videoSettingToString(this.qualityLimit)}`,
      this.backoffExponents
    );
    this.timeout = setTimeout(this.backoffEndHandler, backoffPeriod);
  }

  private onBackoffEnd() {
    if (this.qualityLimit >= VideoSetting.High) {
      throw new Error('invalid backoff state: backoff ended when unlimited');
    }
    const backoffPeriod = this.currentBackoffPeriod();
    if (backoffPeriod === undefined) {
      throw new Error('invalid backoff state: backoff exponent / time not set while recovering');
    }
    console.debug(
      `backoff period ended - checking at level ${videoSettingToString(this.qualityLimit)}`,
      this.backoffExponents
    );
    this.timeout = setTimeout(this.checkEndHandler, this.baseInterval + backoffPeriod);
    this.setQualityLimit(this.qualityLimit + 1);
  }

  private onCheckEnd() {
    this.timeout = undefined;
    if (this.qualityLimit <= this.minQuality) {
      throw new Error('invalid backoff state: check ended done on lowest level');
    }
    this.resetStageBackoffExponent(this.qualityLimit - 1);

    if (this.qualityLimit < VideoSetting.High) {
      // continue backoff one level up
      console.debug(
        `backoff continue at next stage - upgrade quality to ${videoSettingToString(this.qualityLimit)}`,
        this.backoffExponents
      );
      this.startBackoff();
    } else {
      console.debug(`backoff done - limit at ${videoSettingToString(this.qualityLimit)}`, this.backoffExponents);
      if (this.getStageBackoffExponent(VideoSetting.High) !== undefined) {
        throw new Error('invalid backoff state: backoff exponent set while unlimited');
      }
    }
  }

  /**
   * Issues a data loss signal and start a backoff period on a lower quality level.
   */
  public downgradeTemporarily() {
    const now = performance.now();
    const lockExpiryTime = this.backoffStart + this.lockInterval;

    if (lockExpiryTime > now) {
      console.debug(`paket loss signal - still locked for ${(lockExpiryTime - now) / 1000}s`);
      return;
    }

    this.backoffStart = now;

    if (this.qualityLimit > this.minQuality) {
      console.debug(`paket loss signal - init backoff`);
      this.setQualityLimit(this.qualityLimit - 1);
      this.increaseStageBackoffExponent(this.qualityLimit);
      this.startBackoff();
    } else {
      console.warn(`paket loss signal while low quality(${this.minQuality}) mode`);
    }
  }
}
