<#--
SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>

SPDX-License-Identifier: EUPL-1.2
-->

messages = Nachrichten
dismiss = Verwerfen
title-filename = Dateiname
state-created = Erstellt
title-actions = Aktionen
action-delete = löschen
action-download = Download
global-calendar-week = KW

error-fetch-4xx = Ladefehler
error-general = Ups, hier ist leider etwas schiefgelaufen. Bitte versuche es erneut.
error-invite-link = Dieser Einladungs-Link ist nicht mehr aktiv.
signaling-subscription-failed = Die Verbindung zu einen Teilnehmer ist leider fehlgeschlagen.
media-subscription-failed = Keine Verbindung zum Teilnehmer

error-system-currently-unavailable = Das System ist zur Zeit nicht erreichbar, bitte versuchen sie es später nochmal.
error-unauthorized = Sie haben leider keinen Zugriff, bitte kontaktieren Sie den Moderator des Meetings.

login-form-title = Anmeldung
login-form-body = Bitte melden Sie sich an
login-form-body-loading = Anmeldung läuft
login-form-button-submit = Anmelden

route-not-found = Pfad nicht verfügbar
room = Raum {$roomNumber}
joinform-title = Konferenz beitreten
joinform-enter-name = Bitte Namen eingeben
joinform-enter-now = Jetzt beitreten
joinform-enter-password = Passwort
joinform-waiting-room-enter = Warteraum aktiv - bitte warten...
joinform-wrong-room-password = Das eingegebene Passwort ist falsch.
joinform-access-denied = Zugriff verweigert: Sie sind nicht berechtigt an diesem Meeting teilzunehmen.
field-error-required = "{$fieldName}" ist ein Pflichtfeld
joinform-banned-from-room = Sie wurden permanent vom diesen Meeting ausgeschlossen.
joinform-room-not-found = Raum nicht gefunden.
joinform-display-name-field-disabled-tooltip = Editieren gem. Organisationspolice nicht möglich.
joinform-room-title = Einladung zum OpenTalk-Meeting - "{$title}"

room-loading-setup = <title>Verbindung wird konfiguriert...</title>
room-loading-starting = <title>Verbindung wird aufgebaut...</title>
room-loading-reconnect = <title>Verbindung wird wieder hergestellt...</title>
room-loading-generic = <title>Raum wird geladen...</title>
room-loading-blocked = <title>Die maximale Teilnehmerzahl ist erreicht</title><bodyText>Sobald eine Position in dem Raum frei wird, verbinden wir automatisch.<br /> Bitte warten Sie oder kontaktieren Sie den Moderator.</bodyText>

http-error-message-400 = Der Raum kann nicht erstellt oder geändert werden. Bitte versuchen Sie es erneut
http-error-message-401 = Sie sind für diese Aktion nicht autorisiert
http-error-message-403 = Diese Aktion ist nicht erlaubt
http-error-message-404 = Wir konnten den gewünschten Raum nicht finden
http-error-message-500 = Netzwerk / Server derzeit nicht verfügbar. Bitte versuchen Sie es später erneut
http-error-message-password = Passwort stimmt nicht überein
http-error-message-credentials = Die angegebenen Anmeldeinformationen sind falsch
http-error-message-no-breakout-room = Dieser Breakout-Raum existiert nicht

auth-popup-closes-message = Dieses Popup schließt automatisch.
auth-redirect-message = Sie werden in kürze zurück geleitet.
copy-url-to-clipboard = URL in die Zwischenablage kopieren
toggle-password-visibility = Passwortsichtbarkeit umschalten

echotest-warn-no-echo-cancellation = Ihr Browser unterstützt keine Echo-Unterdrückung. Bitte nutzen Sie Kopfhörer um Rückkopplungen zu vermeiden.
audiomenu-choose-input = Audioeingabegerät auswählen
videomenu-choose-input = Kamera auswählen
devicemenu-wait-for-permission = Warte auf Gerätefreigabe
device-permission-denied = Gerätefreigabe verweigert. Bitte prüfen Sie Ihre Einstellungen.
quality-cap-setting = Videoqualität
quality-audio-only = Aus
quality-low = Niedrig
quality-medium = Mittel
quality-high = Hoch
videomenu-settings = Einstellungen
videomenu-blur-on = Hintergrundfilter an
videomenu-blur-off = Hintergrundfilter aus
videomenu-mirroring-on = Eigenes Video spiegeln
videomenu-mirroring-off = Eigenes Video nicht spiegeln
videomenu-background = Hintergrund
videomenu-background-images = Hintergrundbilder
videomenu-background-no-image = Kein Hintergrundbild
localvideo-no-device = Keine Videocamera vorhanden oder freigegeben
remotevideo-no-stream = Kein Videosignal

participant-stream-broken-tooltip = Medienstrom unterbrochen
participant-audio-broken-tooltip = Audiokanal unterbrochen
participant-video-broken-tooltip = Videokanal unterbrochen
participant-stream-disconnected = Teilnehmerverbindung unterbrochen
participant-stream-failed = Teilnehmerverbindung fehlgeschlagen

media-denied-warning =
    Sie haben { $mediaType ->
        [video] die Kamera
        [audio] das Mikrofon
        [screen] den Bildschirm
        *[unknown] das Gerät
    } nicht freigegeben oder die Freigabe abgebrochen.
    Bitte prüfen Sie die Berechtigungseinstellungen neben der Addressleiste, wenn Sie ihn dennoch freigeben möchten.

media-access-error =
    Fehler beim Zugriff auf { $mediaType ->
        [video] die Kamera
        [audio] das Mikrofon
        [screen] den Bildschirm
        *[unknown] das Gerät
    }.
    Bitte prüfen Sie, ob es gerade von einer anderen Anwendung genutzt wird.

media-ice-connection-not-possible = Die Verbindung zu den anderen Teilnehmer konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung und Firewall. Kontaktieren Sie bitte Ihren Administrator, wenn das Problem weiterhin besteht.

input-search-placehoder = Suche...
chatbar-send-message = Senden
chatbar-input-placehoder = Nachricht eingeben
chatbar-unknown-username = Unbekannt

chat-private-scope = Privat senden
chat-group-scope = Gruppen
chat-global-scope = Raum
chat-error-invalid-group-selection = Die Gruppe, an die die Nachricht gerichtet ist, ist nicht verfügbar.
chat-error-invalid-participant-selection = Der Empfänger der Nachricht ist nicht mehr anwesend.
chat-new-private-message = Sie haben eine neue Nachricht
chat-new-group-message = Sie haben eine neue Nachricht
chat-message-error-max-input = Die Nachricht ist zu lang (max {$maxCharacters} Zeichen)
event_chat = Event Chat
chatinput-placeholder = Nachricht schreiben...
chat-input-error-required = Die Nachricht darf nicht leer sein
chat-no-search-results = Keine Nachrichten, die den Kriterien entsprechen
chat-search-reset = Zurücksetzen
chat-delete-global-messages-success = Der globale Chat wurde durch den Moderator gelöscht.
chat-open-emoji-picker = emoji picker öffnen
chat-close-emoji-picker = emoji picker schließen
chat-submit-button = Chat Nachricht absenden
chat-smiley-label = lächelndes Gesicht-Emoji

