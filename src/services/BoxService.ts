import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PokemonResumo } from "../models/Pokemon.js";
import { LocalBoxError } from "../models/CustomErrors.js";


export class BoxService {
  private readonly filePath: string;

  /**
   * Construtor do BoxService. Define o caminho do arquivo de persistência.
   * 
   * @param fileName - Nome do arquivo JSON de banco de dados (padrão: "pc_box.json").
   */
  constructor(fileName = "pc_box.json") {
    // Define o caminho absoluto baseado no diretório atual de execução do projeto
    this.filePath = join(process.cwd(), fileName);
  }

  /**
   * Carrega os Pokémon do arquivo de catálogo local de forma assíncrona.
   * Se o arquivo não existir, inicializa-o com um array vazio e o retorna.
   * 
   * @returns Uma Promise contendo a lista de Pokémon carregados do catálogo.
   */
  async carregar(): Promise<PokemonResumo[]> {
    try {
      const conteudo = await readFile(this.filePath, "utf-8");
      return JSON.parse(conteudo) as PokemonResumo[];
    } catch (erro: any) {
  
      if (erro.code === "ENOENT") {
        const catalogoInicial: PokemonResumo[] = [];
        await this.salvar(catalogoInicial);
        return catalogoInicial;
      }
      throw new LocalBoxError(`Falha ao ler o catálogo local: ${erro.message}`);
    }
  }

  /**
   * Salva a lista de Pokémon no arquivo de catálogo local de forma assíncrona.
   * 
   * @param pokemons - A lista completa de Pokémon a ser persistida.
   */
  async salvar(pokemons: PokemonResumo[]): Promise<void> {
    try {
      const dadosJson = JSON.stringify(pokemons, null, 2);
      await writeFile(this.filePath, dadosJson, "utf-8");
    } catch (erro: any) {
      throw new LocalBoxError(`Falha ao salvar no catálogo local: ${erro.message}`);
    }
  }
}
