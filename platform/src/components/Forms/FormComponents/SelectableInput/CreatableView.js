import React from 'react';
import makeAnimated from 'react-select/animated';
import AsyncCreatable from 'react-select/async-creatable';
import translations from '../../../../translations/i18next';

const CreatableView = ({
  onHandleChange,
  onLoadOptions,
  onValueClick,
  onNewOption,
  multi,
  input,
  noOptionsMessage,
  placeholder,
  defaultOptions,
}) => (
  <AsyncCreatable
    {...input}
    isMulti={multi}
    defaultOptions={defaultOptions || []}
    noOptionsMessage={noOptionsMessage ? noOptionsMessage : () => translations.t('forms.noOptions')}
    placeholder={placeholder}
    components={makeAnimated()}
    loadOptions={(value) => onLoadOptions(value, input)}
    onCreateOption={(data) => onNewOption(data)}
    onValueClick={(value, actionType) => onValueClick(value, actionType)}
    onChange={(value) => onHandleChange(value, input)}
    onBlur={() => input.onBlur(input.value)}
  />
);

export default CreatableView;