no-group-participants-label = Ohne Gruppe
button-back-messages = zurück
participant-menu-send-message = Nachricht senden
participant-menu-remove-participant = Teilnehmer entfernen
participant-menu-grant-moderator = Moderatorenrechte einräumen
participant-menu-revoke-moderator = Moderatorenrechte entziehen
participant-menu-accept-participant = Teilnehmer aufnehmen
participant-menu-accepted-participant = Teilnehmer aufgenommen
button-new-message = Neue Nachricht
empty-messages = Sie haben zur Zeit keine Nachrichten. Erstellen Sie eine und starten Sie eine Private- oder Gruppenkonversation.
encrypted-messages = Dies ist der Anfang Ihres Chatverlaufs. Niemand hat Zugriff auf den Inhalt Ihres Chats außer den Personen, die im Chat sind.

moderation-rights-granted = Ihnen wurden die Moderatorenrechte gewährt
moderation-rights-revoked = Ihnen wurden die Moderatorenrechte entzogen

sort-label = Reihenfolge
sort-by = Sortierung nach
sort-groups-on = Gruppenfilter an
sort-groups-off = Gruppenfilter aus
sort-name-asc = Name (A - Z)
sort-name-dsc = Name (Z - A)
sort-first-join = Zuerst beigetreten
sort-last-join = Zuletzt beigetreten
sort-last-active = Zuletzt aktiv
sort-raised-hand = Zuerst Handzeichen gegeben
sort-random = Zufällig

grant-presenter-role = Präsentatorrolle zuweisen
revoke-presenter-role = Widerrufen Sie die Rolle des Präsentators

menutabs-chat = Chat
menutabs-people = Teilnehmer
menutabs-messages = Nachrichten

guest-label = Gast

# $roomName (String) - Raumname.
# $timeInSeconds (Number) - The duration in seconds.
# $numberOfOtherRooms (number) - Anzahl an weiteren räumen.
breakout-notification-members-in-breakout-room = Teilnehmer in Breakout-Raum {$roomName}
breakout-notification-new-session-header = Neue Breakout Session gestartet
breakout-notification-new-session-cta = Eine neue Breakout Session wurde gestartet. Bitte treten Sie einem der folgenden Räume bei. Sie haben {$timeInSeconds ->
    [one] eine Sekunde
   *[other] {$timeInSeconds} Sekunden,
} bevor Sie einem zufälligen Raum zugeordnet werden.
breakout-notification-new-session-button = Breakout-Raum {$roomName} jetzt betreten
breakout-notification-joined-breakout-room-header = Breakout-Raum betreten
breakout-notification-joined-breakout-room-body = Sie sind Breakout-Raum {$roomName} beigetreten
breakout-notification-joined-session-header = Breakout Session aktiv
breakout-notification-joined-session-cta = Sie sind einer Konferenz beigetreten, die aktuell in einer Breakout Session ist. Bitte treten Sie einem Breakout-Raum bei. {$numberOfOtherRooms ->
    [one] Der folgende andere Raum ist
   *[other] Die folgenden {$numberOfOtherRooms} anderen Räume sind
} betretbar:
breakout-notification-joined-session-button = Zu Breakout-Raum {$roomName} wechseln
breakout-notification-session-ended-header = Breakout Session beended
breakout-notification-session-ended-cta = Die Breakout Session wurde beendet. Bitte gehen Sie zurück in den Hauptraum. Nach {$timeInSeconds} Sekunden werden Sie automatisch zurückgeführt.

toolbar-button-audio-turn-on-tooltip-title = Mikrofon aktivieren
toolbar-button-audio-turn-off-tooltip-title = Mikrofon deaktivieren
toolbar-button-audio-context-title = Zusatzoptionen Mikrofon
toolbar-button-video-turn-on-tooltip-title = Kamera aktivieren
toolbar-button-video-turn-off-tooltip-title = Kamera deaktivieren
toolbar-button-video-context-title = Zusatzoptionen Kamera
toolbar-button-raise-hand-tooltip-title = Hand heben
toolbar-button-lower-hand-tooltip-title = Hand runternehmen
toolbar-button-handraises-disabled = Der Moderator hat das Handheben deaktiviert
toolbar-button-blur-turn-on-tooltip-title = Hintergrund-Filter aktivieren
toolbar-button-blur-turn-off-tooltip-title = Hintergrund-Filter deaktivieren
toolbar-button-more-tooltip-title = Mehr Einstellungen
toolbar-button-screen-share-turn-on-tooltip-title = Bildschirm teilen
toolbar-button-screen-share-turn-off-tooltip-title = Bildschirm nicht mehr teilen
toolbar-button-end-call-tooltip-title = Raum verlassen

toolbar-button-screen-share-tooltip-request-moderator-presenter-role = Frage einen Moderator um deinen Bildschirm zu teilen

toolbar-aria-label = Persönliche Kontrollleiste

more-menu-leave-call = Anruf beenden
more-menu-create-invite = Gast einladen
more-menu-start-recording = Aufnahme starten
more-menu-stop-recording = Aufnahme beenden

more-menu-enable-waiting-room = Warteraum aktivieren
more-menu-disable-waiting-room = Warteraum deaktivieren
more-menu-turn-handraises-on = Handheben aktivieren
more-menu-turn-handraises-off = Handheben deaktivieren
more-menu-keyboard-shortcuts = Tastaturkürzel
more-menu-delete-global-chat = globalen Chat leeren
waiting-room-enabled-message = Warteraum ist aktiviert
waiting-room-disabled-message = Warteraum ist deaktiviert
more-menu-enable-chat = Chat aktivieren
more-menu-disable-chat = Chat deaktivieren
more-menu-moderator-aria-label = Öffne Menu für mehr Optionen
chat-enabled-message = Der Chat wurde durch den Moderator aktiviert
chat-disabled-message = Der Chat wurde durch den Moderator deaktiviert
chat-disabled-tooltip = Der Chat wurde durch den Moderator deaktiviert

turn-handraises-off-notification = Der Moderator hat das Handheben deaktiviert
turn-handraises-on-notification = Der Moderator hat das Handheben aktiviert

waiting-room-participant-label = Warteraum

in-waiting-room = Sie befinden sich gerade im Warteraum
in-waiting-room-ready = Sie sind freigeschaltet

approve-all-participants-from-waiting = Alles genehmigen

