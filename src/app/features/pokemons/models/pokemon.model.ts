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
  currentPage: string;
  totalPages: string;
  totalItems: string;
}

export interface PokemonFilter {
  name?: string;
  id?: string;
  type?: string;
}

export type PokemonFilterKeys = keyof PokemonFilter;