import { axios_instance } from "../lib/axios";

import { useApiAction } from "./useApiAction";

const useDocs = () => {
  const { loading: docsLoading, runApi } = useApiAction();

  const getDocs = (callback: (...args: any) => void) =>
    runApi(
      () => axios_instance.get("/files"),
      "Failed to get documents. Please try again.",
      callback,
    );

  const uploadDoc = (data: FormData, callback: (...args: any) => void) => {
    const requestOptions = {
      method: "POST",
      body: data,
    };

    fetch(`${import.meta.env.VITE_DEPLOYED_BACKEND_HOSTNAME}/v1/upload`, requestOptions)
      .then((response) => response.text())
      .then((result) => callback(JSON.parse(result), null))
      .catch((error) => callback(null, error));
  }

  return {
    docsLoading,
    getDocs,
    uploadDoc,
  }
}

export default useDocs;
