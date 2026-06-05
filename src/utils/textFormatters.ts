/**
 * Transforma a primeira letra de uma string em maiúscula e o restante em minúscula.
 * Exemplo: "pikachu" -> "Pikachu", "PIKACHU" -> "Pikachu"
 * 
 * @param texto - O texto a ser formatado.
 * @returns O texto formatado.
 */
export function capitalize(texto: string): string {
  if (!texto) return "";
  const limpo = texto.trim().toLowerCase();
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

/**
 * Formata o ID numérico do Pokémon em uma string padronizada com zeros à esquerda (Pokedex Format).
 * Exemplo: 25 -> "#0025", 3 -> "#0003", 1008 -> "#1008"
 * 
 * @param id - O ID numérico oficial do Pokémon.
 * @returns O ID formatado como string.
 */
export function formatId(id: number): string {
  return `#${String(id).padStart(4, "0")}`;
}

/**
 * Formata as estatísticas de combate de forma amigável e estilizada para console.
 * 
 * @param hp - Base HP.
 * @param attack - Base Attack.
 * @param defense - Base Defense.
 * @returns Uma string contendo os atributos formatados.
 */
export function formatStats(hp: number, attack: number, defense: number): string {
  return `HP: ${hp} | ATK: ${attack} | DEF: ${defense}`;
}
