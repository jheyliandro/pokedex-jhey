# Pokédex TypeScript SCTEC Lite

## Sobre o projeto

O Pokédex TypeScript Lite é uma aplicação simples em Node.js com TypeScript
que consulta dados de Pokémon na PokeAPI e organiza alguns resultados em um
catálogo local durante a execução do programa.

---

## Objetivo

Praticar os principais conceitos do Módulo 01:
- Node.js;
- JavaScript no back-end;
- TypeScript;
- interfaces;
- funções tipadas;
- arrays;
- objetos;
- JSON;
- métodos de array;
- classes;
- async/await;
- fetch;
- tratamento de erros;
- GitHub;
- GitFlow;
- Kanban.

---

## Tecnologias Utilizadas

Node.js
TypeScript
TSX
PokeAPI
Git
GitHub

---

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:
- Node.js
- npm
- Git

---

## Como instalar

Clone o repositório:
```bash
git clone https://github.com/jheyliandro/pokedex-jhey.git
```
Acesse a pasta do projeto:
```bash
cd pokedex-jhey
```
Instale as dependências:

```bash
npm install
```

## Como Executar em ambiente de Desenvolvimento 

Adicionar o seguinte comando no terminal:

```bash
npm run start

```

## Estrutura do projeto

```
pokedex-jhey/
├── src/
│   ├── main.ts                      # Ponto de entrada centralizado. Instancia serviços e inicia o loop do menu.
│   ├── controllers/
│   │   └── TerminalController.ts    # Interface do Usuário. Controla a exibição, menu e lê inputs do terminal.
│   ├── services/
│   │   ├── PokeApiService.ts        # Integração externa (fetch). Busca dados remotos de Pokémon.
│   │   └── BoxService.ts            # Persistência local (node:fs/promises). Lê e grava dados no pc_box.json.
│   ├── models/
│   │   ├── Pokemon.ts               # Interfaces de Entidade (PokemonApiResponse e PokemonResumo) e moldes tipados.
│   │   └── CustomErrors.ts          # Exceções customizadas estruturadas (APIError, LocalBoxError).
│   └── utils/
│       └── textFormatters.ts        # Utilitários puros com tipagem explícita para formatação de texto e exibição.
├── pc_box.json                      # Arquivo JSON que funciona como banco de dados local.
├── tsconfig.json                    # Regras rígidas de compilação em Strict Mode.
└── package.json                     # Manifesto de configurações, scripts e devDependencies.
```

---

##  Funcionalidades
1. **🔍 Buscar e Adicionar Pokémon**: Consulta um Pokémon pelo nome ou ID por requisição `fetch` assíncrona e permite adicioná-lo de forma interativa à base local.
2. **📦 Listar Catálogo Local (PC Box)**: Exibe a lista completa de Pokémon salvos no banco local estruturado, mostrando atributos, tipos, dimensões e estatísticas com coloração ANSI.
3. **❌ Remover Pokémon por ID**: Remove um Pokémon persistido pelo seu ID oficial atualizando o banco de dados.
4. **⚡ Executar Demonstração Automática**: Executa o fluxo de testes automatizado e assíncrono exatamente como exigido no requisito RF13.
5. **🚪 Sair**: Encerra a aplicação de console de forma limpa.

---

## Exemplos de Execução (Casos Mínimos Obrigatórios)

### Caso 1: Busca Válida
* **Entrada testada**: `pikachu`
* **Saída esperada**:
```
Buscando "pikachu" na PokeAPI...
[OK] Pokémon encontrado: pikachu
#0025 - Pikachu | Tipos: electric | Altura: 4 | Peso: 60
```

### Caso 2: Busca Inválida
* **Entrada testada**: `pokemon-inexistente`
* **Saída esperada**:
```
Buscando "pokemon-inexistente" na PokeAPI...
[ERRO] Pokémon não encontrado: pokemon-inexistente
```

