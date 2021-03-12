import React from 'react';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import translations from '../../../../translations/i18next';

const SelectableView = ({
  onHandleChange,
  onLoadOptions,
  noCache,
  onValueClick,
  multi,
  input,
  isDisabled,
  defaultOptions,
  noOptionsMessage,
  placeholder,
}) => (
  <AsyncSelect
    {...input}
    defaultOptions={defaultOptions || []}
    isMulti={multi}
    noOptionsMessage={noOptionsMessage ? noOptionsMessage : () => translations.t('forms.noOptions')}
    placeholder={placeholder}
    components={makeAnimated()}
    cacheOptions={!noCache}
    isClearable
    styles={{ menu: (styles) => Object.assign(styles, { zIndex: 1000 }) }} // zindex of the overlay
    isDisabled={isDisabled}
    loadOptions={onLoadOptions ? (value) => onLoadOptions(value, input) : null}
    onValueClick={(value, actionType) => onValueClick(value, actionType)}
    onChange={(value) => onHandleChange(value, input)}
    onBlur={() => input.onBlur(input.value)}
  />
);

export default SelectableView;
