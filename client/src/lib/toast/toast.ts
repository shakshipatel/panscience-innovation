import toast from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message);
};

export const errorToast = (message: string) => {
  toast.error(message);
};

export const infoToast = (message: string) => {
  toast.success(message);
};

export const warningToast = (message: string) => {
  toast.error(message);
};
