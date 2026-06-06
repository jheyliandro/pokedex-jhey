import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { PokeApiService } from "../services/PokeApiService.js";
import { BoxService } from "../services/BoxService.js";
import { PokemonResumo } from "../models/Pokemon.js";
import { capitalize, formatId, formatStats } from "../utils/textFormatters.js";


export class CatalogoPokemon {
  private pokemons: PokemonResumo[] = [];

  constructor(private boxService: BoxService) { }


  async inicializar(): Promise<void> {
    this.pokemons = await this.boxService.carregar();
  }

  /**
   * Adiciona um novo Pokémon ao catálogo, prevenindo duplicatas de ID (RF08).
   * 
   * @param pokemon - O Pokémon a ser adicionado.
   */
  async adicionar(pokemon: PokemonResumo): Promise<void> {
    // Utiliza o método 'some' para verificar duplicidade (RF11)
    const jaExiste = this.pokemons.some((item) => item.id === pokemon.id);

    if (jaExiste) {
      console.log(`\x1b[33m[AVISO] ${pokemon.nome} já está no catálogo.\x1b[0m`);
      return;
    }

    this.pokemons.push(pokemon);
    await this.boxService.salvar(this.pokemons);
    console.log(`\x1b[32m[OK] ${pokemon.nome} adicionado ao catálogo.\x1b[0m`);
  }

  /**
   * Lista todos os Pokémon presentes no catálogo 
   */
  listar(): void {
    if (this.pokemons.length === 0) {
      console.log("\x1b[33m[AVISO] Catálogo vazio.\x1b[0m");
      return;
    }

    console.log("\x1b[1;36m\n--- Catálogo Atual ---");
    
    this.pokemons.forEach((pokemon) => {
      const idFmt = formatId(pokemon.id);
      const nomeFmt = capitalize(pokemon.nome);
      const tiposFmt = pokemon.tipos.map(capitalize).join(", ");
      const statsFmt = formatStats(pokemon.hp, pokemon.attack, pokemon.defense);

      console.log(
        `\x1b[32m${idFmt}\x1b[0m - \x1b[1m${nomeFmt}\x1b[0m | ` +
        `Tipos: \x1b[35m${tiposFmt}\x1b[0m | ` +
        `Altura: \x1b[33m${pokemon.altura / 10}m\x1b[0m | ` +
        `Peso: \x1b[33m${pokemon.peso / 10}kg\x1b[0m | ` +
        `Stats [ \x1b[36m${statsFmt}\x1b[0m ]`
      );
    });
    console.log("\x1b[1;36m----------------------\x1b[0m");
  }

  /**
   * Remove um Pokémon do catálogo utilizando o ID informado (RF10).
   * 
   * @param id - O ID numérico do Pokémon a ser removido.
   */
  async remover(id: number): Promise<void> {
    // Utiliza o método 'some' para verificar existência antes de remover
    const existe = this.pokemons.some((pokemon) => pokemon.id === id);

    if (!existe) {
      console.log("\x1b[33m[AVISO] Nenhum Pokémon encontrado com esse ID.\x1b[0m");
      return;
    }

    // Utiliza o método 'filter' para remover o Pokémon pelo ID 
    this.pokemons = this.pokemons.filter((pokemon) => pokemon.id !== id);
    await this.boxService.salvar(this.pokemons);
    console.log("\x1b[32m[OK] Pokémon removido do catálogo.\x1b[0m");
  }


  getPokemons(): PokemonResumo[] {
    return this.pokemons;
  }
}

/**
 * Camada de Interface do Usuário (TerminalController)
 */
export class TerminalController {
  private catalogo!: CatalogoPokemon;

  constructor(
    private pokeApiService: PokeApiService,
    private boxService: BoxService
  ) {
    this.catalogo = new CatalogoPokemon(this.boxService);
  }


  async inicializar(): Promise<void> {
    await this.catalogo.inicializar();
  }


  async iniciarLoop(): Promise<void> {
    const rl = readline.createInterface({ input, output });
    let continuar = true;

    console.log("\x1b[1;35m===================================================\x1b[0m");
    console.log("\x1b[1;36m           P O K É D E X   T Y P E S C R I P T          \x1b[0m");
    console.log("\x1b[1;32m                   S C T E C  L I T E                       \x1b[0m");
    console.log("\x1b[1;35m===================================================\x1b[0m");

    while (continuar) {
      this.exibirMenuPrincipal();
      const opcao = await rl.question("\n\x1b[1mEscolha uma opção: \x1b[0m");

      switch (opcao.trim()) {
        case "1":
          await this.executarBuscaInterativa(rl);
          break;
        case "2":
          this.catalogo.listar();
          break;
        case "3":
          await this.executarRemocaoInterativa(rl);
          break;
        case "4":
          await this.executarDemonstracaoAutomatica();
          break;
        case "5":
          console.log("\x1b[1;32m\nPrograma encerrado. Até a próxima!\x1b[0m");
          continuar = false;
          break;
        default:
          console.log("\x1b[31m[ERRO] Opção inválida. Escolha um número de 1 a 5.\x1b[0m");
      }
    }

    rl.close();
  }

