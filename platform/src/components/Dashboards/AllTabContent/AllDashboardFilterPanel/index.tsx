import React, { useEffect, useMemo, useState } from 'react';
import { AsyncDropdown, Button, Checkbox, Dropdown, OutlinedButton, Typography, TooltipDatePicker, TextField } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';
import { OptionProps } from 'react-select';
import moment from 'moment';

import {
  FilterWrapper,
  FilterItem,
  VerticalDivider,
  StatusOptionWrapper,
  ButtonsWrapper,
  StatusCircle,
} from 'components/Dashboards/filters.styles';
import { OrderStatus } from 'types/OrderStatus';
import { useWhoAmI } from 'hook/useWhoAmI';
import { Option } from 'types/Option';
import { FreeSearchTextField } from 'components/FreeSearchTextField';
import { getCompanies, getSubcompanies } from 'api/companiesAPI';
import { DateRange } from 'types/DateRange';
import { useCountries } from 'hook/useCountries';
import { getCountriesOption } from 'utils/countries';
import { useSelector } from 'react-redux';
import { clientStatuses } from 'config/consts';

const StatusOption: React.FC<OptionProps<{ label: string; value: OrderStatus }, true>> = ({ innerProps, data, isSelected }) => {
  const { t } = useTranslation();

  return (
    <StatusOptionWrapper {...innerProps}>
      <Checkbox checked={isSelected} onChange={() => {}} variantName="classic" size={10} />
      <StatusCircle status={data.value} />
      <Typography variantName="caption" textColor="#000">
        {t(`shootingStatuses.${data.value}`)}
      </Typography>
    </StatusOptionWrapper>
  );
};

const MultiValueContainer = ({ selectProps, data }: any) => {
  const { t } = useTranslation();

  if (selectProps.value.length === 1) {
    return data.label;
  }

  // trick to avoid printing each selected value, but only a counter (one time). This is the only way I found.
  return selectProps.value.map((i: any) => i.value).indexOf(data.value) === 0
    ? `${t('general.itemSelected', { counter: selectProps.value.length })}`
    : null;
};

const withoutUnscheduled = (s: OrderStatus) => s !== OrderStatus.Unscheduled;

