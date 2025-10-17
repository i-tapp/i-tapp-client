export type FetchResponse = {
  statusCode: number;
  message: string;
  data?: unknown[] | { [key: string]: any } | string;
  error?: string;
};

export interface Env {
  appEnv?: string;
  appName?: string;
  appDomain?: string;
  backendUrl?: string;
  backendApiUrl?: string;
  frontendUrl?: string;
}
