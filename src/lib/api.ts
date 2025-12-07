"use server";
import { cookies } from "next/headers";
import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import axios, { AxiosInstance } from "axios";
import { env } from "@/utils";

const API_BASE_URL = env().backendApiUrl;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = (await cookies()).get("session-token")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // if (config.data instanceof FormData) {
    //   config.headers["Content-Type"] = "multipart/form-data";
    // }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data;
    const message = apiError?.message || apiError?.error;
    return Promise.reject(new Error(message));
  }
);

export async function api<T = any>(
  url: string,
  { method = "GET", data, headers, ...options }: any = {}
): Promise<T> {
  const requestUrl = isAbsoluteUrl(url) ? url : `${API_BASE_URL}${url}`;
  try {
    const response = await axiosInstance.request<T>({
      url: requestUrl,
      method,
      data,
      headers,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error; // don’t swallow
  }
}

// ✅ Mutate helper with your desired signature
export async function mutate<T = any>(
  url: string,
  data?: any,
  method: "POST" | "PATCH" | "PUT" | "DELETE" = "POST"
): Promise<T> {
  return api<T>(url, { method, data });
}

// ✅ Query helper (GET by default)
export async function query<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  return api<T>(url, { method: "GET", ...options });
}
