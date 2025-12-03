import { PokemonFilterKeys } from "../pokemons/models/pokemon.model";

export class PokemonUtilities {
  static omitNullishValue(object: Object): Record<string, string> {
    const params: Record<string, string> = {};
    for (const [key, value] of Object.entries(object)) {
      if (value || value === 0) {
        params[key] = value;
      }
    }
    return params;
  }

  static o1Equalo2<T extends PokemonFilterKeys>(
    o1: Record<T, string>,
    o2: Record<T, string>
  ): boolean {
    return Object.keys(o1).some(
      key => o1[key as T] !==
        o2[key as T]
    );
  }
}