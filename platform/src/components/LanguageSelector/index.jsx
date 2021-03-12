import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Typography } from 'ui-boom-components';
import * as UtilsActions from '../../redux/actions/utils.actions';
import { Wrapper, Button, WrapperMenuList, MenuItem } from './styles';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LANGUAGE, LANGUAGES } from 'config/consts';

const LanguageSelector = ({ onSelectLanguage }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.utils.selectedLanguage);
  const [isOpen, setIsOpen] = useState(false);

  const setLanguage = (language) => {
    onSelectLanguage(language);
    dispatch(UtilsActions.setLanguage(language ?? DEFAULT_LANGUAGE));
    setIsOpen(false);
  };

  const { t } = useTranslation();

  return (
    <Wrapper>
      <Button onClick={(_) => setIsOpen((isOpen) => !isOpen)}>
        <Icon name="language" color="#ffffff" />
        <Typography variantName="title3" className="circular-black-label" style={{ color: '#ffffff', margin: '0px 10px 0px 10px' }}>
          {language || DEFAULT_LANGUAGE}
        </Typography>
      </Button>
      {isOpen && (
        <WrapperMenuList>
          <div style={{ position: 'relative' }}>
            {LANGUAGES.map((language) => (
              <MenuItem key={`languages-dropdown-login-${language}`} onClick={(_) => setLanguage(language)}>
                {t(`languages.${language}`)}
              </MenuItem>
            ))}
          </div>
        </WrapperMenuList>
      )}
    </Wrapper>
  );
};

export { LanguageSelector };
