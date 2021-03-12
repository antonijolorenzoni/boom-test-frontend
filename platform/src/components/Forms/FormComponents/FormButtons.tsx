import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Button, OutlinedButton } from 'ui-boom-components';

interface Props {
  isSubmitDisabled?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  & > :first-child {
    margin-right: 20px;
  }
`;

export const FormButtons: React.FC<Props> = ({ isSubmitDisabled, onCancel, onSubmit, cancelLabel, submitLabel, loading = false }) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <OutlinedButton size="medium" onClick={onCancel}>
        {cancelLabel ?? t('general.cancel')}
      </OutlinedButton>
      <Button
        size="medium"
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        loading={loading}
        style={{ paddingLeft: 12, paddingRight: 12 }}
      >
        {submitLabel ?? t('general.confirm')}
      </Button>
    </Wrapper>
  );
};
