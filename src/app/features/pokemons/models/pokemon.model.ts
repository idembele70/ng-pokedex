export interface Pokemon {
  _id: string;
  id: string;
  name: string;
  img: string;
  type: string[];
  likeCount: number;
  updatedAt: string;
}
export interface PokemonPage {
  pokemons: Pokemon[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface PokemonFilter {
  name?: string;
  id?: string;
  type?: string;
}

export type PokemonFilterKeys = keyof PokemonFilter;