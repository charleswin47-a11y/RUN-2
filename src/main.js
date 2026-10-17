import { GameEngine } from './game.js';
import { MenuSystem } from './ui/menus.js';
import { ResultsScreen } from './ui/results.js';

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const game = new GameEngine();
    const menus = new MenuSystem();
    const results = new ResultsScreen();

    // Inicializa a engine com callback de finalização de partida
    game.init(canvas, {
      onMatchEnd: (summary) => {
        results.show(summary);
      }
    });

    // Inicializa o sistema de menus e botões
    menus.init({
      onStartGame: (characterId, isMultiplayer = false, stageIndex = 0) => {
        menus.hideMenu();
        if (isMultiplayer && menus.multiplayer.isConnected) {
          game.multiplayer = menus.multiplayer;
        } else {
          game.multiplayer = null;
        }
        game.start(characterId, stageIndex);
      },
      onResume: () => {
        menus.hidePause();
        game.resume();
      },
      onRestart: () => {
        menus.hidePause();
        game.restart();
      }
    });

    // Inicializa a tela de resultados
    results.init({
      onAdvanceStage: () => {
        game.advanceToNextStage();
      },
      onPlayAgain: () => {
        game.retryCurrentStage();
      },
      onBackMenu: () => {
        game.destroy();
        menus.showMenu();
      }
    });

    // Exibe a tela de menu inicial para seleção de personagem
    menus.showMenu();

    // Expõe a instância para testes ou futura integração no window
    window.__BOSS_MODE_GAME__ = game;
  });
} else {
  // Executado em ambiente Node.js (ex: Render configurado com Start Command 'node src/main.js')
  console.log('[A Grande Família - Modo Chefão] Inicializando servidor HTTP automaticamente...');
  import('../server.js');
}
