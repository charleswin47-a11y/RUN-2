# Guia de Integração Futura com A Grande Família Game

Este documento estabelece as diretrizes de integração entre o **Modo Chefão** (`a-grande-familia-boss-mode`) e o jogo principal **A Grande Família Game** (`amigos-run`).

---

## 1. Princípios de Isolamento e Segurança

1. **Sem Estado Global Poluído:**
   O Modo Chefão foi desenhado em torno da classe `GameEngine`, que encapsula todo o loop de jogo, controles, pontuação e temporizadores. Nenhuma variável global (`window.x`) é requerida para sua execução.

2. **Gerenciamento de Ciclo de Vida (`GameMode` Interface):**
   A classe `GameEngine` implementa:
   - `init(canvas, options)`: vincula o canvas e callbacks de término.
   - `start(characterId)`: inicializa ou reinicia a partida.
   - `pause()`: congela o tempo lógico sem saltos de frames.
   - `resume()`: retoma a partida sem desfasamento no cronômetro real.
   - `destroy()`: remove todos os listeners de teclado e toque (`removeEventListener`), limpa a fila do `requestAnimationFrame` e desaloca partículas.

3. **Compatibilidade com o Canvas do Runner:**
   A arena utiliza resolução lógica nativa de `960x540` (proporção 16:9), adaptável a qualquer viewport responsivo sem deformações, mantendo a mesma estética retrô em pixel art.

---

## 2. Passos para a Integração no Jogo Original

### Passo 1: Copiar os Arquivos
Copie o diretório `src/` e `assets/` do Modo Chefão para dentro de um subdiretório do jogo principal, por exemplo:
```
amigos-run/
├── public/
│   └── modes/
│       └── boss-mode/
│           ├── game.js
│           ├── config.js
│           ├── entities/
│           ├── systems/
│           └── ui/
```

### Passo 2: Adicionar o Botão no Menu Principal de A Grande Família
No menu inicial de seleção de modo do jogo original:
```html
<button id="btn-mode-boss" class="menu-btn">
  MODO CHEFÃO: O SÍNDICO
</button>
```

### Passo 3: Transição de Modos no Código
Quando o usuário seleciona o Modo Chefão:
```javascript
import { GameEngine } from './modes/boss-mode/game.js';

let bossGameInstance = null;

function startBossMode(canvas, characterId) {
  // 1. Pausa e esconde o runner padrão
  runnerInstance.stop();
  runnerContainer.style.display = 'none';

  // 2. Instancia e inicia o modo chefão
  bossGameInstance = new GameEngine();
  bossGameInstance.init(canvas, {
    onMatchEnd: (results) => {
      // 3. Envia o score para o leaderboard global via server.js quando conectado
      submitScoreToGlobalLeaderboard({
        name: currentPlayerData.name,
        character: results.characterId,
        score: results.finalScore,
        mode: 'boss-mode'
      });
    }
  });

  bossGameInstance.start(characterId);
}

function exitBossMode() {
  if (bossGameInstance) {
    bossGameInstance.destroy(); // Garante limpeza total de eventos
    bossGameInstance = null;
  }
  // Retorna ao menu ou ao runner
  menuContainer.style.display = 'block';
}
```

### Passo 4: Integração com o Ranking Global (`server.js`)
No futuro, basta criar um endpoint ou estender a rota existente de leaderboard no `server.js`:
- Endpoint: `POST /api/leaderboard/boss`
- Payload:
  ```json
  {
    "player": "Jogador 1",
    "character": "di5",
    "score": 18450,
    "victory": true,
    "time": 102,
    "damage": 1000
  }
  ```
- O arquivo `src/systems/scoring.js` já gera essa estrutura pronta através do método `getSummary()`.

---

## 3. Garantias de Não Regressão
- Os eventos do teclado só ficam ativos enquanto o modo estiver ativo.
- O loop de física usa `dt` (tempo delta em segundos) e não depende do framerate da máquina.
- As recargas e invulnerabilidades são independentes do motor do corredor infinito.
