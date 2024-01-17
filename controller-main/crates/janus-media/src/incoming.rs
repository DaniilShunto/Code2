// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

use serde::Deserialize;
use types::signaling::media::command::{
    AssociatedMediaSession, MediaSessionInfo, ParticipantSelection, RequestMute, Target,
    TargetConfigure, TargetSubscribe, TargetedCandidate, TargetedSdp,
};

#[derive(Debug, Deserialize)]
#[serde(tag = "action")]
pub enum MediaCommand {
    /// The participant successfully established a stream
    #[serde(rename = "publish_complete")]
    PublishComplete(MediaSessionInfo),

    /// The participants publish stream has stopped (for whatever reason)
    #[serde(rename = "unpublish")]
    Unpublish(AssociatedMediaSession),

    /// The participant updates its stream-state
    ///
    /// This can be mute/unmute of video or audio
    #[serde(rename = "update_media_session")]
    UpdateMediaSession(MediaSessionInfo),

    /// A moderators request to mute one or more participants
    #[serde(rename = "moderator_mute")]
    ModeratorMute(RequestMute),

    /// SDP offer
    #[serde(rename = "publish")]
    Publish(TargetedSdp),

    /// SDP Answer
    #[serde(rename = "sdp_answer")]
    SdpAnswer(TargetedSdp),

    /// SDP Candidate
    #[serde(rename = "sdp_candidate")]
    SdpCandidate(TargetedCandidate),

    /// SDP EndOfCandidate
    #[serde(rename = "sdp_end_of_candidates")]
    SdpEndOfCandidates(Target),

    /// SDP request offer
    #[serde(rename = "subscribe")]
    Subscribe(TargetSubscribe),

    /// Restart an existing subscription
    #[serde(rename = "resubscribe")]
    Resubscribe(Target),

    /// Grant the presenter role for a set of participants
    #[serde(rename = "grant_presenter_role")]
    GrantPresenterRole(ParticipantSelection),

    /// Revoke the presenter role for a set of participants
    #[serde(rename = "revoke_presenter_role")]
    RevokePresenterRole(ParticipantSelection),

    /// SDP request to configure subscription
    #[serde(rename = "configure")]
    Configure(TargetConfigure),
}

#[cfg(test)]
mod test {
    use super::*;
    use pretty_assertions::assert_eq;
    use test_util::serde_json::json;
    use types::{
        core::ParticipantId,
        signaling::media::{mcu::MediaSessionType, TrickleCandidate},
    };

