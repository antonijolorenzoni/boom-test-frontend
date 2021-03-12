import React from 'react';
import { useTranslation } from 'react-i18next';

import { Label } from '../Label';
import { TxtArea } from './styles';

interface Props {
  label?: string;
  error?: string;
  showError?: boolean;
}

const TextArea = ({
  name,
  value,
  rows,
  cols,
  label,
  onChange,
  error,
  style,
  placeholder,
  maxLength,
  disabled,
  showError = true,
}: Props & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && (
        <Label htmlFor={name} style={{ marginBottom: 10 }}>
          {label}
        </Label>
      )}
      <TxtArea
        value={value}
        id={name}
        name={name}
        rows={rows}
        cols={cols}
        onChange={onChange}
        style={style}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
      />
      {showError && (
        <span
          style={{
            color: 'red',
            marginTop: 4,
            fontSize: 11,
            visibility: !error ? 'hidden' : undefined,
          }}
        >
          {t('forms.required')}
        </span>
      )}
    </div>
  );
};

export { TextArea };