moderationbar-button-home-tooltip = Home
moderationbar-button-mute-tooltip = Teilnehmer stummschalten
moderationbar-button-add-user-tooltip = Nutzer hinzufügen ist in Entwicklung
moderationbar-button-breakout-tooltip = Breakout-Räume erstellen
moderationbar-button-poll-tooltip = Umfragen
moderationbar-button-ballot-tooltip = Abstimmungen
moderationbar-button-wollknaul-tooltip = Wollknäuel ist in Entwicklung
moderationbar-button-timer-tooltip = Stoppuhr
moderationbar-button-coffee-break-tooltip = Kaffeepause
moderationbar-button-speaker-queue-tooltip = Diese Funktion befindet sich noch in der Entwicklung - Große Gruppen und jeder soll systematisch einmal zu Wort kommen, OpenTalk behält auch bei vielen Teilnehmern den Überblick und ruft automatisch alle der Reihe nach auf. Noch während ein Teilnehmer spricht, wird dem nächsten Teilnehmer sein bevorstehender Aufruf angezeigt. Effiziente Meetings ohne Verwirrung, mit OpenTalk kein Problem.
moderationbar-button-wheel-tooltip = Diese Funktion befindet sich noch in der Entwicklung - Wer beginnt oder ist als Nächstes dran? Unser "Wheel of Names", das gute klassische Glücksrad, lässt den Zufall entscheiden. Abwechslung, Spaß, Spannung -- eine Gamification, die nicht nur im Schulunterricht für Abwechslung und Kurzweiligkeit sorgt.
moderationbar-button-protocol-tooltip = Protokoll
moderationbar-button-whiteboard-tooltip = Whiteboard
moderationbar-button-reset-handraises-tooltip = Gehobene Hände zurücksetzen
moderationbar-button-debriefing = Nachbesprechung
moderationbar-button-talking-stick-tooltip = Redestab
moderationbar-aria-label = Moderationsbar

mute-participants-tab-title = Teilnehmer stummschalten
mute-participants-button-all = Alle
mute-participants-button-selected = Nach Auswahl

talking-stick-tab-title = Redestab
talking-stick-skip-speaker = Redner überspringen
talking-stick-participant-amount-notification = Hinweis: Wir empfehlen den Redestab ab mind. 3 Personen zu benutzen.
talking-stick-started-first-line = Der Redestab wurde gestartet.
talking-stick-started-second-line = Teilnehmerliste entspricht Rednerliste.
talking-stick-finished = Der Redestab ist beendet.
talking-stick-next-announcement = Sie sind als nächstes dran.
talking-stick-speaker-announcement = Sie sind jetzt dran. Bitte schalten Sie das Mikro ein!
talking-stick-notification-unmute = Einschalten
talking-stick-notification-next-speaker = Weitergeben
talking-stick-unmuted-notification = Die Teilnehmen hören Sie jetzt. Wenn Sie fertig sind, geben Sie bitte den Redestab weiter.
talking-stick-unmuted-notification-last-participant = Die Teilnehmer hören... Sie jetzt. Sie sind der letzte Teilnehmer, wenn Sie fertig sind, geben Sie bitte den Redestab ab.

reset-handraises-tab-title = Gehobene Hände zurücksetzen
reset-handraises-button = Alle
reset-handraises-notification = Alle gehobene Hände wurden vom Moderator zurückgesetzt

debriefing-tab-title = Nachbesprechung
debriefing-button-all = Konferenz beenden
debriefing-moderator-section-title = Beenden und Nachbesprechung starten
debriefing-button-moderators = Für Moderatoren
debriefing-button-moderators-and-users = Für Moderatoren + registrierte Nutzer
debriefing-started-notification = Nachbesprechung wurde gestartet - Der Warteraum ist aktiviert.
debriefing-session-ended-notification = Die Konferenz wurde vom Moderator beendet.
debriefing-session-ended-for-all-notification = Die Konferenz ist für alle beendet.

media-received-request-mute-ok = Stummschalten
media-received-force-mute = Sie sind von {$origin} stummgeschaltet worden.
media-received-request-mute = {$origin} möchte, dass Sie sich stummschalten.

dialog-invite-guest-title = Gast einladen
dialog-invite-guest-expiration-date = Ablaufdatum
dialog-invite-guest-no-expiration = Kein Ablaufdatum
dialog-invite-guest-expiration-date-error = Das Ablaufdatum muss mindestens um 5 Minuten in der Zukunft liegen
dialog-invite-guest-button-copy = Link kopieren
dialog-invite-guest-button-submit = Erstellen

statistics-video = Videoauflösung
statistics-fps = Bildrate
statistics-rate = Datenrate
statistics-jitter = Jitter
statistics-packets-lost = Pakete verloren
statistics-decode-time = Decoding-Zeit
statistics-latency = Latenz
statistics-local-network-endpoint = Lokaler Endpunkt
statistics-remote-network-endpoint = Entfernter Endpunkt
statistics-value-redacted = (redigiert)

slotmachine-label=Wheel Of Names
slotmachine-pre-message=Lotterie hat
slotmachine-post-message=Teilnehmer
font-awesome-license = Font Awesome Lizenz

legal-vote-tab-title = Abstimmungen
legal-vote-header-title-create = Abstimmung erstellen
legal-vote-header-title-update = Abstimmung bearbeiten
legal-vote-button-back = zurück
legal-vote-overview-saved-legal-votes = Gespeicherte Abstimmungen
legal-vote-overview-created-legal-votes = Erstellte Abstimmungen
legal-vote-canceled = Abstimmung wurde abgebrochen
legal-vote-stopped = Abstimmung ist beendet
legal-vote-error = Ihre Stimme konnte nicht gewertet werden, es ist ein Fehler aufgetreten.
legal-vote-active-error = Eine Abstimmung ist bereits gestartet.

legal-vote-form-input-error-number = Nur Eingabenummern
legal-vote-form-input-error-max = Die maximal zulässige Anzahl von Zeichen beträgt {$maxCharacters}
legal-vote-input-name-placeholder = Titel
legal-vote-input-subtitle-placeholder = Untertitel
legal-vote-input-topic-placeholder = Thema
legal-vote-input-title-required = Titel erforderlich
legal-vote-input-subtitle-required = Untertitel erforderlich
legal-vote-input-topic-required = Thema erforderlich
legal-vote-input-assignments-required = Mindestens zwei Teilnehmer müssen ausgewählt werden

legal-vote-popover-results-button = Votingergebnisse anzeigen

legal-vote-overview-button-create-vote = Abstimmung erstellen
legal-vote-form-button-save = Speichern
legal-vote-form-button-continue = Fortsetzen

legal-vote-overview-panel-button-cancel = Abbrechen
legal-vote-overview-panel-button-end = Beenden
legal-vote-overview-panel-status-active = Aktiv
legal-vote-overview-panel-status-finished = Beendet
legal-vote-overview-panel-status-canceled = Abgebrochen
legal-vote-select-participants-title = Teilnehmer auswählen

legal-vote-form-duration = Abstimmungsdauer
legal-vote-form-duration-unlimited = unbegrenzt
legal-vote-form-allow-abstain = Enthaltung erlauben
legal-vote-form-auto-stop = Automatische Beendigung
legal-vote-form-hidden-voting = geheime Abstimmung
legal-vote-form-auto-stop-tooltip = Automatisches Beenden, sobald alle Stimmen abgegeben wurden, aktivieren oder deaktivieren.

legal-vote-yes-label = Zustimmung
legal-vote-no-label = Ablehnung
legal-vote-abstain-label = Enthaltung

legal-vote-no-results = Keine Stimmen abgegeben

legal-vote-form-kind = Abstimmungstyp
legal-vote-roll_call = Offene Abstimmung
legal-vote-live_roll_call = Offene Abstimmung - namentlich
legal-vote-pseudonymous = Geheime Abstimmung

