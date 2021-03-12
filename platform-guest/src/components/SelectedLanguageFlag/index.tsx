import React, { useContext } from 'react';
import { languagesIcon } from 'utils/lang';
import { Flag } from './styles';
import i18n from 'i18n';
import { IsLanguageSelectorToggledContext } from 'contexts/IsLanguageSelectorToggledContext';

export const SelectedLanguageFlag: React.FC = () => {
  const selectedLanguage = i18n.languages[0];

  const languageFlagIcon = languagesIcon[selectedLanguage];
  const { setToggled } = useContext(IsLanguageSelectorToggledContext);

  return <Flag src={languageFlagIcon} alt={`flag-${languageFlagIcon}`} onClick={(_) => setToggled()} />;
};
