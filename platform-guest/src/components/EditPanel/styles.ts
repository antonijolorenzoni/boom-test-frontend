import styled from 'styled-components';
import { TextField } from 'ui-boom-components';
import { MediaQueryBreakpoint } from 'types/MediaQueryBreakpoint';

export const Wrapper = styled.div`
  width: 100%;
  padding: 16px 20px;
  background-color: #ffffff;

  box-sizing: border-box;

  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.25);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 100%;
    margin: 0;
    padding: 11px 30px 30px;
    overflow: scroll;
    height: calc(100vh - 155px);
  }

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    display: flex;
    flex-direction: column;
  }
`;

export const WrapperButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 34px;
  padding: 0 5px;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    display: flex;
    flex-grow: 1;
    align-items: flex-end;
    margin-bottom: 0;
  }
`;

export const RowWrapper = styled.div`
  display: flex;

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    flex-direction: column;
  }
`;

export const OneThirdWrapper = styled.div`
  flex-basis: 33%;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    flex-basis: 100%;
    margin-top: 10px;
  }

  @media screen and (max-width: ${MediaQueryBreakpoint.Tablet}px) {
    flex-basis: 50%;
    margin-top: 10px;
  }
`;

export const OneHalfWrapper = styled.div`
  flex-basis: 50%;

  @media screen and (max-width: ${MediaQueryBreakpoint.Smartphone}px) {
    flex-basis: 100%;
    margin-top: 7px;
  }
`;

export const TextFieldOversize = styled(TextField)`
  padding: 9px;
`;

export const addressAutocompleteStyle = {
  valueContainer: (base: any, state: any) => ({
    ...base,
    padding: '5px 9px',
    textOverflow: 'ellipsis',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'initial',
    fontSize: 17,
    fontWeight: 500,
  }),
  control: (base: any, state: any) => ({
    ...base,
    fontSize: 17,
    fontWeight: 500,
    minHeight: 'unset',
    border: '1px solid #acb2b7',
    borderRadius: 3,
  }),
  input: (base: any, state: any) => ({
    ...base,
    fontSize: 17,
    fontWeight: 500,
    marginRight: 5,
    padding: 0,
    margin: 0,
  }),
  placeholder: (base: any, state: any) => ({ ...base, fontSize: 17, fontWeight: 500 }),
  singleValue: (base: any, state: any) => ({ ...base, fontSize: 17, fontWeight: 500 }),
  menu: (base: any, state: any) => ({ ...base, zIndex: 1000, fontSize: 17, fontWeight: 500 }),
  option: (base: any, { isSelected, isFocused, data }: { isSelected: boolean; isFocused: boolean; data: any }) => ({
    ...base,
    backgroundColor: isSelected ? '#5AC0B1' : isFocused ? '#BDE6E0' : 'unset',
    cursor: 'pointer',
    color: '#000000',
    '&:active': {
      backgroundColor: '#5AC0B1',
      color: '#ffffff',
    },
  }),
};
