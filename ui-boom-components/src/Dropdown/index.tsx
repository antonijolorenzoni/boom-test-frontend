import React from 'react';
import Select, { Props, OptionTypeBase } from 'react-select';
import { useTranslation } from 'react-i18next';
import { Typography } from '../Typography';
import { Label } from '../Label';
import { Wrapper, RotateIcon } from './styles';
import { omit } from 'lodash';

const IndicatorSeparator = (props: any) => {
  return <span style={{ width: 0 }} {...props.innerProps} />;
};

export type DropdownProps<OptionType extends OptionTypeBase = { label: string; value: string }, IsMulti extends boolean = false> = Props<
  OptionType,
  IsMulti
> & {
  label?: string;
  showError?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string | null;
  defaultOptions?: Array<OptionType>;
};

export const Dropdown = <OptionType extends OptionTypeBase = { label: string; value: string }, IsMulti extends boolean = false>({
  label,
  defaultOptions,
  error,
  required,
  showError = true,
  ...reactSelectProps
}: DropdownProps<OptionType, IsMulti>) => {
  const { t } = useTranslation();

  const {
    id,
    value,
    options,
    filterOption,
    components,
    styles,
    placeholder,
    onChange,
    onBlur,
    onInputChange,
    isSearchable,
    isDisabled,
  } = reactSelectProps;

  return (
    <Wrapper>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Select
        {...omit(reactSelectProps, 'id')}
        inputId={id}
        value={value}
        options={options}
        filterOption={filterOption}
        components={{
          IndicatorSeparator: (props: any) => <IndicatorSeparator />,
          DropdownIndicator: (props: any) => (
            <div style={{ display: 'flex', paddingRight: 5 }}>
              <RotateIcon color="#A3ABB1" menuIsOpen={props.selectProps.menuIsOpen} />
            </div>
          ),
          MultiValueContainer: ({ selectProps, data }) => {
            const label = data.label;
            const allSelected = selectProps.value;
            const index = allSelected.findIndex((selected: any) => selected.label === label);
            const isLastSelected = index === allSelected.length - 1;
            const labelSuffix = isLastSelected ? '' : ', ';
            const val = `${label}${labelSuffix}`;
            return <>{val}</>;
          },
          ...components,
        }}
        placeholder={placeholder || t('forms.select')}
        defaultOptions={defaultOptions}
        onChange={onChange}
        onBlur={onBlur}
        onInputChange={onInputChange}
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
            color: '#000',
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
          option: (base, { isSelected, isFocused, data }) => ({
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
        isSearchable={isSearchable || false}
        isDisabled={isDisabled}
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
