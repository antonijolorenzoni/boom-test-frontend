import React from 'react';
import { useTranslation } from 'react-i18next';

import { InfoPanel } from 'components/Modals/Panels/InfoPanel';
import { Modal } from 'components/Modals';
import { useModal } from 'hook/useModal';

export const InfoModal: React.FC<{
  id: string;
  title: string | React.ReactElement;
  subtitle?: string | React.ReactElement;
  body: string | React.ReactElement;
  button?: string;
  error?: boolean;
  onConfirm?: () => void;
  style?: React.CSSProperties;
}> = ({ id, title, subtitle, body, button, error, style, onConfirm }) => {
  const { t } = useTranslation();
  const { onClose } = useModal();

  return (
    <Modal id={id}>
      <InfoPanel
        title={title}
        subtitle={subtitle}
        body={body}
        button={button ?? t('general.ok')}
        isError={error}
        onConfirm={() => {
          onConfirm && onConfirm();
          onClose(id);
        }}
        style={style}
      />
    </Modal>
  );
};