### Caso 3: Inclusão Duplicada no Catálogo
* **Entrada testada**: Adicionar `pikachu` duas vezes consecutivas
* **Saída esperada**:
```
[OK] pikachu adicionado ao catálogo.
...
[AVISO] pikachu já está no catálogo.
```

### Caso 4: Remoção do Catálogo
* **Entrada testada**: Remover Pokémon com ID `25`
* **Saída esperada**:
```
[OK] Pokémon removido do catálogo.
```
* **Se tentado ID inexistente no catálogo**:
```
[AVISO] Nenhum Pokémon encontrado com esse ID.

```
---

## Conceitos aplicados

TypeScript

O TypeScript foi utilizado em todo o projeto em modo estrito (`strict: true`) para assegurar a tipicidade estática dos dados e evitar erros comuns de execução (como propriedades nulas ou indefinidas).

Interface PokemonResumo

O objetivo principal da interface PokemonResumo é atuar como uma camada de simplificação e consistência de dados, modelando os mesmos de forma consolidada e simplificada que serão gravados no catálogo local.

Fetch e async/await

A integração e consumo de dados da API externa é feita de forma assíncrona. O Node.js (v18+) introduziu suporte nativo à Fetch API global com a aplicação monta dinamicamente o endpoint e disparando a requisição HTTP

Tratamento de erros

A aplicação possui um sistema robusto de captura de falhas dividido em camadas para evitar travamentos inesperados como status de resposta http, blocos try/catch e exceções customizadas como a classes `APIError` e `LocalBoxError`.

Métodos de array

O projeto faz uso extensivo de métodos funcionais de array para manipulação de coleções de dados,
usando o `map` por exemplo para transformar o array de objetos aninhados `types` da PokeAPI em um array simples contendo apenas as strings correspondentes aos nomes dos tipos (ex: `['electric']`).
no caso do `some`, verifica se o Pokémon já existe no catálogo comparando os IDs (`item.id === pokemon.id`). Retorna `true` se houver duplicado, permitindo que a inserção seja bloqueada. Por fim o `forEach` Percorre a lista de Pokémon gravada e imprime individualmente cada registro formatado no console e o `filter`  Cria uma lista filtrada contendo todos os Pokémon cujos IDs sejam diferentes do ID informado para a remoção, substituindo a lista antiga.

Classe CatalogoPokemon

A classe `CatalogoPokemon` representa a entidade que gerencia as operações de negócio em memória e faz a ponte com a persistência de dados, com atributos como `pokemons: PokemonResumo[]` que mantém a coleção de Pokémon em memória durante a execução do programa e `boxService: BoxService`, que é o serviço utilizado para ler e gravar dados no arquivo `pc_box.json`.

Já os métodos tem `adicionar` para colocar um novo Pokémon na lista em memória caso ele não seja duplicado, e salva o array atualizado em disco, `listar(): void` para varrer o array em memória e renderizar formatado no terminal ou avisa caso o catálogo esteja vazio e `remover` para eliminar o Pokémon correspondente da memória caso ele exista, e atualiza o arquivo local.

---

## Organização do projeto

* **Kanban**: O progresso e planejamento de tarefas foi feito no quadro Kanban sob o link: https://github.com/users/jheyliandro/projects/2/views/1

* **Branches Utilizadas (GitFlow)**:
* `main`: aplicação em produção, originada da branch de lançamento release.
* `release`: lançamento estável e homologado após testes de execução e usabilidade.
* `develop`: desenvolvimento e integração de novas funcionalidades.
* `docs/readme`: Manual de instruções da aplicação.
* `feature/pokeapi`: Criação de clientes assíncronos PokeAPI e FS-Box.


## Melhorias futuras
- Criar menu interativo no terminal
- Salvar catálogo em arquivo JSON
- Exibir HP, ataque e defesa
- Criar filtros por tipo de Pokémon
- Criar uma API própria com Express
