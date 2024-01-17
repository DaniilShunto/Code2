// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const QUICK_START_FOLDER = '/assets/quick_start/';
const DASHBOARD_FILENAME_DE = 'Kurzanleitung_Dashboard_DE_0.svg';
const DASHBOARD_FILENAME_EN = 'Quick_guide_dashboard_EN.svg';
const CONFERENCE_FILENAME_DE = 'Kurzanleitung_Konferenz_DE.svg';
const CONFERENCE_FILENAME_EN = 'Quick_guide_video_conferences_EN.svg';

export const useQuickStartUrl = () => {
  const { i18n } = useTranslation();
  const [dashboardQuickStartUrl, setDashboardQuickStartUrl] = useState<string | undefined>(undefined);
  const [conferenceQuickStartUrl, setConferenceQuickStartUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const languageCode = i18n.language.split('-')[0];
    const dashboardFilename = languageCode === 'de' ? DASHBOARD_FILENAME_DE : DASHBOARD_FILENAME_EN;
    const conferenceFilename = languageCode === 'de' ? CONFERENCE_FILENAME_DE : CONFERENCE_FILENAME_EN;

    setDashboardQuickStartUrl(`${QUICK_START_FOLDER}${languageCode}/${dashboardFilename}`);
    setConferenceQuickStartUrl(`${QUICK_START_FOLDER}${languageCode}/${conferenceFilename}`);
  }, [i18n.language]);

  return { dashboardQuickStartUrl, conferenceQuickStartUrl };
};
