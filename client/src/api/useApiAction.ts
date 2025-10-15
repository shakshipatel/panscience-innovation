import { useState } from "react";

import { errorToast } from "../lib/toast";

type ApiCallback<T = any> = (data: T | null, error: any | null) => void;

export const useApiAction = () => {
  const [loading, setLoading] = useState(false);

  const runApi = async <T>(
    apiFn: () => Promise<T>,
    fallbackMessage: string,
    callback?: ApiCallback<T>
  ) => {
    setLoading(true);
    try {
      const response = await apiFn();

      const status =
        (response as any)?.status || (response as any)?.data?.status;
      if (![200, 201].includes(status)) {
        errorToast((response as any)?.data?.message || fallbackMessage);
        callback?.(null, response);
        return;
      }

      callback?.((response as any)?.data ?? response, null);
    } catch (error) {
      callback?.(null, error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, setLoading, runApi };
};
