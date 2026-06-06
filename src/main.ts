import { PokeApiService } from "./services/PokeApiService.js";
import { BoxService } from "./services/BoxService.js";
import { TerminalController } from "./controllers/TerminalController.js";


async function main() {
  try {
    // 1. Instanciação dos serviços
    const pokeApiService = new PokeApiService();
    const boxService = new BoxService();

    // 2. Instanciação da interface de terminal e injeção de dependências
    const terminalController = new TerminalController(pokeApiService, boxService);

    // 3. Inicialização de dados
    await terminalController.inicializar();

    // 4. Início do loop de interação do console
    await terminalController.iniciarLoop();
  } catch (erro: any) {
    console.error(`\x1b[31m[ERRO CRÍTICO] Falha ao iniciar a Pokédex TypeScript SCTEC Lite: ${erro.message}\x1b[0m`);
    process.exit(1);
  }
}


main();
