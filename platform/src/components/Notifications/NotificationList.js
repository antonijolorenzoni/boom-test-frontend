import React from 'react';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import NotificationRow from './NotificationRow';
import translations from '../../translations/i18next';

const NotificationList = ({ notifications, pagination, onLoadMore, onClick }) => (
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
    {_.map(notifications, (notification) => (
      <NotificationRow key={notification.id} horizontal notification={notification} onClick={() => onClick(notification)} />
    ))}
  </InfiniteScroll>
);

export default NotificationList;
