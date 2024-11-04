/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/utils";
export const baseUrl =
  process.env.NEXT_RUNTIME_NODE_ENV === "development"
    ? "https://abc054f586b4.ngrok.app/api/v1"
    : "/api/v1";
export const config = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: "",
    },
  };
};

export const api = async (
  method: string,
  url: string,
  obj = {},
  customConfig = {}
) => {
  console.log(customConfig);
  const token = localStorage.getItem("token");
  const axiosConfig = config();
  if (token) {
    axiosConfig.headers["Authorization"] = `Bearer ${token}`;
    axiosConfig.headers = { ...axiosConfig.headers, ...customConfig };
  }

  console.log(axiosConfig);

  try {
    switch (method) {
      case "GET":
        return await axiosInstance
          .get(`${baseUrl}/${url}`, axiosConfig)
          .then((res) => res.data);

      case "POST":
        return await axiosInstance
          .post(`${baseUrl}/${url}`, obj, axiosConfig)
          .then((res) => res.data);

      case "PUT":
        return await axiosInstance
          .put(`${baseUrl}/${url}`, obj, axiosConfig)
          .then((res) => res.data);

      case "DELETE":
        return await axiosInstance
          .delete(`${baseUrl}/${url}`, axiosConfig)
          .then((res) => res.data);
    }
  } catch (error: any) {
    const err =
      error?.response?.data?.message ||
      error?.message ||
      error ||
      "Something went wrong";
    const expectedErrorCodes = [401];
    if (expectedErrorCodes.includes(error?.response?.status)) {
      localStorage.clear();
      // window.location.href = window.location.origin;
      // window.location.reload();
    }
    throw err;
  }
};

type Method = "GET" | "POST" | "PUT" | "DELETE" | "InfiniteScroll";

interface ApiHookParams {
  key: string[];
  method: Method;
  url: string;
  scrollMethod?: "GET";
  customConfig?: any;
}

export default function useApi({
  key,
  method,
  url,
  customConfig,
}: ApiHookParams) {
  const queryClient = new QueryClient();
  switch (method) {
    case "GET":
      // eslint-disable-next-line
      const get = useQuery({
        queryKey: key,
        queryFn: async () => {
          return await api(method, url, {});
        },
        retry: 0,
        enabled: false,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
      });

      return { get };

    case "POST":
      // eslint-disable-next-line
      const post = useMutation({
        mutationFn: (obj: any) => api(method, url, obj, customConfig),
        retry: 0,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: key });
        },
      });
      const safePost = (obj: any) => {
        if (!post.isPending) {
          post.mutate(obj);
        }
      };
      return {
        post: {
          ...post,
          ...safePost,
        },
      };

    case "PUT":
      // eslint-disable-next-line
      const put = useMutation({
        mutationFn: (obj: { id: number }) =>
          api(method, `${url}/${obj?.id}`, obj),

        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      });

      return { put };

    case "DELETE":
      // eslint-disable-next-line
      const deleteObj = useMutation({
        mutationFn: (id: string) => api(method, `${url}/${id}`),
        retry: 0,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
      });
      return { deleteObj };

    default:
      throw new Error(`Invalid method ${method}`);
  }
}
