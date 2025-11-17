import { InjectionToken } from "@angular/core";

const BASE_PATHNAME = 'likes';

export const LIKE_API_PATHS = {
  GET_USER_LIKE_IDS : BASE_PATHNAME,
  TOGGLE_LIKE: BASE_PATHNAME
} as const;

export const LIKE_API_PATHS_TOKEN = new InjectionToken<typeof LIKE_API_PATHS>('Like_API_PATHS');