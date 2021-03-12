import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import translations from '../../translations/i18next';
import MDButton from '../MDButton/MDButton';
import ListSearchBar from './ListSearchBar';
import Spinner from '../Spinner/Spinner';

const ListComponent = ({
  title,
  subtitle,
  pagination,
  onLoadMore,
  children,
  containerstyle,
  newButtonStyle,
  onSearch,
  onResetFilters,
  onCreateNew,
  newElementText,
  searchFieldLabel,
  isLoading,
}) => (
  <div style={{ ...containerstyle }}>
    {title && <h4 style={{ marginBottom: 10 }}>{title}</h4>}
    {subtitle && <h4 style={{ marginBottom: 10, fontSize: 15, fontWeight: 100 }}>{subtitle}</h4>}
    {onSearch && (
      <ListSearchBar
        searchFieldLabel={searchFieldLabel}
        onSubmit={(searchValues) => onSearch(searchValues)}
        onResetFilters={() => onResetFilters()}
      />
    )}
    {onCreateNew && (
      <MDButton
        title={newElementText || translations.t('forms.createNew')}
        className="gradient-button"
        titleStyle={{ fontSize: 15 }}
        containerstyle={{ width: '50%', marginTop: 20, marginBottom: 20, ...newButtonStyle }}
        backgroundColor="#5AC0B1"
        onClick={() => onCreateNew()}
      />
    )}
    <InfiniteScroll
      pageStart={0}
      initialLoad={false}
      loadMore={pagination ? () => onLoadMore(pagination.number + 1) : null}
      hasMore={pagination && pagination.number + 1 < pagination.totalPages}
      loader={
        <div className="loader" key={0}>
          {translations.t('general.loading')}
        </div>
      }
    >
      {isLoading && (
        <Spinner
          title={translations.t('general.loading')}
          hideLogo
          spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
          titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
        />
      )}
      {!isLoading && children}
    </InfiniteScroll>
  </div>
);

export default ListComponent;
