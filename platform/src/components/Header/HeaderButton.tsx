import React from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { USER_ROLES } from 'config/consts';
import { SubscriptionStatus } from 'types/SubscriptionStatus';

interface Props {
  paths: Array<string>;
  title: string;
  icon: any;
  iconSelected: any;
  iconComponent?: JSX.Element;
}

const HeaderButton: React.FC<Props> = ({ paths, title, icon, iconSelected, iconComponent }) => {
  const location = useLocation();

  const isUnsubscribed = useSelector((state: any) => {
    const roles = state.user?.data.roles;
    const isUnsubscribed = state.user?.subscriptionStatus === SubscriptionStatus.UNSUBSCRIBED;
    const isSMB = roles?.some((role: { name: string }) => role.name === USER_ROLES.ROLE_SMB);

    return isSMB && isUnsubscribed;
  });

  const checkActivation = (path: string) => paths.indexOf(path) !== -1;

  const getIcon = (title: string, match: string) => {
    const isActive = checkActivation(match);
    const iconStyle = { marginRight: 10, marginBottom: 2 };

    if (iconComponent) {
      return React.cloneElement(iconComponent, { color: isActive ? '#5AC0B1' : '', style: iconStyle });
    }

    return <img alt={title} src={isActive ? iconSelected : icon} style={iconStyle} />;
  };

  return (
    <div style={{ display: 'flex' }}>
      <NavLink
        exact
        to={_.first(paths) || '/'}
        isActive={() => checkActivation(location.pathname)}
        style={{
          display: 'flex',
          textDecoration: 'none',
          marginRight: 40,
          color: '#80888f',
          opacity: isUnsubscribed ? 0.5 : 1,
          cursor: isUnsubscribed ? 'not-allowed' : 'pointer',
        }}
        activeStyle={{
          textDecoration: 'none',
          color: '#5AC0B1',
        }}
        onClick={(e) => isUnsubscribed && e.preventDefault()}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getIcon(title, location.pathname)}
          <h4 style={{ fontSize: 13 }}>{title}</h4>
        </div>
      </NavLink>
    </div>
  );
};

export default HeaderButton;
