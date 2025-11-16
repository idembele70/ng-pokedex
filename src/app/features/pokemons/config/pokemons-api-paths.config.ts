import { InjectionToken } from "@angular/core";

const BASE_PATHNAME = 'pokemons';

export const POKEMON_API_PATHS = {
  GET_ALL: BASE_PATHNAME,
  SEARCH: `${BASE_PATHNAME}/search`,
  GET_USER_LIKED: `${BASE_PATHNAME}/likes`,
} as const;

export const POKEMON_API_PATHS_TOKEN = new InjectionToken<typeof POKEMON_API_PATHS>('Pokemon_API_PATHS');