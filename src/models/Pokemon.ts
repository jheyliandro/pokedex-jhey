/**
 * Representa o formato de resposta bruta retornada pela PokeAPI.
 */
export interface PokemonApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
}

/**
 * Representa o Pokémon simplificado e devidamente tipado utilizado no catálogo local.
 */
export interface PokemonResumo {
  id: number;
  nome: string;
  tipos: string[];
  altura: number;
  peso: number;
  hp: number;
  attack: number;
  defense: number;
}