export const AllDashboardFilterPanel: React.FC<{
  onReset: () => void;
  onSearch: ({
    freeText,
    company,
    subCompany,
    statuses,
    dateRange,
    countryCode,
    address,
  }: {
    freeText: string;
    company: Option | null;
    subCompany: Option | null;
    statuses: Array<OrderStatus>;
    dateRange: DateRange;
    countryCode: string | null;
    address: string;
  }) => void;
  initialDateRange: DateRange;
  isLoading: boolean;
  calendarVisible: boolean;
}> = ({ onReset, onSearch, initialDateRange, isLoading, calendarVisible }) => {
  const { t } = useTranslation();
  const { isBoom, isClient, isSMB } = useWhoAmI();

  const [freeText, setFreeText] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [statuses, setStatuses] = useState<Array<OrderStatus>>([]);
  const [subCompany, setSubCompany] = useState<Option | null>(null);
  const [company, setCompany] = useState<Option | null>(null);

  const userLanguage = useSelector((state: any) => (state.user.data.language === 'ENGLISH' ? 'en' : 'it'));

  useEffect(() => {
    setStatuses((statuses) => (calendarVisible ? statuses.filter(withoutUnscheduled) : statuses));
  }, [calendarVisible]);

  const resetFilters = () => {
    setFreeText('');
    setStatuses([]);
    setDateRange({
      start: isClient || isSMB ? null : new Date(moment().utc().day('Sunday').startOf('day').valueOf()),
      end: isClient || isSMB ? null : new Date(moment().utc().day('Sunday').add(7, 'days').startOf('day').valueOf()),
    });
    setCompany(null);
    setSubCompany(null);
    setAddress('');
    setCountryCode(null);
    onReset();
  };

  const selectableOrderStatuses = useMemo(() => {
    if (isBoom) {
      return calendarVisible ? Object.values(OrderStatus).filter(withoutUnscheduled) : Object.values(OrderStatus);
    } else {
      return calendarVisible ? clientStatuses.filter(withoutUnscheduled) : clientStatuses;
    }
  }, [calendarVisible, isBoom]);

  const { countries, error: countriesError } = useCountries();
  const allCountriesOptions = getCountriesOption(countries, userLanguage);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FilterWrapper>
        <FilterItem>
          <FreeSearchTextField value={freeText} onChange={(e) => setFreeText(e.target.value)} />
        </FilterItem>
        <FilterItem>
          <Dropdown<Option<OrderStatus>, true>
            id="status"
            label={t('order.status')}
            value={statuses.map((orderState) => ({ value: orderState, label: t(`shootingStatuses.${orderState}`) }))}
            options={selectableOrderStatuses.map((state) => ({
              value: state,
              label: t(`shootingStatuses.${state}`),
            }))}
            onChange={(option) => {
              if (!option) {
                setStatuses([]);
              } else {
                setStatuses(option.map((option) => option.value));
              }
            }}
            components={{ Option: StatusOption, MultiValueContainer }}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </FilterItem>
        <VerticalDivider />
        <FilterItem>
          <Dropdown
            id="country"
            label={t('shootings.country')}
            value={allCountriesOptions.find((c) => c.value === countryCode) || null}
            options={allCountriesOptions}
            filterOptions={(option: { label: string }, input: any) => option.label.toLowerCase().includes(input)}
            onChange={(selected) => setCountryCode(selected ? selected.value : null)}
            isClearable
            isSearchable
            isDisabled={!countries && !countriesError}
          />
        </FilterItem>
        <FilterItem>
          <TextField name="address" label={t('forms.address')} value={address} onChange={(e) => setAddress(e.target.value)} />
        </FilterItem>
        <VerticalDivider />
        <FilterItem>
          <TooltipDatePicker
            label={t('order.date')}
            doneLabel={t('general.done')}
            onChangeDate={(start, end) => setDateRange({ start, end })}
            start={dateRange.start}
            end={dateRange.end}
            disabled={calendarVisible}
          />
        </FilterItem>
        <VerticalDivider />
        <FilterItem>
          <AsyncDropdown
            id="company"
            label={t('shootings.company')}
            value={company}
            fetcher={async (input: string) => {
              const response = await getCompanies({ name: input, page: 0, pageSize: 10 });
              return response.data.map((company: any) => ({ value: company.id, label: company.name }));
            }}
            onChange={(option: Option | null) => {
              setCompany(option);
              if (!option) {
                setSubCompany(null);
              }
            }}
            isClearable
          />
        </FilterItem>
        {isBoom && (
          <FilterItem>
            <AsyncDropdown
              id="subcompany"
              label={t('shootings.subcompany')}
              value={subCompany}
              fetcher={async (input: string) => {
                const response = await getSubcompanies(company?.value, { name: input, page: 0, pageSize: 10 });
                return response.data.map((subcompany: any) => ({ value: subcompany.id, label: subcompany.name }));
              }}
              onChange={setSubCompany}
              disabled={!company}
              isClearable
            />
          </FilterItem>
        )}
        <ButtonsWrapper data-testid="buttons-wrapper">
          <Button
            onClick={() => onSearch({ freeText, company, subCompany, statuses, dateRange, countryCode, address })}
            loading={isLoading}
            style={{ width: 93, marginRight: 16, height: 20 }}
            type="submit"
          >
            {t('forms.filter')}
          </Button>
          <OutlinedButton onClick={resetFilters} style={{ width: 93, height: 20 }}>
            {t('forms.reset')}
          </OutlinedButton>
        </ButtonsWrapper>
      </FilterWrapper>
    </form>
  );
};
