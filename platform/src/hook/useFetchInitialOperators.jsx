import { useState, useEffect } from 'react';
import { getCompleteName } from '../config/utils';
import { axiosBoomInstance } from '../api/instances/boomInstance';

import { get } from 'lodash';

import { listUsers } from '../api/paths/user';
import constsWithTranslations from '../config/constsWithTranslations';
import { listContactCenters, getContactCenterUsers } from 'api/paths/contact-center';
import { useWhoAmI } from './useWhoAmI';

const paramsToSend = {
  organizationId: 1,
  photographer: false,
};

export const useFetchInitialOperators = (userData) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isCcUser } = useWhoAmI();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await axiosBoomInstance.get(isCcUser ? getContactCenterUsers(1) : listUsers(paramsToSend));
        const initialOperators = get(data, 'data.content');

        const listContactCentersResponse = !isCcUser ? await axiosBoomInstance.get(listContactCenters) : null;
        const contactCenters = get(listContactCentersResponse, 'data', []);

        const getOptionOperators = () => {
          const operatorsWithoutMyself = initialOperators.filter((element) => element.id !== userData.id);
          const operatorOptions = operatorsWithoutMyself.map((user) => ({
            value: user.id,
            label: getCompleteName(user),
          }));

          const optionsCc = contactCenters.map((cc) => ({
            value: `${cc.id}_cc`,
            label: cc.name,
            contactCenter: true,
          }));

          return [...constsWithTranslations.getAssigneeDefaultOptions(userData), ...optionsCc, ...operatorOptions];
        };

        const hookResponse = initialOperators ? getOptionOperators() : constsWithTranslations.getAssigneeDefaultOptions(userData);

        if (hookResponse) {
          setData(hookResponse);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setData([]);
      setLoading(true);
      setError(null);
    };
  }, [userData, isCcUser]);

  return { initialOperators: data, loading, error };
};
