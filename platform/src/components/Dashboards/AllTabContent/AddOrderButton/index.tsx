import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Typography } from 'ui-boom-components';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { AddOrderButton, Overlay, PlusButton, plusButtonVariants } from './styles';
import { useTranslation } from 'react-i18next';
import { useIsUserEnabled } from 'components/Permission/ShowFor';
import { Permission } from 'types/Permission';

export const AddOrdersButton: React.FC<{
  disabled: boolean;
  onSingle: () => void;
  onBulk: () => void;
}> = ({ disabled, onSingle, onBulk }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [bulkUploadStart, setBulkUploadStart] = useState<number>();

  const canBulkInsert = useIsUserEnabled([Permission.BulkCreate]);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setBulkUploadStart(i18n.language === 'it' ? 240 : 225);
  }, [i18n.language]);

  const handleButtonClick = () => {
    if (canBulkInsert) {
      setIsOpen(!isOpen);
    } else {
      onSingle();
    }
  };

  return (
    <AnimateSharedLayout>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            key="overlay"
            layout
            initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            animate={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen && (
          <AddOrderButton
            layout
            key="singleOrder"
            id="singleOrderButton"
            initial={{ right: 44, opacity: 0 }}
            animate={{ right: 107, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            exit={{ right: 44, opacity: 0 }}
            onClick={() => {
              onSingle();
              setIsOpen(false);
            }}
          >
            <Typography variantName="overline" style={{ textTransform: 'uppercase' }} textColor="#fff">
              {t('dashboards.button.singleOrder')}
            </Typography>
          </AddOrderButton>
        )}
        {isOpen && (
          <AddOrderButton
            layout
            key="bulkUpload"
            initial={{ right: 44, opacity: 0 }}
            animate={{ right: bulkUploadStart, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            exit={{ right: 44, opacity: 0 }}
            onClick={() => {
              onBulk();
              setIsOpen(false);
            }}
          >
            <Typography variantName="overline" style={{ textTransform: 'uppercase' }} textColor="#fff">
              {t('dashboards.button.bulkUpload')}
            </Typography>
          </AddOrderButton>
        )}
        <PlusButton
          layout
          onClick={() => !disabled && handleButtonClick()}
          variants={plusButtonVariants}
          animate={isOpen ? 'clicked' : 'default'}
          style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        ></PlusButton>
      </AnimatePresence>
    </AnimateSharedLayout>
  );
};
