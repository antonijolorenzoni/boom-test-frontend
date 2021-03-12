import { Rating } from 'components/common/Rating';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextArea, Typography, Button } from 'ui-boom-components';

interface Props {
  color?: string;
  onConfirm: (rate: number, note: string) => void;
  isPanelInOperationalView?: boolean;
  loading?: boolean;
}

export const FeedbackClientPanel: React.FC<Props> = ({ color, onConfirm, isPanelInOperationalView, loading }) => {
  const { t } = useTranslation();

  const [rate, setRate] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const ButtonOperationalView = (
    <Button size={'small'} disabled={rate === 0} backgroundColor={color} onClick={() => onConfirm(rate, notes)} loading={loading}>
      {t('feedbackClientPanel.done')}
    </Button>
  );

  const ButtonModalInOrdersPage = (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button size={'medium'} disabled={rate === 0} backgroundColor="#5AC0B1" onClick={() => onConfirm(rate, notes)} loading={loading}>
        {t('feedbackClientPanel.sumbit')}
      </Button>
    </div>
  );

  return (
    <div data-testid="feedback-client-panel">
      <Typography variantName="title2" textColor="#000000" style={{ marginBottom: 4 }}>
        {t(`feedbackClientPanel.${isPanelInOperationalView ? `feedbackForBoom` : `howWasService`}`)}
      </Typography>
      <Typography variantName="caption" textColor="#000000" style={{ marginBottom: 9 }}>
        {t('feedbackClientPanel.pleaseTakeAMoment')}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <Typography textColor="#A3ABB1" isUppercase variantName="overline" style={{ marginRight: 10 }}>
          {t('feedbackClientPanel.serviceEvaluation')}
        </Typography>
        <Rating value={rate} isValuating color={color} onChange={setRate} />
      </div>
      <TextArea
        label={t('feedbackClientPanel.notes')}
        rows={3}
        value={notes}
        onChange={(e) => setNotes((e.currentTarget as HTMLTextAreaElement).value)}
      />
      {isPanelInOperationalView ? ButtonOperationalView : ButtonModalInOrdersPage}
    </div>
  );
};
