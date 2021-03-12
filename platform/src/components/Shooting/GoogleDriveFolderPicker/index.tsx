import React from 'react';
import loadScript from 'load-script';

import { Button } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { getGoogleToken } from '../../../api/companiesAPI';

const GOOGLE_SDK_URL = 'https://apis.google.com/js/api.js';
const DEVELOPER_KEY = 'AIzaSyDMqgAiJn-ozAKria7ZBJabpmqY1hb1inM';

interface Props {
  organizationId: number;
  companyId: number;
  onChange: Function;
}

export const GoogleDriveFolderPicker: React.FC<Props> = ({ organizationId, companyId, onChange }) => {
  const { t } = useTranslation();
  const scriptLoadingStarted = React.useRef(false);

  React.useEffect(() => {
    if (isGoogleReady()) {
      // google api is already exists
      // init immediately
      onApiLoad();
    } else if (!scriptLoadingStarted.current) {
      // load google api and the init
      scriptLoadingStarted.current = true;
      loadScript(GOOGLE_SDK_URL, onApiLoad);
    } else {
      // is loading
    }
  }, []);

  const isGoogleReady = () => Boolean(window.gapi);
  const isGooglePickerReady = () => Boolean(window.google.picker);

  const onApiLoad = () => window.gapi.load('picker', () => {});

  const onChoose = () => {
    if (!isGoogleReady() || !isGooglePickerReady()) {
      return null;
    }

    getGoogleToken(organizationId, companyId).then((result) => {
      const token = result.data;
      createPicker(token);
    });
  };

  const createPicker = (oauthToken: string) => {
    const googleViewId = google.picker.ViewId.FOLDERS;
    const view = new window.google.picker.DocsView(googleViewId)
      .setSelectFolderEnabled(true)
      .setMimeTypes('application/vnd.google-apps.folder');

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(DEVELOPER_KEY)
      .setCallback(onChange);

    picker.build().setVisible(true);
  };

  return (
    <Button size="small" backgroundColor="#5AC0B1" onClick={onChoose}>
      {t('browse')}
    </Button>
  );
};
