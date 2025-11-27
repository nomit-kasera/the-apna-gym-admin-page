export const getErrorMessageFromAxios = (err: any) => {
  return new Error(err?.response?.data?.error?.message || "Something went wrong!");
};

export const getErrorFromAxios = (err: any) => {
  return new Error(err?.response?.data?.error || "Something went wrong!");
};
