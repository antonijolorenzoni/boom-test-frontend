import React, { ChangeEventHandler, useRef } from 'react';
import { Icon } from 'ui-boom-components';
import { useTranslation, Trans } from 'react-i18next';

import { Wrapper, TextInput } from './styles';
import { InfoPoint } from '../InfoPoint';
import { useModal } from 'hook/useModal';
import { v4 } from 'uuid';
import { InfoModal } from 'components/Modals/InfoModal';
import { useWhoAmI } from 'hook/useWhoAmI';

interface Props {
  value: string;
  iconColor?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const FreeSearchTextField: React.FC<Props> = ({ value, iconColor, placeholder, onChange }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { isClient } = useWhoAmI();

  const infoModalId = useRef(`infoSearch-${v4()}`);

  return (
    <Wrapper>
      <Icon name="search" color={iconColor || '#5AC0B1'} style={{ position: 'absolute', bottom: 3 }} />
      <TextInput value={value} placeholder={placeholder || t('forms.search')} onChange={onChange} />
      <div style={{ position: 'relative' }}>
        <InfoPoint onClick={() => openModal(infoModalId.current)} style={{ position: 'absolute', top: 1, left: -18 }} />
      </div>
      <InfoModal
        id={infoModalId.current}
        title={t('info.search.title')}
        subtitle={<Trans i18nKey="info.search.subtitle" />}
        body={t(`info.search.body${isClient ? 'Client' : ''}`)}
        style={{ width: 435 }}
      />
    </Wrapper>
  );
};

export { FreeSearchTextField };
