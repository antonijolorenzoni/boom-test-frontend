import React, { useState } from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { AsyncDropdown, TextField, Button, OutlinedButton, Dropdown } from 'ui-boom-components';
import { useTranslation } from 'react-i18next';

import { FilterWrapper, FilterItem, ButtonsWrapper, VerticalDivider } from '../../filters.styles';
import { getCompanies, getSubcompanies } from 'api/companiesAPI';
import { FreeSearchTextField } from 'components/FreeSearchTextField';
import { onFetchAssigneeUsers } from 'utils/userUtils';
import { OrderStatus } from 'types/OrderStatus';
import { Option } from 'types/Option';
import { Phototype } from 'types/Phototype';
import { useCountries } from 'hook/useCountries';
import { getCountriesOption } from 'utils/countries';

interface Props {
  onReset: () => void;
  onSearch: ({
    assigneeId,
    freeText,
    orderTypes,
    address,
    countryCode,
    company,
    subCompany,
    statuses,
  }: {
    assigneeId: Option | null;
    freeText: string;
    orderTypes: string[];
    address: string | null;
    countryCode: string | null;
    company: Option | null;
    subCompany: Option | null;
    statuses: Array<OrderStatus>;
  }) => void;
  isLoading: boolean;
  initialOperators: any;
}

const UnscheduledDashboardFilterPanel: React.FC<Props> = ({ onReset, onSearch, isLoading, initialOperators }) => {
  const { t } = useTranslation();

  const [freeText, setFreeText] = useState<string>('');
  const [orderTypes, setOrderTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Array<OrderStatus>>([OrderStatus.Unscheduled]);
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [company, setCompany] = useState<Option | null>(null);
  const [subCompany, setSubCompany] = useState<Option | null>(null);
  const [assigneeId, setAssigneeId] = useState<Option | null>(null);

  const dropdownUserPhotoTypes = useSelector((state) => {
    const photoTypes = Object.freeze(get(state, 'user.photoTypes', []));
    return photoTypes.map(({ id, type }: Phototype) => ({ value: id, label: t(`photoTypes.${type}`) }));
  });

  const userLanguage = useSelector((state: any) => (state.user.data.language === 'ENGLISH' ? 'en' : 'it'));

  const selectedOrderType = dropdownUserPhotoTypes.filter((photoTypes: { value: string }) => orderTypes.includes(photoTypes.value));

  const { countries, error: countriesError } = useCountries();
  const allCountriesOptions = getCountriesOption(countries, userLanguage);

  const userData = useSelector((state: any) => state.user.data);

  const resetFilters = () => {
    setFreeText('');
    setOrderTypes([]);
    setStatuses([OrderStatus.Unscheduled]);
    setCountryCode(null);
    setAddress('');
    setCompany(null);
    setSubCompany(null);
    setAssigneeId(null);

    onReset();
  };

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
          <Dropdown
            id="status"
            label={t('order.status')}
            value={[
              {
                value: OrderStatus.Unscheduled,
                label: t(`shootingStatuses.${OrderStatus.Unscheduled}`),
              },
            ]}
            options={[
              {
                value: OrderStatus.Unscheduled,
                label: t(`shootingStatuses.${OrderStatus.Unscheduled}`),
              },
            ]}
            isMulti
            isDisabled
          />
        </FilterItem>
        <FilterItem>
          <Dropdown
            id="orderType"
            label={t('shootings.orderType')}
            value={selectedOrderType}
            options={dropdownUserPhotoTypes}
            onChange={(selected) => {
              const selectedOrderTypes = Array.isArray(selected) ? selected.map((selected) => selected.value) : [selected!.values];
              setOrderTypes(selectedOrderTypes);
            }}
            isMulti
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
          <AsyncDropdown
            id="company"
            label={t('shootings.company')}
            value={company}
            fetcher={async (input: string) => {
              const response = await getCompanies({ name: input, page: 0, pageSize: 10 });
              return response.data.map((company: any) => ({ value: company.id, label: company.name }));
            }}
            onChange={setCompany}
            isClearable
          />
        </FilterItem>
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
        <VerticalDivider />
        <FilterItem>
          <AsyncDropdown
            id="assignee"
            label={t('shootings.assignee')}
            value={assigneeId ? { value: assigneeId.value, label: assigneeId.label } : null}
            defaultOptions={initialOperators}
            fetcher={(input: any) => onFetchAssigneeUsers(input, userData)}
            onChange={setAssigneeId}
            isClearable
            placeholder={t('forms.all')}
          />
        </FilterItem>
        <ButtonsWrapper data-testid="buttons-wrapper">
          <Button
            onClick={() => onSearch({ assigneeId, freeText, orderTypes, address, countryCode, company, subCompany, statuses })}
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

export { UnscheduledDashboardFilterPanel };
