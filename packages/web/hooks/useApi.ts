import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/utils";

export const baseUrl =
  process.env.NEXT_RUNTIME_NODE_ENV === "development"
    ? "https://f96c46c75e18.ngrok.app/api/v1"
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
  const token = localStorage.getItem("token");
  const axiosConfig = config();
  if (token) {
    axiosConfig.headers["Authorization"] = `Bearer ${token}`;
    axiosConfig.headers = { ...axiosConfig.headers, ...customConfig };
  }

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

interface PostOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export default function useApi({
  key,
  method,
  url,
  customConfig,
}: ApiHookParams) {
  const queryClient = new QueryClient();

  // Declare all hooks at the top level
  const queryResult = useQuery({
    queryKey: key,
    queryFn: async () => {
      return await api("GET", url, {});
    },
    retry: 0,
    enabled: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const postMutation = useMutation({
    mutationFn: async (obj: any) => {
      return await api("POST", url, obj, customConfig);
    },
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const putMutation = useMutation({
    mutationFn: (obj: { id: number }) => api("PUT", `${url}/${obj?.id}`, obj),
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api("DELETE", `${url}/${id}`),
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  // Create safe post function
  const safePost = async (data: any, options?: PostOptions) => {
    if (postMutation.isPending) {
      console.warn("A request is already in progress. Skipping new request.");
      return;
    }

    try {
      const result = await postMutation.mutateAsync(data);
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      options?.onError?.(error);
      throw error;
    }
  };

  // Return appropriate result based on method
  switch (method) {
    case "GET":
      return { get: queryResult };

    case "POST":
      return {
        post: {
          ...postMutation,
          mutate: safePost,
          mutateAsync: safePost,
        },
      };

    case "PUT":
      return { put: putMutation };

    case "DELETE":
      return { deleteObj: deleteMutation };

    default:
      throw new Error(`Invalid method ${method}`);
  }
}
