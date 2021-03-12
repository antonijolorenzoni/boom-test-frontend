import React from 'react';

import { RotateIcon } from './styles';
import { AsyncDropdown } from 'ui-boom-components';

export const AssigneeDropdown = ({ disabled, isShowIcon, colorOptionMenuClosed, ...props }) => {
  return (
    <AsyncDropdown
      disabled={disabled}
      components={{
        DropdownIndicator: (props) =>
          isShowIcon ? (
            <div style={{ display: 'flex', paddingRight: 5 }}>
              <RotateIcon
                color={disabled ? 'grey' : props.selectProps.menuIsOpen ? '#A3ABB1' : 'white'}
                menuIsOpen={props.selectProps.menuIsOpen}
              />
            </div>
          ) : null,
      }}
      styles={{
        valueContainer: (base, state) => ({
          ...base,
          padding: '2px 10px 2px 10px',
          cursor: 'text',
        }),
        control: (base, state) => ({
          ...base,
          minHeight: 'unset',
          border: '0 !important',
          boxShadow: '0 !important',
          '&:hover': {
            border: '0 !important',
          },
          backgroundColor: state.selectProps.menuIsOpen ? 'white' : '',
        }),
        input: (base, state) => ({
          ...base,
          '& input': {
            fontSize: '11px !important ',
            fontWeight: '700 !important',
          },
          height: 28,
          color: disabled ? 'grey' : '#A3ABB1',
          overflow: 'hidden',
          padding: '0 !important',
          margin: '0 !important',
        }),
        placeholder: (base, state) => ({
          ...base,
          fontSize: 11,
          fontWeight: 700,
          display: state.selectProps.menuIsOpen ? 'none' : 'block',
        }),
        singleValue: (base, state) => ({
          ...base,
          fontSize: 11,
          fontWeight: 700,
          textDecoration: 'underline',
          color: disabled ? 'grey' : state.selectProps.menuIsOpen ? '#A3ABB1' : colorOptionMenuClosed,
        }),
        menu: (base, state) => ({
          ...base,
          zIndex: 1000,
          fontSize: 11,
          fontWeight: 700,
          color: '#A3ABB1',
        }),
        dropdownIndicator: (base, state) => ({ ...base, paddingRight: 5 }),
        clearIndicator: (base, state) => ({ ...base, padding: 0 }),
        multiValue: (base, state) => ({
          ...base,
          padding: 0,
        }),
        loadingIndicator: (base, state) => ({
          ...base,
          color: 'white !important',
          '& span': {
            backgroundColor: 'white !important',
          },
        }),
        option: (base, { isSelected, isFocused }) => ({
          ...base,
          backgroundColor: isSelected || isFocused ? '#A3ABB1' : 'unset',
          cursor: 'pointer',
          color: isSelected || isFocused ? '#ffffff' : '#A3ABB1',
          '&:active': {
            backgroundColor: '#A3ABB1',
            color: '#ffffff',
          },
        }),
      }}
      {...props}
    />
  );
};
