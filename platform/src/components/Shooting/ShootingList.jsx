//
// ────────────────────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: G E N E R I C   S H O O T I N G   L I S T   C O M P O N E N T : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
//

import ShootingIcon from '@material-ui/icons/LinkedCamera';
import _ from 'lodash';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import translations from '../../translations/i18next';
import Spinner from '../Spinner/Spinner';

const ShootingList = ({ shootings, children, pagination, onLoadMore, isLoading }) => {
  return (
    <InfiniteScroll
      pageStart={0}
      initialLoad={false}
      loadMore={pagination ? () => onLoadMore(pagination.number + 1) : null}
      hasMore={pagination && !pagination.last}
      loader={
        !isLoading && (
          <div className="loader" style={{ padding: 20, display: 'flex', justifyContent: 'center' }} key={0}>
            {translations.t('general.loading')}
          </div>
        )
      }
    >
      {children}
      {_.isEmpty(shootings) && !isLoading && (
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShootingIcon style={{ fontSize: 20, color: '#7F888F', marginRight: 20 }} />
          <h5 style={{ margin: 0, paddingTop: 5, color: '#7F888F' }}>{translations.t('shootings.noShootingsFound')}</h5>
        </div>
      )}
      {isLoading && (
        <Spinner
          title={translations.t('general.loading')}
          hideLogo
          spinnerStyle={{ color: '#5AC0B1', marginTop: 10 }}
          titleStyle={{ color: '#80888d', marginTop: 5, fontSize: 12 }}
        />
      )}
    </InfiniteScroll>
  );
};

export default ShootingList;
