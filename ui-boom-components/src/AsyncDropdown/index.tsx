import React from 'react';
import _ from 'lodash';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import { useTranslation } from 'react-i18next';

import { Typography } from '../Typography';
import { Label } from '../Label';
import { Wrapper, RotateIcon } from './styles';

const animatedComponents = makeAnimated();

const IndicatorSeparator = (props: any) => {
  return <span style={{ width: 0 }} {...props.innerProps} />;
};

export const AsyncDropdown = ({
  id,
  label,
  placeholder,
  value,
  cacheOptions,
  noOptionsMessage,
  defaultOptions,
  fetcher,
  onChange,
  onBlur,
  onInputChange,
  error,
  required,
  disabled,
  autoFocus,
  openMenuOnFocus,
  isClearable,
  components,
  styles,
  showError = true,
}: any) => {
  const { t } = useTranslation();

  const loadOptions = (inputValue: any, callback: any) => {
    fetcher(inputValue).then((results: any) => callback(results));
    // explicitly not returning a promise!
    return;
  };

  const debouncedLoadOptions = _.debounce(loadOptions, 500);

  return (
    <Wrapper>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <AsyncSelect
        inputId={id}
        value={value}
        components={{
          ...animatedComponents,
          IndicatorSeparator: (props: any) => <IndicatorSeparator />,
          DropdownIndicator: (props: any) => (
            <div style={{ display: 'flex', paddingRight: 5 }}>
              <RotateIcon color="#A3ABB1" menuIsOpen={props.selectProps.menuIsOpen} />
            </div>
          ),
          ...components,
        }}
        autoFocus={autoFocus}
        openMenuOnFocus={openMenuOnFocus}
        placeholder={placeholder || t('forms.select')}
        cacheOptions={cacheOptions}
        defaultOptions={defaultOptions}
        loadOptions={debouncedLoadOptions}
        onChange={onChange}
        onBlur={onBlur}
        onInputChange={onInputChange}
        noOptionsMessage={() => noOptionsMessage || t('forms.noOptions')}
        styles={{
          valueContainer: (base: any, state: any) => ({
            ...base,
            padding: '4px 9px',
            textOverflow: 'ellipsis',
            maxWidth: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            display: 'initial',
            fontSize: 13,
          }),
          control: (base: any, state: any) => ({
            ...base,
            minHeight: 'unset',
            border: '1px solid #acb2b7',
            borderRadius: 3,
          }),
          input: (base: any, state: any) => ({
            ...base,
            fontSize: 13,
            marginRight: 5,
            padding: 0,
            margin: 0,
          }),
          placeholder: (base: any, state: any) => ({ ...base, fontSize: 13 }),
          singleValue: (base: any, state: any) => ({ ...base, fontSize: 13 }),
          menu: (base: any, state: any) => ({ ...base, zIndex: 1000, fontSize: 13 }),
          dropdownIndicator: (base: any, state: any) => ({ ...base, paddingRight: 5 }),
          clearIndicator: (base: any, state: any) => ({ ...base, padding: 0 }),
          multiValue: (base: any, state: any) => ({
            ...base,
            padding: 0,
            minWidth: 'unset',
          }),
          option: (base: any, { isSelected, isFocused, data }: { isSelected: boolean; isFocused: boolean; data: any }) => ({
            ...base,
            backgroundColor: isSelected ? '#5AC0B1' : isFocused ? '#BDE6E0' : 'unset',
            cursor: 'pointer',
            color: isSelected ? '#ffffff' : isFocused ? '#000000' : data.color,
            '&:active': {
              backgroundColor: '#5AC0B1',
              color: '#ffffff',
            },
          }),
          ...styles,
        }}
        isClearable={isClearable}
        isDisabled={disabled}
      />
      {showError && (
        <Typography
          variantName="error"
          style={{
            visibility: error ? 'visible' : 'hidden',
            minHeight: 18,
            marginTop: 2,
          }}
        >
          {error}
        </Typography>
      )}
    </Wrapper>
  );
};