legal-vote-success-clipboard-message = Du hast mit {{vote}} abgestimmt
legal-vote-token-copy-success = Der Verifikation-Code wurde erfolgreich kopiert

legal-vote-share-token-active = Der Token wird nach Ende der Abstimmung hier angezeigt.
legal-vote-share-token-inactive = Diesen Code nicht mit Anderen teilen und an einem sicheren Ort aufbewahren!

poll-participant-list-button-select = Auswählen
poll-participant-list-button-close = Schließen
poll-participant-list-button-save = Speichern
poll-participant-list-button-start = Abstimmung starten
poll-participant-list-button-select-all = Alle auswählen

legal-vote-success = Ihre Stimme wurde um {{atVoteTime}} Uhr am {{onVoteDate}} erfolgreich gezählt mit dem folgenden Verifikation-Code.
Dieser kann später dazu verwendet werden die abgegebene Stimme zu verifizieren.
legal-vote-not-selected = Sie wurden nicht ausgewählt um an dieser Abstimmung teilzunehmen.
legal-vote-save-form-success = Ihre Abstimmung wurde erfolgreich gespeichert
legal-vote-save-form-error = Fehler beim Speichern, es müssen Thema und Name gesetzt werden

no-votes-in-conference = Es gibt keine Abstimmungen in dieser Konferenz im Moment.

breakout-room-tab-title = Breakout-Räume erstellen
breakout-room-form-field-rooms = Anzahl der Räume
breakout-room-form-field-participants-per-room = Anzahl der Teilnehmer
breakout-room-form-field-random-distribution = zufällige Zuweisung
breakout-room-form-field-include-moderators = inklusive Moderatoren

breakout-room-form-error-min-room = zu wenig Räume
breakout-room-form-error-max-room = zu viele Räume
breakout-room-form-error-min-participants = zu wenig Teilnehmer
breakout-room-form-error-max-room = zu viele Teilnehmer
breakout-room-form-error-expanded = Bitte öffne ein Menü

breakout-room-tab-by-rooms = Nach Anzahl der Räume
breakout-room-tab-by-participants = Nach Anzahl der Teilnehmer
breakout-room-tab-by-groups = Nach Gruppen
breakout-room-tab-by-moderators = Nach Moderatoren
breakout-room-create-button = Räume erstellen
breakout-room-create-button-disabled = Unzureichende Anzahl an Konferenzteilnehmern

breakout-room-rooms-created-by-participants = {$rooms} Räume
breakout-room-assignable-participants-per-rooms = Weise {$participantsPerRoom} Teilnehmer pro Raum zu

breakout-room-room-overview-participant-list-me = (ich)

field-duration-unlimited-time = Unbegrenzt Zeit
field-duration-button-text = Laufzeit
field-duration-button-close = Schließen
field-duration-button-save = Speichern
field-duration-custom = Andere Dauer
field-duration-input-label = Eigene Zeit eingeben (Min)

user-selection-button-back = zurück
user-selection-button-cancel = Abbrechen
user-selection-button-save = Speichern
user-selection-error-invalid-room-assignments = Die Anzahl der Teilnehmer pro Raum ist ungültig
user-selection-not-assigned-users = nicht zugewiesene Teilnehmer
user-selection-assigned-users = in diesem Raum

user-editor-button-edit = Bearbeiten

breakout-room-notification-started = Breakout-Raum gestartet
breakout-room-notification-stopped = Breakout-Raum beendet
breakout-room-notification-joining-closed-room = Breakout-Raum ist geschlossen, Sie werden in den Hauptraum weitergeleitet
breakout-room-notification-button-join = Raum beitreten
breakout-room-notification-button-leave = Raum verlassen

breakout-room-room-overview-button-close = Raum schließen
breakout-room-room-overview-title = Breakout-Räume
breakout-room-room-overview-no-duration = Keine Laufzeit
breakout-room-room-overview-participant-list = Teilnehmer in Breakout-Räumen

moderator-join-breakout-room = Raum betreten
fallback-room-title = Meeting-Raum

secure-connection-message = Diese Verbindung ist verschlüsselt und sicher.

participant-joined-text = Beigetreten {$joinedTime}
participant-hand-raise-text = Hand gehoben {$handUpdated}
participant-last-active-text = Letzte Aktivität {$lastActive}
participant-joined-event = ist dem Meeting um {$time} beigetreten
participant-left-event = hat das Meeting um {$time} verlassen

poll-overview-button-create-poll = Umfrage erstellen
poll-tab-title = Umfragen
no-polls-in-conference = Es gibt keine Umfragen in dieser Konferenz im Moment.
poll-form-button-submit = Umfrage starten
poll-form-button-save = Speichern
poll-header-title-update = Umfrage bearbeiten
poll-header-title-create = Umfrage erstellen
poll-save-form-success = Umfrage erfolgreich gespeichert
poll-button-back = zurück
poll-form-switch-live = Live
poll-form-switch-live-tooltip = Die Umfrage Live verfolgen oder das Ergebnis erst nach Beendigung bekanntgeben
poll-input-topic-placeholder = Thema
poll-input-choices = Antwort hinzufügen
poll-form-input-error-max = Die maximal zulässige Anzahl von Zeichen beträgt {$max}
poll-form-input-required = Pflichtfeld
poll-form-input-error-number = Nur positive Zahlen
poll-form-input-error-choices = Es müssen mindestens 2 Antworten erstellt werden
poll-form-input-error-choice = Antworten dürfen nicht leer sein
poll-save-form-success = Ihre Umfrage wurde erfolgreich gespeichert
poll-save-form-error = Die zu speichernde Umfrage muss mindestens ein Thema haben
poll-save-form-warning = Mindestens 2 Teilnehmer sind erforderlich, um eine Umfrage zu starten
poll-overview-saved-legal-votes = gespeicherte Umfragen
poll-overview-created-legal-votes = erstellte Umfragen
poll-overview-panel-button-end = Beenden
poll-overview-panel-status-active = Aktiv
poll-overview-panel-status-finished = Beendet

timer-tab-title = Stoppuhr
timer-form-button-submit = Stoppuhr erstellen
timer-counter-remaining-time = Verbleibende Zeit
timer-counter-elapsed-time = Verstrichene Zeit
timer-form-ready-to-continue = Teilnehmer fragen, ob sie fertig sind
timer-overview-button-stop = Stoppuhr unterbrechen
timer-notification-stopped = Die Stoppuhr wurde unterbrochen
timer-notification-ran-out = Die Zeit ist abgelaufen
timer-notification-error = Es gab ein Problem mit der Startzeit
timer-popover-title = Eine Stoppuhr läuft
timer-popover-button-done = Als fertig markieren
timer-popover-button-not-done = Als nicht fertig markieren

coffee-break-title-counter = Dauer
coffee-break-tab-title = Kaffeepause
coffee-break-form-button-submit = Pause starten
coffee-break-layer-not-running = Kaffeepause beendet
coffee-break-layer-title = Kaffeepause! Noch ...
coffee-break-popover-title = Kaffeepause ...
coffee-break-layer-button = Zurück in die Konferenz
coffee-break-notification = Die Kaffeepause ist beendet.
coffee-break-stopped-title = Kaffeepause beendet.
coffee-break-overview-button-stop = Kaffeepause beenden

