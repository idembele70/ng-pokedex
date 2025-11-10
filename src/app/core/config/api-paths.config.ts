import { InjectionToken } from "@angular/core";

const createAuthApiPaths = (basePathname: string) => {
  return {
    LOGIN: `${basePathname}/login`,
    REGISTER: `${basePathname}/register`,
    ME: `${basePathname}/me`,
    REFRESH_TOKEN: `${basePathname}/refresh`,
    LOGOUT: `${basePathname}/logout`,
  } as const;
}

const API_PATHS = {
  AUTH: createAuthApiPaths('auth'),
};

export const API_PATHS_TOKEN = new InjectionToken<typeof API_PATHS>('API_PATHS', {
  providedIn: 'root',
  factory: () => API_PATHS,
});