import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Typography } from 'ui-boom-components';
import { Variants } from 'framer-motion';

import { ColouredWrapper, InnerWrapper, SelectLanguageInfo, LanguageRow } from './styles';
import i18n from 'i18n';
import { languagesIcon } from 'utils/lang';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';
import { useMediaQuery } from 'react-responsive';
import { updateBoLanguage } from 'api/businessOwnerAPI';

interface Props {
  onClose: () => void;
}

export const LanguageSelector: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const isTabletOrMobile = useMediaQuery({ query: `screen and (max-width: ${MediaQueryBreakpoint.Tablet}px)` });

  const selectedLanguage = localStorage.i18nextLng;

  const wrapperVariants: Variants = {
    visible: {
      width: '100vw',
      transition: { staggerChildren: 0.2, delayChildren: isTabletOrMobile ? 0.5 : 0.8, duration: isTabletOrMobile ? 0.3 : 0.5 },
    },
    hidden: { width: 0, transition: { duration: isTabletOrMobile ? 0.3 : 0.5 } },
  };

  const rowVariants: Variants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: 50, opacity: 0 },
  };

  const changeLanguage = async (lng: string) => {
    try {
      await updateBoLanguage(localStorage.order_code, lng);
      onClose();
      i18n.changeLanguage(lng);
    } catch (err) {
      // TODO
    }
  };

  return (
    <ColouredWrapper variants={wrapperVariants} initial="hidden" animate="visible" exit="hidden">
      <InnerWrapper>
        <Icon name="close" color="#A3ABB1" onClick={onClose} style={{ cursor: 'pointer', position: 'absolute', top: 25, right: 25 }} />
        <SelectLanguageInfo>
          <Typography variantName="title2">{t('general.selectLanguage')}</Typography>
        </SelectLanguageInfo>
        <div>
          {Object.entries(languagesIcon).map(([k, v]) => (
            <LanguageRow
              key={k}
              onClick={() => changeLanguage(k)}
              variants={rowVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={v} alt={`flag-${k}`} />
              <Typography variantName="title2" textColor={selectedLanguage === k ? '#5AC0B1' : '#80888D'}>
                {t(`languages.${k}`)}
              </Typography>
            </LanguageRow>
          ))}
        </div>
      </InnerWrapper>
    </ColouredWrapper>
  );
};