speed-meter-init-message = Initalisiere...
speed-meter-started-message = Bitte warten.\nDer Test dauert ungefähr 20 Sekunden.
speed-meter-error-message = Es ist ein Fehler aufgetreten.
speed-meter-stable-message = Die Internetverbindung ist stabil.\nSie können uneingeschränkt\nan der Videokoferenz teilnehmen.
speed-meter-slow-message = Ihre Internetverbindung scheint etwas schwach.\nSie können bedingt\nan der Videokoferenz teilnehmen.
speed-meter-latency-label = Latenz
speed-meter-restart-button = Speed-Test erneut starten
speed-meter-button = Speed-Test starten
speed-meter-title = Speed-Test
speed-meter-mbps = Mb/s
speed-meter-ms = ms
speed-meter-upload-label = Upload
speed-meter-download-label = Download

indicator-has-audio-off = {$participantName} hat keinen Ton an
indicator-has-audio-on = {$participantName} hat den Ton an
indicator-has-raised-hand = {$participantName} möchte etwas sagen
indicator-pinned = {$participantName} ist im Fokus
indicator-fullscreen-open = Vollbild öffnen
indicator-fullscreen-close = Vollbild schließen
indicator-change-position = Position ändern

wrong-browser-dialog-title = Ihr Browser wird nur teilweise unterstützt.
wrong-browser-dialog-message = Bitte verwenden Sie die letzte Version von Chrome, Firefox oder Safari. Sollten Sie weitere Schwierigkeiten haben, überprüfen Sie ob Ihr Browser im Kompatibilität-oder Inkognitomodus läuft. Deaktivieren Sie diese und versuchen es noch einmal hier.
wrong-browser-dialog-ok = Verstanden

safari-warning-notification = OpenTalk ist für Safari noch nicht optimiert. Wir empfehlen derzeit Chrome, Brave, Edge oder Firefox.

error-config-title = Konfiguration ist nicht korrekt
error-config-message = Es konnte keine valide Konfiguration geladen werden. Bitte kontaktieren sie ihren Administrator.
error-system-unavailable = Das System ist zur Zeit nicht erreichbar, bitte versuchen sie es später nochmal.

error-session-expired = Sitzung abgelaufen
error-session-expired-message = Die Anmeldesitzung ist abgelaufen. Wenn Sie diese App weiterhin verwenden möchten, melden Sie sich bitte erneut an.

error-oidc-configuration = Falsche OIDC-Konfiguration
error-oidc-configuration-message = Fehler beim Laden einer korrekten OIDC-Konfiguration. Bitte wenden Sie sich an Ihren Administrator.

asset-download-error = Asset kann nicht heruntergeladen werden.
asset-delete-error = Inhalt kann nicht gelöscht werden.

no-favorite-meetings = Sie haben noch keine Favoriten.

selftest-header = Say hello to yourself.
selftest-body = Kamera und Mikrofon können hier aktiviert und getestet werden.
selftest-body-do-test = Kamera und Mikrofon können hier getestet werden.
dashboard-home-join = Starten
dashboard-home-created-by = Erstellt von {$author}
global-state-active = aktiv
global-state-finished = beendet
global-state-canceled = abgebrochen
global-accept = Annehmen
global-cancel = Abbrechen
global-decline = Ablehnen
global-stop = Stoppen
global-favorite = Als Favorit markiert
global-invite = Einladung
global-month = Monat
global-day = Tag
global-week = Woche
global-participants = Teilnehmer
global-meeting = Meeting
global-save = Speichern
global-save-changes = Änderungen speichern
global-password = Passwort
global-beta = Beta
global-me = Ich
global-create-link-success = Der Link wurde erfolgreich erstellt
global-copy-link-success = Der Link wurde erfolgreich kopiert
global-copy-permanent-guest-link-error = Es wurde noch keinen permanenten Gast-Link für dieses Meeting erstellt! Bitte, öffnen Sie den "Teilnehmer" Einstellungen von diesem Meeting und kopieren Sie den Gast-Link von dort aus.
global-password-link-success = Das Passwort wurde erfolgreich kopiert
global-dial-in-link-success = Die Telefoneinwahl wurde in die Zwischenablage kopiert
global-textfield-max-characters = {$remainingCharacters} Zeichen übrig
global-textfield-max-characters-error = {$remainingCharacters} Zeichen zu viel
global-duration = Dauer
global-title = Titel
global-on = An
global-off = Aus
global-microphone = Mikrofon
global-video = Video
global-description = Beschreibung
global-fullscreen = ganzer Bildschirm
global-shortcut = Abkürzung
global-space = Leertaste
global-anonymous = Anonym
global-start-now = Jetzt starten
global-clear = Löschen
global-open = Öffnen
global-close = Schließen
global-ok = Ok
global-no-result = Keine Ergebnisse

dashboard-home = Startseite
dashboard-meetings = Meetings
dashboard-meetings-create = Meeting erstellen
dashboard-meetings-update = Meeting aktualisieren
dashboard-statistics = Statistik
dashboard-recordings = Aufzeichnungen
dashboard-settings = Einstellungen
dashboard-my-profile = Mein Profil
dashboard-settings-general = Allgemein
dashboard-settings-account = Benutzerkonto
dashboard-settings-profile = Mein Profil
dashboard-settings-video = Video
dashboard-settings-audio = Audio
dashboard-settings-accessibility = Zugänglichkeit
dashboard-settings-logout = Abmelden
dashboard-account-management = Accountverwaltung
dashboard-legal = Rechtliches
dashboard-legal-imprint = Impressum
dashboard-legal-data-protection = Datenschutzhinweise
dashboard-help = Hilfe
dashboard-help-documentation = Dokumentation
dashboard-help-support = Support

dashboard-quick-start-title = Kurzanleitung für das OpenTalk-Dashboard
conference-quick-start-title = Kurzanleitung für die OpenTalk-Konferenz
conference-quick-start-open = Öffnen die Kurzanleitung
conference-quick-start-close = Schließen die Kurzanleitung

quick-start-loading = Kurzanleitung wird geladen
quick-start-error = Kurzanleitung konnte nicht geladen werden

dashboard-FAQ = faq
dashboard-close-navbar= Navigation schließen
dashboard-open-navbar = Navigation aufklappen
dashboard-join-meeting = Nehmen Sie an der Besprechung teil

dashboard-settings-general-notification-save-success = Deine Einstellungen wurden erfolgreich gespeichert.
dashboard-settings-general-notification-save-error = Deine Einstellungen konnten nicht übernommen werden.
dashboard-settings-general-language = Sprache
dashboard-settings-general-appearance = Erscheinungsbild
dashboard-settings-general-notifications = Benachrichtigungen
dashboard-settings-general-theme-light = Hell
dashboard-settings-general-theme-dark = Dunkel
dashboard-settings-general-theme-system = Systemeinstellungen
dashboard-settings-profile-picture = Profilfoto
dashboard-settings-profile-name = Profilname
dashboard-settings-profile-input-hint = Geben Sie einen Namen ein, der anderen auf OpenTalk angezeigt wird (z.B. Vorname, vollständiger Name oder Spitzname).
dashboard-settings-profile-button-save = Änderungen speichern
dashboard-settings-profile-input-required = Das Feld darf nicht leer sein

