import _ from 'lodash';
import { useSelector } from 'react-redux';

const HideFor = ({ children, roles }) => {
  const currentRoles = useSelector((state) => state?.user?.data?.authorities);

  return _.intersection(roles || [], currentRoles || []).length ? null : children ?? null;
};

export default HideFor;
