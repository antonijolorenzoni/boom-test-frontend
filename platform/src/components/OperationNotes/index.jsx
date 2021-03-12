import React from 'react';
import useSWR from 'swr';
import { axiosBoomInstance } from '../../api/instances/boomInstance';
import { operationNotes } from '../../api/paths/orders';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

import { HistoryNotesPanel, NoteRow } from './styles';
import { Typography, Icon, TextFieldCtaIcon } from 'ui-boom-components';
import { get } from 'lodash';
import { submitOperationNote } from '../../api/ordersAPI';

import * as ModalsActions from '../../redux/actions/modals.actions';
import { useDispatch } from 'react-redux';

export const OperationNotes = ({ shootingId, color, onSubmitNote }) => {
  const { data, error: notesError, mutate } = useSWR(operationNotes(shootingId), axiosBoomInstance.get);

  const notesData = get(data, 'data', null);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [areHistoryNotesVisible, setHistoryNotesVisible] = useState(false);
  const [freeText, setFreeText] = useState('');

  const [isInputDisabled, setInputDisabled] = useState(false);

  const getArrayNotes = () => (areHistoryNotesVisible ? notesData : [notesData[0]]);

  const panelCanOpen = notesData && notesData.length > 1;

  const submitNote = async () => {
    if (freeText) {
      try {
        setInputDisabled(true);
        await submitOperationNote(shootingId, freeText);
        mutate();
        onSubmitNote();
        setFreeText('');
        setInputDisabled(false);
      } catch {
        setInputDisabled(false);
        dispatch(
          ModalsActions.showModal('SUBMIT_OPERATION_NOTE_ERROR', {
            modalType: 'ERROR_ALERT',
            modalProps: {
              message: t('shootings.submitOperationNoteError'),
            },
          })
        );
      }
    }
  };

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <TextFieldCtaIcon
          nameIcon="send"
          colorIcon="#A3ABB1"
          colorActiveIcon={color}
          label={t('shootings.operationNotes')}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          name={'operationNote'}
          placeholder={t('shootings.newNote')}
          onClick={submitNote}
          disabled={isInputDisabled}
          onEnterKeyPress={submitNote}
        />
      </div>
      <HistoryNotesPanel>
        {panelCanOpen && (
          <div
            onClick={() => setHistoryNotesVisible(!areHistoryNotesVisible)}
            style={{ position: 'absolute', right: 1, marginTop: '-6px', cursor: 'pointer' }}
          >
            <Icon color="#A3ABB1" name={areHistoryNotesVisible ? 'arrow_drop_up' : 'arrow_drop_down'} size="30" />
          </div>
        )}
        {notesData &&
          (notesData.length > 0 ? (
            getArrayNotes().map(({ userName, creationDate, text }, index) => (
              <NoteRow key={`operation-note-row-${index}`}>
                <Typography variantName="caption2" style={{ color: '#A3ABB1' }}>{`${moment(creationDate).format(
                  'DD.MM.YY - HH:mm'
                )} - ${userName}`}</Typography>
                <Typography variantName="body3">{text}</Typography>
              </NoteRow>
            ))
          ) : (
            <Typography variantName="body3">{t('shootings.noOperationNotes')}</Typography>
          ))}
        {notesError && <Typography variantName="error">{t('shootings.operationNotesError')}</Typography>}
      </HistoryNotesPanel>
    </>
  );
};