dashboard-meeting-card-error = Fehler beim ermitteln des Meeting-Zeitraumes
dashboard-meeting-card-all-day = ganztags
dashboard-meeting-card-timeindependent = zeitunabhängig
dashboard-meeting-card-button-start-direct = Meeting jetzt starten
dashboard-meeting-card-title-favorite-meetings = Meine Favoriten
dashboard-meeting-card-title-next-meetings = Aktuelle Meetings
dashboard-plan-new-meeting = Neues Meeting planen

dashboard-settings-account-title = Allgemeine Informationen
dashboard-settings-account-email-label = E-Mail-Adresse
dashboard-settings-account-firstname-label = Vorname
dashboard-settings-account-familyname-label = Name
dashboard-settings-account-customerid-label = Kunden-ID
dashboard-settings-account-change-password-button = Passwort ändern

dashboard-meeting-card-popover-update = Bearbeiten
dashboard-meeting-card-popover-add = Zu Favoriten hinzufügen
dashboard-meeting-card-popover-remove = Aus Favoriten entfernen
dashboard-meeting-card-popover-delete = Löschen
dashboard-meeting-card-popover-details = Details
dashboard-meeting-card-popover-copy-link = Meeting-Link kopieren
dashboard-meeting-card-popover-copy-guest-link = Gast-Link kopieren

dashboard-meeting-card-delete-dialog-title = Bitte bestätigen
dashboard-meeting-card-delete-dialog-message = Wollen Sie das Meeting {$subject} wirklich löschen?
dashboard-meeting-card-delete-dialog-ok = Endgültig löschen
dashboard-meeting-card-delete-dialog-cancel = Abbrechen

dashboard-create-meeting-dialog-title = Bitte bestätigen
dashboard-create-meeting-dialog-message = Sie haben bereits ein Meeting in der angegebenen Zeit: <eventTitle>{$eventTitle} <eventTime>{$eventTime}</eventTime></eventTitle> Möchten Sie dieses Meeting dennoch erstellen?
dashboard-update-meeting-dialog-message = Sie haben bereits ein Meeting in der angegebenen Zeit: <eventTitle>{$eventTitle} <eventTime>{$eventTime}</eventTime></eventTitle> Möchten Sie dieses Meeting bearbeiten?
dashboard-create-meeting-dialog-ok = Erstellen
dashboard-update-meeting-dialog-ok = Bearbeiten
dashboard-create-meeting-dialog-cancel = Abbrechen

dashboard-direct-meeting-title = Wen möchtest du zu deinem Meeting einladen?
dashboard-direct-meeting-label-select-participants = Teilnehmer einladen - Es werden max. {maxParticipants} Teilnehmer zum Meeting zugelassen, inkl. Ihnen, als Moderator.
dashboard-direct-meeting-label-select-participants-fallback = Teilnehmer einladen
dashboard-direct-meeting-button-cancel = Abbrechen
dashboard-direct-meeting-button-open-room = Videoraum öffnen
dashboard-direct-meeting-button-send-invitations = Einladung versenden
dashboard-direct-meeting-invitations-successful = Alle von dir hinzugefügten Personen wurden erfolgreich zu deinem Meeting eingeladen.
dashboard-direct-meeting-invitations-error = Es gab ein Problem mit dem Versandt von einer oder mehreren Einladungen. Bitte versuchen Sie es später erneut.
dashboard-direct-meeting-password-label = Passwort - optional
dashboard-direct-meeting-password-placeholder = Bitte Meetingpasswort definieren

dashboard-invite-to-meeting-room-link-label = Meeting-Link
dashboard-invite-to-meeting-copy-room-link-aria-label = Raum Link kopieren
dashboard-invite-to-meeting-copy-room-link-success = Der Link wurde erfolgreich kopiert
dashboard-invite-to-meeting-room-link-tooltip = Nur für registrierte Nutzer
dashboard-invite-to-meeting-sip-link-label = Telefoneinwahl
dashboard-invite-to-meeting-copy-sip-link-aria-label = Sip Link kopieren
dashboard-invite-to-meeting-copy-sip-link-success = Die Telefoneinwahl wurde in die Zwischenablage kopiert
dashboard-invite-to-meeting-guest-link-label = Gast-Link
dashboard-invite-to-meeting-copy-guest-link-aria-label = Raum Link für Gast kopieren
dashboard-invite-to-meeting-copy-guest-link-success = Der Link wurde erfolgreich kopiert
dashboard-invite-to-meeting-guest-link-tooltip = Für Gäste ohne Account
dashboard-invite-to-meeting-room-password-label = Passwort
dashboard-invite-to-meeting-copy-room-password-aria-label = Raum Passwort kopieren
dashboard-invite-to-meeting-copy-room-password-success = Das Passwort wurde erfolgreich kopiert
dashboard-invite-to-meeting-room-password-tooltip = Raum Passwort
dashboard-invite-to-meeting-shared-folder-link-label = Geteilter Ordner
dashboard-invite-to-meeting-copy-shared-folder-link-aria-label = Geteilter Ordner link kopieren
dashboard-invite-to-meeting-copy-shared-folder-link-success = Der Link wurde erfolgreich kopiert
dashboard-invite-to-meeting-shared-folder-password-label =  Ordner Passwort - Für Moderator ( mit Schreibrechten )
dashboard-invite-to-meeting-copy-shared-folder-password-aria-label = Ordner-Passwort kopieren
dashboard-invite-to-meeting-copy-shared-folder-password-success = Das Passwort wurde erfolgreich kopiert
dashboard-invite-to-meeting-livestream-link-label = Livestream-Link
dashboard-invite-to-meeting-copy-livestream-link-aria-label = Livestream link kopieren
dashboard-invite-to-meeting-copy-livestream-link-success = Der Link wurde erfolgreich kopiert

dashboard-select-participants-textfield-placeholder = Name oder E-Mail Adresse eingeben ( min. 3 Zeichen )
dashboard-select-participants-label-added = Hinzugefügt
dashboard-select-participants-label-suggestions = Vorschläge
dashboard-select-participants-label-search = Teilnehmer finden
dashboard-event-time-independent-meetings = Zeitunabhängige Meetings
dashboard-meeting-card-time-independent = Zeitunabhängig
dashboard-events-my-meetings = Meine Meetings
dashboard-events-filter-by-invites = Nur Einladungen anzeigen
dashboard-events-filter-by-favorites = Nur Favoriten anzeigen
dashboard-events-search = Suchen
dashboard-events-note-limited-view = Hinweis: Sie haben wiederkehrende Meetings in Ihrer Liste, wir haben die Ansicht zeitlich eingeschränkt.
dashboard-adhoc-meeting-attention = Hinweis: Dies ist ein Adhoc meeting, diese werden nach 24h automatisch gelöscht und sind im Dashboard nicht sichtbar.

dashbooard-event-accept-invitation-notification = Einladung für das Meeting {meetingTitle} akzeptiert
dashbooard-event-decline-invitation-notification = Einladung für das Meeting {meetingTitle} abgelehnt

