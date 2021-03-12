import { SubscriptionResponse } from 'types/SubscriptionResponse';
import { delay } from 'lodash';
import { useSubscription } from './useSubscription';
import { useState } from 'react';
import { useEffect } from 'react';

interface ExponentialRetry {
  retry: () => void;
}

export const useSubscriptionWithRetry = (
  condition: boolean,
  companyId?: number,
  maxAttempt: number = 1,
  isChanged: (left?: SubscriptionResponse, right?: SubscriptionResponse) => boolean = () => false
) => {
  const result = useSubscription(condition, companyId);

  const [isRetrying, setIsRetying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [oldSubscription, setOldSubscription] = useState(result.subscription);

  useEffect(() => {
    if (isRetrying && attempt < maxAttempt && !isChanged(oldSubscription, result.subscription)) {
      delay(async () => {
        try {
          await result.mutate();
        } finally {
          setAttempt(attempt + 1);
        }
      }, 2 ** attempt * 200);
    } else {
      setAttempt(0);
      setOldSubscription(result.subscription);
      setIsRetying(false);
    }
  }, [isRetrying, result, attempt, isChanged, oldSubscription, maxAttempt]);

  const exponentialRetry: ExponentialRetry = {
    retry: () => setIsRetying(true),
  };

  return {
    ...result,
    exponentialRetry,
  };
};
