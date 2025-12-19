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
}