dashboard-meeting-textfield-title = Titel
dashboard-meeting-textfield-title-placeholder = Mein neues Meeting
dashboard-meeting-textfield-details = Details - optional
dashboard-meeting-textfield-details-placeholder = Worum geht es im Meeting?
dashboard-meeting-to-step = Zu Schritt {$step}
dashboard-meeting-date-and-time = Datum & Uhrzeit
dashboard-meeting-date-from = von
dashboard-meeting-date-to = bis
dashboard-meeting-date-field-error-invalid-value = Das Startdatum und das Enddatum müssen gültige Werte haben
dashboard-meeting-date-field-error-duration = Das Meeting kann nicht vor dem Start enden
dashboard-meeting-date-field-error-future = Das Startdatum muss in der Zukunft beginnen
dashboard-meeting-time-independent-yes = Zeitunabhängiges Meeting
dashboard-meeting-time-independent-no = Zeitabhängiges Meeting
dashboard-meeting-time-independent-tooltip = Sie können ein Meeting mit einem genauen Zeitlimit oder ohne Zeitbegrenzung erstellen.
dashboard-meeting-notification-success-create = Das Meeting {$event} wurde erfolgreich erstellt!
dashboard-meeting-notification-success-edit = Die Änderungen an {$event} wurden erfolgreich gespeichert!
dashboard-meeting-notification-error = Es ist ein Fehler aufgetreten. Versuche es bitte später erneut.
dashboard-meeting-switch-enabled = Aktiviert
dashboard-meeting-switch-disabled = Deaktiviert
dashboard-meeting-shared-folder-label = Geteilter Ordner
dashboard-meeting-shared-folder-create-error-message = Es ist leider ein Fehler aufgetreten, der geteilte Ordner konnte nicht erstellt werden.
dashboard-meeting-shared-folder-create-retry-error-message = Leider konnte der geteilte Ordner nicht erstellt werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt nocheinmal.
dashboard-meeting-shared-folder-delete-error-message = Es ist leider ein Fehler aufgetreten, der geteilte Ordner konnte nicht gelöscht werden.
dashboard-meeting-shared-folder-delete-retry-error-message = Leider konnte der geteilte Ordner nicht gelöscht werden. Bitte versuchen Sie es zu einem späteren Zeitpunkt nocheinmal.
dashboard-meeting-shared-folder-error-cancel-button = Abbrechen
dashboard-meeting-shared-folder-error-retry-button = Wiederholen
dashboard-meeting-shared-folder-error-ok-button = Ok
dashboard-meeting-grant-moderator-rights = Moderatorenrechte gewähren
dashboard-meeting-revoke-moderator-rights = Moderatorenrechte entziehen
dashboard-meeting-livestream-label = Livestream
dashboard-meeting-livestream-platform-label = Platform
dashboard-meeting-livestream-platform-name-label = Name
dashboard-meeting-livestream-platform-name-placeholder = Name eingeben
dashboard-meeting-livestream-platform-name-required = Dies ist ein Pflichtfeld
dashboard-meeting-livestream-streaming-endpoint-label = Stream Empfänger Url
dashboard-meeting-livestream-streaming-endpoint-placeholder = URL eingeben
dashboard-meeting-livestream-streaming-endpoint-invalid-url = Bitte eine gültige URL eingeben
dashboard-meeting-livestream-streaming-endpoint-required = Dies ist ein Pflichtfeld
dashboard-meeting-livestream-public-url-label = Livestream Url
dashboard-meeting-livestream-public-url-placeholder = URL eingeben
dashboard-meeting-livestream-public-url-invalid-url = Bitte eine gültige URL eingeben
dashboard-meeting-livestream-public-url-required = Dies ist ein Pflichtfeld
dashboard-meeting-livestream-streaming-key-label = Streamschlüssel
dashboard-meeting-livestream-streaming-key-placeholder = Streamschlüssel eingeben
dashboard-meeting-livestream-streaming-key-required = Dies ist ein Pflichtfeld

streaming-targets-request-error = Streaming-Ziel konnte nicht hinzugefügt werden

dashboard-meeting-details-page-future = zukünftige
dashboard-meeting-details-page-past = vergangene
dashboard-meeting-details-page-description-title = Beschreibung
dashboard-meeting-details-page-time-independent = zeitunabhängig
dashboard-meeting-details-page-all-day = ganztags am {$date}
dashboard-meeting-details-page-participant-pending = Offene Einladungen
dashboard-meeting-details-page-participant-accepted = Angenommen
dashboard-meeting-details-page-participant-declined = Abgelehnt
dashboard-meeting-details-page-participant-tentative = Mit Vorbehalt
dashboard-meeting-details-page-participant-limit =  Es werden max. {maxParticipants} Teilnehmer zum Meeting zugelassen, inkl. Ihnen, als Moderator.

dashboard-meeting-recurrence-none = Keine Wiederholung
dashboard-meeting-recurrence-daily = Täglich
dashboard-meeting-recurrence-weekly = Wöchentlich
dashboard-meeting-recurrence-bi-weekly = 14-Tägig
dashboard-meeting-recurrence-monthly = Monatlich

dashboard-payment-status-downgraded = Achtung: Für Ihren Account ist derzeit keine gültige Zahlmethode hinterlegt.<br /> Die Nutzung ist derzeit auf den {$tariffName}-Tarif eingeschränkt.
dashboard-add-payment-button = Jetzt auswählen

meeting-notification-kicked = Sie wurden vom Meeting entfernt
meeting-notification-banned = Sie wurden permanent vom Meeting entfernt
meeting-notification-user-was-kicked = Sie haben {$user} vom Meeting entfernt
meeting-notification-user-was-banned = Sie haben {$user} permanent vom Meeting entfernt
meeting-notification-user-was-accepted = Sie haben {$user} erfolgreich in das Meeting aufgenommen
meeting-notification-participant-limit-reached = Sie haben das Maximum von {$participantLimit} Teilnehmern in dieser Konferenz erreicht.

feedback-button = Feedback
feedback-button-close = Schließen
feedback-button-submit = Einreichen
feedback-dialog-title = Ihr Feedback
feedback-dialog-rating-function-range = Funktionsumfang
feedback-dialog-rating-handling = Bedienung
feedback-dialog-rating-video-quality = Videoqualität
feedback-dialog-rating-audio-quality = Audioqualität
feedback-dialog-headline = Bitte helfen Sie uns OpenTalk kontinuierlich zu verbessern. Hierzu möchten wir Sie einladen uns direktes Feedback zu geben. Bitte bewerten Sie einige wesentliche Kriterien (1=schlecht, 5=sehr gut)
feedback-dialog-label-liked = Was hat Ihnen besonders gut gefallen?
feedback-dialog-label-problems = Gab es Probleme bei der Nutzung?
feedback-dialog-label-critic = Haben Sie weitere Kritik, Anregungen, Ideen für neue Funktionen?
feedback-dialog-description-placeholder = Ihr Feedback ist uns wichtig. Bitte teilen Sie uns Ihre Gedanken mit
feedback-dialog-submit-success = Vielen Dank für die Übermittlung
feedback-dialog-form-validation = Pflichtfeld