  /**
   * Exibe as opções de menu de forma estilizada.
   */
  private exibirMenuPrincipal(): void {
    console.log("\n\x1b[1;34m     🔴⚈  ․̫ ⚈🔴  ::: MENU PRINCIPAL :::  🟡⁠◕⁠‿⁠◕🟡 \n\x1b[0m");
    console.log("\x1b[36m1. 🔍 Buscar e Adicionar Pokémons via API\x1b[0m");
    console.log("\x1b[36m2. 📦 Listar Pokémons armazenados no sistema\x1b[0m");
    console.log("\x1b[36m3. ❌ Remover Pokémon por ID\x1b[0m");
    console.log("\x1b[36m4. ⚡ Executar Demonstração Automática\x1b[0m");
    console.log("\x1b[36m5. 🚪 Sair do programa\x1b[0m");
  }

  /**
   * Executa a busca interativa de Pokémon via PokeAPI.
   */
  private async executarBuscaInterativa(rl: readline.Interface): Promise<void> {
    const nomeOuId = await rl.question("\nDigite o nome ou ID do Pokémon: ");
    if (!nomeOuId.trim()) {
      console.log("\x1b[31m[ERRO] Entrada inválida.\x1b[0m");
      return;
    }

    console.log(`\n\x1b[34mBuscando "${nomeOuId.trim()}" na PokeAPI...\x1b[0m`);
    const pokemon = await this.pokeApiService.buscarPokemon(nomeOuId);

    if (pokemon) {
      console.log(
        `\x1b[32m[OK] Pokémon encontrado: ${pokemon.nome}\x1b[0m`
      );
      console.log(
        `\x1b[1m#${pokemon.id} - ${capitalize(pokemon.nome)} | ` +
        `Tipos: ${pokemon.tipos.join(", ")} | ` +
        `Altura: ${pokemon.altura} | Peso: ${pokemon.peso}\x1b[0m`
      );

      const desejaAdicionar = await rl.question("\nDeseja adicionar este Pokémon ao catálogo? (s/n): ");
      if (desejaAdicionar.trim().toLowerCase() === "s") {
        await this.catalogo.adicionar(pokemon);
      } else {
        console.log("\x1b[33mBusca finalizada sem adição ao catálogo.\x1b[0m");
      }
    }
  }

  /**
   * Executa a remoção interativa de Pokémon pelo ID.
   */
  private async executarRemocaoInterativa(rl: readline.Interface): Promise<void> {
    const idStr = await rl.question("\nDigite o ID do Pokémon a ser removido: ");
    const id = parseInt(idStr.trim(), 10);

    if (isNaN(id)) {
      console.log("\x1b[31m[ERRO] ID inválido. Digite um número inteiro.\x1b[0m");
      return;
    }

    await this.catalogo.remover(id);
  }

  /**
   * Executa o fluxo de teste e demonstração de forma automatizada.
   */
  async executarDemonstracaoAutomatica(): Promise<void> {
    console.log("\n\x1b[1;35m===================================================\x1b[0m");
    console.log("\x1b[1;33m       INICIANDO DEMONSTRAÇÃO AUTOMÁTICA        \x1b[0m");
    console.log("\x1b[1;35m===================================================\x1b[0m");

    // Instancia uma cópia limpa temporária de catálogo em memória para a demonstração

    const demoCatalogo = new CatalogoPokemon(this.boxService);
    await demoCatalogo.inicializar();

    // 1. Buscar pikachu
    console.log("\n\x1b[34m[TESTE 1] buscando 'pikachu'...\x1b[0m");
    const pikachu = await this.pokeApiService.buscarPokemon("pikachu");
    if (pikachu !== null) {
      await demoCatalogo.adicionar(pikachu);
    }

    // 2. Buscar charmander
    console.log("\n\x1b[34m[TESTE 2] buscando 'charmander'...\x1b[0m");
    const charmander = await this.pokeApiService.buscarPokemon("charmander");
    if (charmander !== null) {
      await demoCatalogo.adicionar(charmander);
    }

    // 3. Buscar pikachu duplicado
    console.log("\n\x1b[34m[TESTE 3] tentando adicionar duplicado 'pikachu'...\x1b[0m");
    const pikachuDuplicado = await this.pokeApiService.buscarPokemon("pikachu");
    if (pikachuDuplicado !== null) {
      await demoCatalogo.adicionar(pikachuDuplicado);
    }

    // 4. Buscar espécie inexistente
    console.log("\n\x1b[34m[TESTE 4] buscando 'pokemon-inexistente'...\x1b[0m");
    await this.pokeApiService.buscarPokemon("pokemon-inexistente");

    // 5. Listar catálogo
    console.log("\n\x1b[34m[TESTE 5] listando o catálogo...\x1b[0m");
    demoCatalogo.listar();

    // 6. Remover ID 25 (pikachu)
    console.log("\n\x1b[34m[TESTE 6] removendo ID 25 (pikachu)...\x1b[0m");
    await demoCatalogo.remover(25);

    // 7. Listar catálogo final
    console.log("\n\x1b[34m[TESTE 7] listando catálogo após remoção...\x1b[0m");
    demoCatalogo.listar();

    console.log("\n\x1b[1;32m[OK] Demonstração concluída com sucesso!\x1b[0m");
    console.log("\x1b[1;35m===================================================\x1b[0m\n");
  }
}
