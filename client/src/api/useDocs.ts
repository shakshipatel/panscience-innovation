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

  //     let config = {
  //   method: 'post',
  //   maxBodyLength: Infinity,
  //   url: 'http://localhost:3000/upload',
  //   headers: { 
  //     ...data.getHeaders()
  //   },
  //   data : data
  // };

  // axios.request(config)

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
  // runApi(
  //   () => axios_instanceFormData.post("/upload", data, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }),
  //   "Failed to upload document. Please try again.",
  //   callback,
  // );

  return {
    docsLoading,
    getDocs,
    uploadDoc,
  }
}

export default useDocs;