protocol-join-session = Nehmen Sie an der Protokollsitzung teil

protocol-invite-button = Schreibrechte für Teilnehmer vergeben
protocol-edit-invite-button = Schreibrechte verwalten
protocol-invite-reader-message = Es wurde eine Protokollierung gestartet
protocol-invite-writer-message = Sie wurden ausgewählt diese Sitzung zu protokollieren
protocol-invite-send-button = Protokoll für alle anzeigen
protocol-update-invite-send-button = Änderungen übernehmen
protocol-upload-pdf-button = Protokoll PDF erstellen
protocol-upload-pdf-message = Protokoll PDF erstellt
protocol-created-notification = Protokoll ist eingerichtet.
protocol-created-all-notification = Protokoll für alle eingerichtet.
protocol-new-protocol-message-button = Anzeigen
protocol-hide = Protokoll ausblenden
protocol-tab-title = Protokoll erstellen

beta-flag-tooltip-text = Sie nutzen die Beta-Version von OpenTalk. Wir entwickeln kontinuierlich neue Funktionen und stellen diese im Rahmen unserer <demoLink>Demo</demoLink> frühzeitig als Ausblick bereit. Bitte beachten Sie, dass es zu Einschränkungen bei der Nutzung kommen kann. Kritik, Ideen und Fehler können Sie uns gerne an <reportEmailLink>{$reportEmail}</reportEmailLink> senden.<br /><br />Viel Spaß beim ausprobieren von OpenTalk!

tooltip-empty-favourites = Sie können über das Menü auf der Karte Meetings als Favoriten markieren.
meeting-delete-metadata-dialog-title = Meeting beenden
meeting-delete-metadata-dialog-message = Soll dieses Meeting aus dem Dashboard entfernt werden? Dabei werden alle Informationen zu diesem Meeting (inkl. Aufnahmen, Protokolle, Abstimmungsergebnisse usw.) gelöscht!
meeting-delete-metadata-dialog-checkbox = Löschung bestätigen
meeting-delete-metadata-button-leave-and-delete = Verlassen und alle Daten löschen
meeting-delete-metadata-button-leave-without-delete = Verlassen ohne Daten zu löschen
meeting-delete-metadata-submit-error =
    Beim löschen der Daten ist ein Fehler aufgetreten.
    Bitte versuchen sie es später nochmal!

send-error-button-text = Diagnosedaten senden
hide-diagnostic-data-button = Diagnosedaten verbergen
show-diagnostic-data-button = Diagnosedaten anzeigen
show-diagnostic-data-title = Es ist ein Fehler aufgetreten!
show-diagnostic-data-message = Sollen Diagnosedaten an {$errorReportEmail} gesendet werden?

form-validation-max-characters = Die maximal zulässige Anzahl von Zeichen beträgt {$maxCharacters}

votes-poll-overview-title = Umfragen und Abstimmungen
votes-poll-overview-live-label = Live
votes-poll-overview-not-live-label = Nicht live

votes-result-not-live-tooltip = Diese Abstimmung ist nicht live, die Ergebnisse werden nach Ende der Abstimmung bekannt gegeben.
votes-result-live-tooltip = Diese Abstimmung ist live, die Ergebnisse werden kontinuierlich bekannt gegeben.

debug-panel-inbound-label = Eingehende (aktuell, durchschn., max):
debug-panel-outbound-label = Ausgehend (aktuell, durchschn., max):
debug-panel-remote-count-label = Anzahl der Verbindungen:

whiteboard-tab-title = Whiteboard
whiteboard-create-pdf-button = PDF erstellen
whiteboard-start-whiteboard-button = Whiteboard anzeigen
whiteboard-new-whiteboard-message = Whiteboard ist eingerichtet
whiteboard-new-pdf-message = Es wurde ein neues Whiteboard PDF erstellt
whiteboard-new-whiteboard-message-button = Anzeigen
whiteboard-hide = Whiteboard ausblenden

shortcut-hold-to-speak = Nicht stumm geschaltet, während gedrückt gehalten
shortcut-pass-talking-stick = Redestab weitergeben

meeting-required-start-date = Startdatum ist erforderlich
meeting-required-end-date = Enddatum ist erforderlich
meeting-invalid-start-date = Startdatum ist ungültig
meeting-invalid-end-date = Enddatum ist ungültig

recording-consent-message = Es wurde eine Aufnahme gestartet. Erlauben Sie die Aufzeichnung Ihres Bildes und Tones?

recording-active-label = Recording läuft

recording-accept = Erlauben
recording-decline = Verweigern
recording-stopped-message = Die Aufnahme wurde beendet.
recording-stopped-message-with-link =  <messageContent>Die Aufnahme wurde beendet. Die entsprechende Datei befindet sich im Dashboard unter den <messageLink>Meeting-Details</messageLink>.</messageContent>

emoji-category-smileys_people = Smileys & Personen
emoji-category-animals_nature = Tiere & Natur
emoji-category-food_drink = Essen und Trinken
emoji-category-travel_places = Reisen & Orte
emoji-category-activities = Aktivitäten
emoji-category-objects = Objekte
emoji-category-symbols = Symbole
emoji-category-flags = Flaggen

time-limit-more-than-one-minute-remained = Maximale Konferenz-Zeit wird erreicht. Diese Konferenz wird in {$minutes} Minuten automatisch beendet.
time-limit-less-than-one-minute-remained = Maximale Konferenz-Zeit wird erreicht. Diese Konferenz wird in Kürze automatisch beendet.

conference-view-trigger-button = Ansichtsauswahl
conference-view-speaker = Sprecheransicht
conference-view-grid = Kachelansicht
conference-view-fullscreen = Vollbildansicht
shared-folder-open-label = Geteilten Ordner öffnen
shared-folder-password-label = Ordner-Passwort kopieren

imprint-label = Impressum
data-protection-label = Datenschutz

version-label = Produktversion - {$version}
dev-version = (Vorschau)

reconnection-loop-dialogbox-title = Verbindung wird erneut aufgebaut
reconnection-loop-abort-button = Abbrechen

glitchtip-crash-report-title = Oh, es sieht so aus, als hätten wir ein Problem.
glitchtip-crash-report-subtitle = Unser Team wird benachrichtigt.
glitchtip-crash-report-subtitle2 = Wenn Sie helfen möchten, erzählen Sie uns, was passiert ist.
glitchtip-crash-report-labelName = Name
glitchtip-crash-report-labelEmail = Email
glitchtip-crash-report-labelComments = Was ist passiert? ( Schritt für Schritt, gern in kurzen Stichpunkten formuliert. )
glitchtip-crash-report-labelClose = Schliessen
glitchtip-crash-report-labelSubmit = Senden
glitchtip-crash-report-errorGeneric = Beim Absenden Ihres Berichts ist ein unbekannter Fehler aufgetreten. Bitte versuchen Sie es erneut.
glitchtip-crash-report-errorFormEntry = Einige Felder waren ungültig. Bitte korrigieren Sie die Fehler und versuchen Sie es erneut.
glitchtip-crash-report-successMessage = Ihr Bericht wurde gesendet. Vielen Dank!