    #[test]
    fn publish() {
        let json = json!({
            "action": "publish_complete",
            "media_session_type": "video",
            "media_session_state": {
                "audio": false,
                "video": false,
            },
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::PublishComplete(MediaSessionInfo {
            media_session_type,
            media_session_state,
        }) = msg
        {
            assert_eq!(media_session_type, MediaSessionType::Video);
            assert!(!media_session_state.audio);
            assert!(!media_session_state.video);
        } else {
            panic!()
        }
    }

    #[test]
    fn unpublish() {
        let json = json!({
            "action": "unpublish",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::Unpublish(AssociatedMediaSession { media_session_type }) = msg {
            assert_eq!(media_session_type, MediaSessionType::Video);
        } else {
            panic!()
        }
    }

    #[test]
    fn update_media_session() {
        let json = json!({
            "action": "update_media_session",
            "media_session_type": "video",
            "media_session_state": {
                "audio": true,
                "video": false,
            },
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::UpdateMediaSession(MediaSessionInfo {
            media_session_type,
            media_session_state,
        }) = msg
        {
            assert_eq!(media_session_type, MediaSessionType::Video);
            assert!(media_session_state.audio);
            assert!(!media_session_state.video);
        } else {
            panic!()
        }
    }

    #[test]
    fn moderator_mute_single() {
        let json = json!({
            "action": "moderator_mute",
            "targets": ["00000000-0000-0000-0000-000000000000"],
            "force": true,
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::ModeratorMute(RequestMute { targets, force }) = msg {
            assert_eq!(targets, vec![ParticipantId::nil()]);
            assert!(force);
        } else {
            panic!()
        }
    }

    #[test]
    fn moderator_mute_many() {
        let json = json!({
            "action": "moderator_mute",
            "targets": ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000001", "00000000-0000-0000-0000-000000000002"],
            "force": false,
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::ModeratorMute(RequestMute { targets, force }) = msg {
            assert_eq!(
                targets,
                [
                    ParticipantId::from_u128(0),
                    ParticipantId::from_u128(1),
                    ParticipantId::from_u128(2)
                ]
            );
            assert!(!force);
        } else {
            panic!()
        }
    }

    #[test]
    fn offer() {
        let json = json!({
            "action": "publish",
            "sdp": "v=0\r\n...",
            "target": "00000000-0000-0000-0000-000000000000",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::Publish(TargetedSdp {
            sdp,
            target:
                Target {
                    target,
                    media_session_type,
                },
        }) = msg
        {
            assert_eq!(sdp, "v=0\r\n...");
            assert_eq!(target, ParticipantId::nil());
            assert_eq!(media_session_type, MediaSessionType::Video);
        } else {
            panic!()
        }
    }

    #[test]
    fn answer() {
        let json = json!({
            "action": "sdp_answer",
            "sdp": "v=0\r\n...",
            "target": "00000000-0000-0000-0000-000000000000",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::SdpAnswer(TargetedSdp {
            sdp,
            target:
                Target {
                    target,
                    media_session_type,
                },
        }) = msg
        {
            assert_eq!(sdp, "v=0\r\n...");
            assert_eq!(target, ParticipantId::nil());
            assert_eq!(media_session_type, MediaSessionType::Video);
        } else {
            panic!()
        }
    }

    #[test]
    fn candidate() {
        let json = json!({
            "action": "sdp_candidate",
            "candidate": {
                "candidate": "candidate:4 1 UDP 123456 192.168.178.1 123456 typ host",
                "sdpMLineIndex": 1,
            },
            "target": "00000000-0000-0000-0000-000000000000",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::SdpCandidate(TargetedCandidate {
            candidate:
                TrickleCandidate {
                    sdp_m_line_index,
                    candidate,
                },
            target:
                Target {
                    target,
                    media_session_type,
                },
        }) = msg
        {
            assert_eq!(sdp_m_line_index, 1);
            assert_eq!(
                candidate,
                "candidate:4 1 UDP 123456 192.168.178.1 123456 typ host"
            );
            assert_eq!(target, ParticipantId::nil());
            assert_eq!(media_session_type, MediaSessionType::Video);
        } else {
            panic!()
        }
    }

    #[test]
    fn end_of_candidates() {
        let json = json!({
            "action": "sdp_end_of_candidates",
            "target": "00000000-0000-0000-0000-000000000000",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::SdpEndOfCandidates(Target {
            target,
            media_session_type,
        }) = msg
        {
            assert_eq!(target, ParticipantId::nil());
            assert_eq!(media_session_type, MediaSessionType::Video);
        } else {
            panic!()
        }
    }

    #[test]
    fn request_offer() {
        let json = json!({
            "action": "subscribe",
            "target": "00000000-0000-0000-0000-000000000000",
            "media_session_type": "video",
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::Subscribe(TargetSubscribe {
            target:
                Target {
                    target,
                    media_session_type,
                },
            without_video,
        }) = msg
        {
            assert_eq!(target, ParticipantId::nil());
            assert_eq!(media_session_type, MediaSessionType::Video);
            assert!(!without_video);
        } else {
            panic!()
        }
    }

    #[test]
    fn grant_presenter_role() {
        let json = json!({
            "action": "grant_presenter_role",
            "participant_ids": ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000"],
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::GrantPresenterRole(ParticipantSelection { participant_ids }) = msg {
            assert_eq!(
                participant_ids,
                vec![ParticipantId::nil(), ParticipantId::nil()]
            );
        } else {
            panic!()
        }
    }

    #[test]
    fn revoke_presenter_role() {
        let json = json!({
            "action": "revoke_presenter_role",
            "participant_ids": ["00000000-0000-0000-0000-000000000000", "00000000-0000-0000-0000-000000000000"],
        });

        let msg: MediaCommand = serde_json::from_value(json).unwrap();

        if let MediaCommand::RevokePresenterRole(ParticipantSelection { participant_ids }) = msg {
            assert_eq!(
                participant_ids,
                vec![ParticipantId::nil(), ParticipantId::nil()]
            );
        } else {
            panic!()
        }
    }
}
