import React from 'react';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';

import { DriveRectange } from './styles';

import driveIcon from '../../assets/icons/drive.png';
import { GoogleDriveFolderPicker } from '../Shooting/GoogleDriveFolderPicker';
import { Typography, IconButton, Icon } from 'ui-boom-components';

interface Props {
  company?: { organization: number; id: number };
  customFolderInfo?: { id?: string | null; name?: string | null } | null;
  error?: string;
  showPicker?: boolean;
  showRemoveCustomFolder?: boolean;
  onPickCustomFolder?: (id: string, name: string) => void;
  onRemoveCustomFolder?: () => void;
  driveDeliveryFormField?: React.ReactNode;
}

const GoogleDriveSelector: React.FC<Props> = ({
  company,
  customFolderInfo,
  error,
  showPicker = false,
  showRemoveCustomFolder = false,
  onPickCustomFolder,
  onRemoveCustomFolder,
  driveDeliveryFormField,
}) => {
  const { t } = useTranslation();
  const [customFolder, setCustomFolder] = React.useState(customFolderInfo);

  const pickCustomFolderFromData = (data: { action: any; docs: Array<any> }): void => {
    const pickedDoc = get(data, 'docs[0]');
    if (data.action === window.google.picker.Action.PICKED && pickedDoc) {
      const { id, name } = pickedDoc;
      setCustomFolder({ id, name });

      if (onPickCustomFolder) {
        onPickCustomFolder(id, name);
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {driveDeliveryFormField}
      <DriveRectange color={error ? 'rgba(230, 81, 0, .2)' : '#F5F6F7'} style={{ marginRight: 30, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img src={driveIcon} alt="Drive" height={16} style={{ marginRight: 10 }} />
          <Typography variantName="body1" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {get(customFolder, 'name') || t('shootings.defaultDriveFolder')}
          </Typography>
        </div>
        {customFolder && showRemoveCustomFolder && (
          <IconButton
            onClick={() => {
              setCustomFolder(null);
              if (onRemoveCustomFolder) {
                onRemoveCustomFolder();
              }
            }}
          >
            <Icon name="close" color="#80888D" />
          </IconButton>
        )}
      </DriveRectange>
      {showPicker && company && (
        <GoogleDriveFolderPicker organizationId={company.organization} companyId={company.id} onChange={pickCustomFolderFromData} />
      )}
    </div>
  );
};

export { GoogleDriveSelector };
