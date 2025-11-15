import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export const useAuthenticatedAxios = () => {
  const { getAccessTokenSilently } = useAuth0();
  const isProduction = process.env.REACT_APP_ENV === "production";

  const axiosInstance = axios.create();

  useEffect(() => {
    // Only add interceptor in production
    if (isProduction) {
      const requestInterceptor = axiosInstance.interceptors.request.use(
        async (config) => {
          const token = await getAccessTokenSilently();
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        },
      );

      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
      };
    }
  }, [getAccessTokenSilently, isProduction]);

  return axiosInstance;
};
