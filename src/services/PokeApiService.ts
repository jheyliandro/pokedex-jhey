import { PokemonApiResponse, PokemonResumo } from "../models/Pokemon.js";
import { APIError } from "../models/CustomErrors.js";

/**
 * Serviço responsável por realizar a integração com a API externa PokeAPI.
 */
export class PokeApiService {
  private readonly baseUrl = "https://pokeapi.co/api/v2/pokemon";

  /**
   * Busca dados de um Pokémon na PokeAPI utilizando o nome ou ID informado.
   * 
   * @param nomeOuId - O nome ou ID numérico do Pokémon.
   * @returns Uma Promise contendo o objeto PokemonResumo mapeado ou null se não for encontrado.
   */
  async buscarPokemon(nomeOuId: string): Promise<PokemonResumo | null> {
    if (!nomeOuId) {
      console.log("[ERRO] O nome ou ID do Pokémon não pode ser vazio.");
      return null;
    }

    const termoBusca = nomeOuId.trim().toLowerCase();
    const url = `${this.baseUrl}/${termoBusca}`;

    try {
      const resposta = await fetch(url);

      if (!resposta.ok) {
        if (resposta.status === 404) {
          console.log(`[ERRO] Pokémon não encontrado: ${nomeOuId}`);
        } else {
          console.log(`[ERRO] Falha na requisição da API (Status: ${resposta.status})`);
        }
        return null;
      }

      // Faz o parse do JSON retornado pela API
      const dados = (await resposta.json()) as PokemonApiResponse;

      // Realiza o mapeamento para o nosso formato simplificado (PokemonResumo)
      const tipos = dados.types.map((item) => item.type.name);

      // Extrai os atributos de combate específicos das estatísticas (stats) da API
      const hp = dados.stats?.find((s) => s.stat.name === "hp")?.base_stat ?? 0;
      const attack = dados.stats?.find((s) => s.stat.name === "attack")?.base_stat ?? 0;
      const defense = dados.stats?.find((s) => s.stat.name === "defense")?.base_stat ?? 0;

      const pokemonResumo: PokemonResumo = {
        id: dados.id,
        nome: dados.name,
        tipos: tipos,
        altura: dados.height,
        peso: dados.weight,
        hp,
        attack,
        defense
      };

      return pokemonResumo;
    } catch (erro) {
      console.log("[ERRO] Não foi possível buscar o Pokémon.");
      return null;
    }
  }
}
