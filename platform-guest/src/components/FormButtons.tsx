import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Button, OutlinedButton } from 'ui-boom-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  & :first-child {
    margin-right: 20px;
  }
`;

export const FormButtons: React.FC<{ isSubmitDisabled: boolean; onCancel: () => void }> = ({ isSubmitDisabled, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <OutlinedButton size="medium" onClick={onCancel}>
        {t('general.cancel')}
      </OutlinedButton>
      <Button size="medium" type="submit" disabled={isSubmitDisabled} style={{ paddingLeft: 12, paddingRight: 12 }}>
        {t('general.confirm')}
      </Button>
    </Wrapper>
  );
};
