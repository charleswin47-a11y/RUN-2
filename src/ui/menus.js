import { CHARACTERS_CONFIG, BOSSES_CONFIG, CAMPAIGN_STAGES } from '../config.js';
import { SpriteRenderer } from '../graphics/spriteRenderer.js';
import { MultiplayerSystem } from '../systems/multiplayer.js';

// Estilos de combate / arquétipos temáticos dos 16 lutadores
const FIGHTER_STYLES = {
  di5: 'DEFENSOR PESADO • CONTRA-ATAQUE',
  wendel: 'VELOCISTA • INVESTIDA RELÂMPAGO',
  muniz: 'LUTADOR EQUILIBRADO • CHUTE CANHÃO',
  joao: 'COMBATE ÁGIL • TELETRANSPORTE FANTASMA',
  douglas: 'BRIGÃO BRUTAL • TERREMOTO DE IMPACTO',
  nalu: 'SUPORTE RADIANTE • BRILHO CURATIVO',
  beatriz: 'ESTRATEGISTA TÁTICA • ARMADILHA DE FOGO',
  vitor_sonic: 'ACROBATA ULTRA-SÔNICO • GIRO VELOZ',
  vitor_mario: 'SALTADOR CLÁSSICO • PISADA DESTRUIDORA',
  julya: 'RITMISTA SONORA • ONDA DE CHOQUE',
  junior: 'PRODÍGIO VELOZ • GANCHO METEÓRICO',
  clarinha: 'GAMER TÁTICA • DRONE DE SUPORTE',
  taynara: 'GUARDIÃ DA NATUREZA • RAÍZES PROTETORAS',
  matheus: 'BOXEADOR URBANO • SEQUÊNCIA EXPLOSIVA',
  emily: 'ARTESÃ MÍSTICA • ESCUDO DE CRISTAL',
  lais: 'MAGA CELESTE • METEORO DE LUZ'
};

export class MenuSystem {
  constructor() {
    // Telas do Fluxo
    this.screenTitle = document.getElementById('screen-title');
    this.screenCharSelect = document.getElementById('screen-char-select');
    this.screenCampaignSelect = document.getElementById('screen-campaign-select');
    this.screenLobby = document.getElementById('screen-lobby');
    this.screenVersus = document.getElementById('screen-versus');
    this.screenControls = document.getElementById('controls-screen');
    this.screenPause = document.getElementById('pause-screen');
    this.screenResults = document.getElementById('results-screen');

    // Tela Inicial / Título
    this.titleFightersCanvas = document.getElementById('title-fighters-canvas');
    this.btnModeSolo = document.getElementById('btn-mode-solo');
    this.btnModeCoop = document.getElementById('btn-mode-coop');
    this.btnModeCampaign = document.getElementById('btn-mode-campaign');
    this.btnModeControls = document.getElementById('btn-mode-controls');

    // Tela de Seleção de Personagens
    this.btnCharSelectBack = document.getElementById('btn-char-select-back');
    this.btnCharSelectConfirm = document.getElementById('btn-char-select-confirm');
    this.charSelectModeTag = document.getElementById('char-select-mode-tag');
    this.fighterHeroCanvas = document.getElementById('fighter-hero-canvas');
    this.heroCharName = document.getElementById('hero-char-name');
    this.heroCharStyle = document.getElementById('hero-char-style');
    this.heroAbilityName = document.getElementById('hero-ability-name');
    this.heroAbilityCooldown = document.getElementById('hero-ability-cooldown');
    this.heroAbilityDesc = document.getElementById('hero-ability-desc');
    this.heroBasicName = document.getElementById('hero-basic-name');
    this.charRosterGrid = document.getElementById('char-roster-grid');

    // Tela de Seleção de Campanha
    this.btnCampaignBack = document.getElementById('btn-campaign-back');
    this.btnCampaignConfirm = document.getElementById('btn-campaign-confirm');
    this.campaignCardsContainer = document.getElementById('campaign-cards-container');

    // Tela do Lobby Online
    this.btnLobbyBackMenu = document.getElementById('btn-lobby-back-menu');
    this.btnLobbyCopyCodeTop = document.getElementById('btn-lobby-copy-code-top');
    this.lobbyRoomCodeTag = document.getElementById('lobby-room-code-tag');
    this.lobbyAuthPanel = document.getElementById('lobby-auth-panel');
    this.lobbyNickInput = document.getElementById('lobby-nick-input');
    this.btnCreateLobbyRoom = document.getElementById('btn-create-lobby-room');
    this.lobbyJoinCodeInput = document.getElementById('lobby-join-code-input');
    this.btnJoinLobbyRoom = document.getElementById('btn-join-lobby-room');
    this.lobbyStatusError = document.getElementById('lobby-status-error');
    this.lobbyRoomLive = document.getElementById('lobby-room-live');
    this.lobbyCodeVal = document.getElementById('lobby-code-val');
    this.lobbyBossVal = document.getElementById('lobby-boss-val');
    this.lobbyTrioGrid = document.getElementById('lobby-trio-grid');
    this.btnLobbyChangeChar = document.getElementById('btn-lobby-change-char');
    this.btnLobbyToggleReady = document.getElementById('btn-lobby-toggle-ready');
    this.btnLobbyStartBattle = document.getElementById('btn-lobby-start-battle');
    this.btnLobbyLeave = document.getElementById('btn-lobby-leave');

    // Tela de Preparação / Versus
    this.versusPlayerCanvas = document.getElementById('versus-player-canvas');
    this.versusPlayerName = document.getElementById('versus-player-name');
    this.versusPlayerSubtag = document.getElementById('versus-player-subtag');
    this.vsStageName = document.getElementById('vs-stage-name');
    this.versusBossCanvas = document.getElementById('versus-boss-canvas');
    this.versusBossName = document.getElementById('versus-boss-name');
    this.versusBossSubtag = document.getElementById('versus-boss-subtag');
    this.btnStartArenaNow = document.getElementById('btn-start-arena-now');

    // Controles de Teste de Animação e Stats
    this.heroPreviewMode = 'idle'; // 'idle' | 'attack' | 'ability'
    this.btnPreviewIdle = document.getElementById('btn-preview-idle');
    this.btnPreviewAttack = document.getElementById('btn-preview-attack');
    this.btnPreviewAbility = document.getElementById('btn-preview-ability');
    this.heroStatSpeed = document.getElementById('hero-stat-speed');
    this.heroStatJump = document.getElementById('hero-stat-jump');
    this.heroStatCooldown = document.getElementById('hero-stat-cooldown');

    // Telas de Apoio
    this.btnCloseControls = document.getElementById('btn-close-controls');
    this.optScreenShake = document.getElementById('opt-screen-shake');
    this.optShowHitboxes = document.getElementById('opt-show-hitboxes');
    this.btnResumeGame = document.getElementById('btn-resume-game');
    this.btnRestartGame = document.getElementById('btn-restart-game');

    // Sistemas & Estado
    this.renderer = new SpriteRenderer();
    this.multiplayer = new MultiplayerSystem();
    this.selectedCharId = 'di5';
    this.selectedStageIndex = 0;
    this.currentMode = 'solo'; // 'solo' | 'coop' | 'campaign'
    this.activeScreenId = 'screen-title';
    this.previousScreenId = 'screen-title';

    this.onStartGameCallback = null;
    this.onResumeCallback = null;
    this.onRestartCallback = null;

    // Loop de Animação de Prévia
    this.animTimer = 0;
    this.animRaf = null;
    this._animationLoop = this._animationLoop.bind(this);
  }

  init({ onStartGame, onResume, onRestart }) {
    this.onStartGameCallback = onStartGame;
    this.onResumeCallback = onResume;
    this.onRestartCallback = onRestart;

    // Inicializa os sub-componentes visuais
    this._initTitleScreen();
    this._initCharSelectScreen();
    this._initCampaignScreen();
    this._initLobbyScreen();
    this._initVersusScreen();
    this._initOptionsAndControls();
    this._initKeyboardShortcuts();

    // Inicia na Tela de Título com animação
    this.showScreen('screen-title');
    this._startAnimation();
  }

  // =========================================================================
  // GERENCIAMENTO CENTRAL DE TELAS
  // =========================================================================

  showScreen(screenId) {
    const screens = [
      this.screenTitle,
      this.screenCharSelect,
      this.screenCampaignSelect,
      this.screenLobby,
      this.screenVersus,
      this.screenControls,
      this.screenPause,
      this.screenResults
    ];

    screens.forEach(screen => {
      if (screen) screen.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.previousScreenId = this.activeScreenId !== screenId ? this.activeScreenId : this.previousScreenId;
      this.activeScreenId = screenId;
    }

    // Ações de entrada para telas específicas
    if (screenId === 'screen-char-select') {
      this._updateHeroFighterStage(CHARACTERS_CONFIG[this.selectedCharId] || CHARACTERS_CONFIG.di5);
      if (this.charSelectModeTag) {
        this.charSelectModeTag.textContent = this.currentMode === 'coop' ? 'CO-OP ONLINE' : 'MODO SOLO';
      }
    } else if (screenId === 'screen-campaign-select') {
      this._renderCampaignCards();
    } else if (screenId === 'screen-versus') {
      this._setupVersusFaceoff();
    }

    // Garante que o loop de renderização de prévia continue rodando se uma tela modal estiver ativa
    if (this._isAnyModalActive()) {
      this._startAnimation();
    }
  }

  hideAllScreens() {
    const screens = [
      this.screenTitle,
      this.screenCharSelect,
      this.screenCampaignSelect,
      this.screenLobby,
      this.screenVersus,
      this.screenControls,
      this.screenPause,
      this.screenResults
    ];
    screens.forEach(s => s && s.classList.remove('active'));
    this.activeScreenId = null;
    this._stopAnimation();
  }

  showMenu() {
    this.showScreen('screen-title');
  }

  hideMenu() {
    this.hideAllScreens();
  }

  showPause() {
    if (this.screenPause) this.screenPause.classList.add('active');
  }

  hidePause() {
    if (this.screenPause) this.screenPause.classList.remove('active');
  }

  _isAnyModalActive() {
    return [
      this.screenTitle,
      this.screenCharSelect,
      this.screenCampaignSelect,
      this.screenLobby,
      this.screenVersus,
      this.screenControls
    ].some(s => s && s.classList.contains('active'));
  }

  // =========================================================================
  // 1. TELA DE TÍTULO
  // =========================================================================

  _initTitleScreen() {
    if (this.btnModeSolo) {
      this.btnModeSolo.onclick = () => {
        this.currentMode = 'solo';
        this.showScreen('screen-char-select');
      };
    }

    if (this.btnModeCoop) {
      this.btnModeCoop.onclick = () => {
        this.currentMode = 'coop';
        this.showScreen('screen-lobby');
      };
    }

    if (this.btnModeCampaign) {
      this.btnModeCampaign.onclick = () => {
        this.currentMode = 'campaign';
        this.showScreen('screen-campaign-select');
      };
    }

    if (this.btnModeControls) {
      this.btnModeControls.onclick = () => {
        this.showScreen('controls-screen');
      };
    }
  }

  // =========================================================================
  // 2. SELEÇÃO DE PERSONAGENS (PALCO DO HERÓI + ROSTER AMPLO)
  // =========================================================================

  _initCharSelectScreen() {
    this._renderCharacterRoster();

    // Controles de Modo de Prévia (Parado, Golpe, Habilidade)
    const previewBtns = [this.btnPreviewIdle, this.btnPreviewAttack, this.btnPreviewAbility];
    previewBtns.forEach(btn => {
      if (!btn) return;
      btn.onclick = (e) => {
        e.stopPropagation();
        previewBtns.forEach(b => b && b.classList.remove('active'));
        btn.classList.add('active');
        this.heroPreviewMode = btn.dataset.mode || 'idle';
      };
    });

    if (this.btnCharSelectBack) {
      this.btnCharSelectBack.onclick = () => {
        if (this.currentMode === 'coop') {
          this.showScreen('screen-lobby');
        } else {
          this.showScreen('screen-title');
        }
      };
    }

    if (this.btnCharSelectConfirm) {
      this.btnCharSelectConfirm.onclick = () => {
        if (this.currentMode === 'coop') {
          if (this.multiplayer.isConnected) {
            this.multiplayer.setCharacter(this.selectedCharId);
          }
          this.showScreen('screen-lobby');
        } else if (this.currentMode === 'campaign') {
          this.showScreen('screen-versus');
        } else {
          // Modo Solo padrão -> Avança para escolha de chefão
          this.showScreen('screen-campaign-select');
        }
      };
    }
  }

  _renderCharacterRoster() {
    if (!this.charRosterGrid) return;
    this.charRosterGrid.innerHTML = '';

    Object.values(CHARACTERS_CONFIG).forEach(char => {
      const card = document.createElement('div');
      card.className = `char-card ${char.id === this.selectedCharId ? 'selected' : ''}`;
      card.dataset.charId = char.id;

      // Retrato fiel em Pixel Art 16-bits
      const portraitCanvas = document.createElement('canvas');
      portraitCanvas.width = 38;
      portraitCanvas.height = 38;
      portraitCanvas.className = 'char-portrait-canvas';
      const pctx = portraitCanvas.getContext('2d');
      this.renderer.prepareContext(pctx);
      this.renderer.drawCharacterPortrait(pctx, char.id, 0, 0, 38);

      const nameLabel = document.createElement('div');
      nameLabel.className = 'char-card-name';
      nameLabel.textContent = char.name;

      card.appendChild(portraitCanvas);
      card.appendChild(nameLabel);

      const onSelect = () => {
        this.selectedCharId = char.id;
        document.querySelectorAll('.char-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this._updateHeroFighterStage(char);

        // Se conectado ao servidor, sincroniza escolha imediatamente com os amigos
        if (this.multiplayer.isConnected) {
          this.multiplayer.setCharacter(char.id);
        }
      };

      card.onmouseenter = onSelect;
      card.onclick = onSelect;

      this.charRosterGrid.appendChild(card);
    });
  }

  _updateHeroStats(char) {
    if (!char) return;
    // Pips de velocidade (280 - 350 -> 1 a 5 pips)
    const speedScore = Math.min(5, Math.max(1, Math.round((char.speed - 260) / 18)));
    if (this.heroStatSpeed) {
      this.heroStatSpeed.innerHTML = Array.from({ length: 5 }, (_, i) => 
        `<span class="pip ${i < speedScore ? 'active' : ''}"></span>`
      ).join('');
    }

    // Pips de força de salto (560 - 640 -> 1 a 5 pips)
    const jumpScore = Math.min(5, Math.max(1, Math.round((char.jumpForce - 520) / 24)));
    if (this.heroStatJump) {
      this.heroStatJump.innerHTML = Array.from({ length: 5 }, (_, i) => 
        `<span class="pip ${i < jumpScore ? 'active' : ''}"></span>`
      ).join('');
    }

    if (this.heroStatCooldown) {
      this.heroStatCooldown.textContent = `${char.cooldownSec}s`;
    }
  }

  _updateHeroFighterStage(char) {
    if (!char) return;
    if (this.heroCharName) this.heroCharName.textContent = char.name.toUpperCase();
    if (this.heroCharStyle) this.heroCharStyle.textContent = FIGHTER_STYLES[char.id] || 'LUTADOR ARCADE';
    if (this.heroAbilityName) this.heroAbilityName.textContent = char.abilityName;
    if (this.heroAbilityCooldown) this.heroAbilityCooldown.textContent = `${char.cooldownSec}s`;
    if (this.heroAbilityDesc) this.heroAbilityDesc.textContent = char.desc;
    if (this.heroBasicName) {
      this.heroBasicName.textContent = char.basicAttack ? char.basicAttack.name : 'Soco de Impacto';
    }

    this._updateHeroStats(char);

    // Sincroniza o jogador no canvas da arena se a engine estiver pausada/em espera
    if (window.__BOSS_MODE_GAME__ && !window.__BOSS_MODE_GAME__.isRunning) {
      window.__BOSS_MODE_GAME__.selectedCharId = char.id;
      window.__BOSS_MODE_GAME__.selectedChar = char;
      window.__BOSS_MODE_GAME__.player.reset(char.id);
      window.__BOSS_MODE_GAME__.render(window.__BOSS_MODE_GAME__.ctx);
    }
  }

  // =========================================================================
  // 3. SELEÇÃO DE CAMPANHA (3 CHEFÕES PROGRESSIVOS)
  // =========================================================================

  _initCampaignScreen() {
    this._renderCampaignCards();

    if (this.btnCampaignBack) {
      this.btnCampaignBack.onclick = () => {
        this.showScreen(this.previousScreenId || 'screen-char-select');
      };
    }

    if (this.btnCampaignConfirm) {
      this.btnCampaignConfirm.onclick = () => {
        this.showScreen('screen-versus');
      };
    }
  }

  _renderCampaignCards() {
    if (!this.campaignCardsContainer) return;
    this.campaignCardsContainer.innerHTML = '';

    const bossesInfo = [
      {
        index: 0,
        bossId: 'sindico',
        name: 'O Síndico do Pq. Columbia',
        difficulty: 'Fácil • Tutorial',
        diffClass: 'easy',
        desc: 'Patrulha a arena atirando notificações, ondas de choque no chão e multas surpresa.',
        status: 'DISPONÍVEL',
        statusColor: '#00ff88'
      },
      {
        index: 1,
        bossId: 'bandido',
        name: 'O Bandido do Beco',
        difficulty: 'Médio • Desafio 2',
        diffClass: 'med',
        desc: 'Agressivo, rápido e imprevisível. Alterna investidas relâmpago e arremesso de objetos.',
        status: 'PRÓXIMO DESAFIO',
        statusColor: '#facc15'
      },
      {
        index: 2,
        bossId: 'chefao_trafico',
        name: 'O Chefão do Tráfico',
        difficulty: 'Difícil • Chefe Final',
        diffClass: 'hard',
        desc: 'Dono da cobertura. Invoca ondas de capangas, tiros de alto calibre e bloqueio de arena.',
        status: 'DESAFIO FINAL',
        statusColor: '#ff0055'
      }
    ];

    bossesInfo.forEach(info => {
      const card = document.createElement('div');
      card.className = `boss-campaign-card ${this.selectedStageIndex === info.index ? 'selected' : ''}`;
      card.dataset.stageIndex = info.index;

      const badge = document.createElement('div');
      badge.className = `boss-campaign-badge ${info.diffClass}`;
      badge.textContent = info.difficulty;

      const canvas = document.createElement('canvas');
      canvas.width = 120;
      canvas.height = 130;
      canvas.className = 'boss-card-canvas';
      canvas.dataset.bossId = info.bossId;

      const title = document.createElement('div');
      title.className = 'boss-card-title';
      title.textContent = info.name;

      const desc = document.createElement('div');
      desc.className = 'boss-card-desc';
      desc.textContent = info.desc;

      const status = document.createElement('div');
      status.className = 'boss-card-status';
      status.style.color = info.statusColor;
      status.style.border = `1px solid ${info.statusColor}`;
      status.style.background = 'rgba(0, 0, 0, 0.4)';
      status.textContent = info.status;

      card.appendChild(badge);
      card.appendChild(canvas);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(status);

      card.onclick = () => {
        this.selectedStageIndex = info.index;
        document.querySelectorAll('.boss-campaign-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      };

      this.campaignCardsContainer.appendChild(card);
    });
  }

  // =========================================================================
  // 4. LOBBY ONLINE COOPERATIVO (ATÉ 3 JOGADORES REAIS)
  // =========================================================================

  _initLobbyScreen() {
    // Sincronização em tempo real quando a sala recebe atualização do servidor
    this.multiplayer.onRoomUpdate = (room) => {
      this._renderLobbySlots(room);
    };

    // Callback disparado quando o anfitrião dá início à batalha para todos
    this.multiplayer.onMatchStart = (room) => {
      this._setupVersusFaceoff();
      this.showScreen('screen-versus');
    };

    // Voltar para o menu principal
    if (this.btnLobbyBackMenu) {
      this.btnLobbyBackMenu.onclick = () => {
        if (this.multiplayer.isConnected) {
          this.multiplayer.leave();
          this._resetLobbyView();
        }
        this.showScreen('screen-title');
      };
    }

    // Criar Nova Sala
    if (this.btnCreateLobbyRoom) {
      this.btnCreateLobbyRoom.onclick = async () => {
        const playerName = this.lobbyNickInput?.value?.trim() || 'Jogador 1';
        this._showLobbyError(null);
        try {
          const res = await this.multiplayer.createRoom(playerName, this.selectedCharId);
          this._showActiveRoomView(res.roomId, res.room);
        } catch (err) {
          this._showLobbyError(err.message || 'Erro ao conectar ao servidor de lobby.');
        }
      };
    }

    // Entrar com Código
    if (this.btnJoinLobbyRoom) {
      this.btnJoinLobbyRoom.onclick = async () => {
        const playerName = this.lobbyNickInput?.value?.trim() || 'Jogador';
        const code = this.lobbyJoinCodeInput?.value?.trim();
        if (!code || code.length < 3) {
          return this._showLobbyError('Insira o código de 4 caracteres da sala.');
        }
        this._showLobbyError(null);
        try {
          const res = await this.multiplayer.joinRoom(code, playerName, this.selectedCharId);
          this._showActiveRoomView(res.roomId, res.room);
        } catch (err) {
          this._showLobbyError(err.message || 'Erro ao entrar na sala. Verifique o código.');
        }
      };
    }

    // Copiar Código de Convite
    if (this.btnLobbyCopyCodeTop) {
      this.btnLobbyCopyCodeTop.onclick = () => {
        if (this.multiplayer.roomId) {
          navigator.clipboard?.writeText(this.multiplayer.roomId);
          this.btnLobbyCopyCodeTop.textContent = 'COPIADO!';
          setTimeout(() => {
            if (this.btnLobbyCopyCodeTop) this.btnLobbyCopyCodeTop.textContent = '📋 COPIAR CONVITE';
          }, 1800);
        }
      };
    }

    // Trocar de Personagem (leva à tela de seleção de combatentes)
    if (this.btnLobbyChangeChar) {
      this.btnLobbyChangeChar.onclick = () => {
        this.currentMode = 'coop';
        this.showScreen('screen-char-select');
      };
    }

    // Ficar Pronto / Cancelar
    if (this.btnLobbyToggleReady) {
      this.btnLobbyToggleReady.onclick = async () => {
        const newReadyState = !this.multiplayer.isReady;
        await this.multiplayer.setReady(newReadyState);
        this.btnLobbyToggleReady.textContent = newReadyState ? 'CANCELAR PRONTIDÃO' : 'ESTOU PRONTO';
        this.btnLobbyToggleReady.classList.toggle('btn-secondary', newReadyState);
      };
    }

    // Iniciar Batalha (Anfitrião)
    if (this.btnLobbyStartBattle) {
      this.btnLobbyStartBattle.onclick = async () => {
        try {
          await this.multiplayer.startMatch();
        } catch (err) {
          this._showLobbyError(err.message || 'Não foi possível iniciar a batalha.');
        }
      };
    }

    // Sair da Sala
    if (this.btnLobbyLeave) {
      this.btnLobbyLeave.onclick = async () => {
        await this.multiplayer.leave();
        this._resetLobbyView();
      };
    }
  }

  _showActiveRoomView(roomId, room) {
    if (this.lobbyAuthPanel) this.lobbyAuthPanel.style.display = 'none';
    if (this.lobbyRoomLive) this.lobbyRoomLive.style.display = 'flex';
    if (this.btnLobbyCopyCodeTop) this.btnLobbyCopyCodeTop.style.display = 'inline-block';
    if (this.lobbyRoomCodeTag) this.lobbyRoomCodeTag.textContent = `CÓDIGO: ${roomId}`;
    if (this.lobbyCodeVal) this.lobbyCodeVal.textContent = roomId;
    this._renderLobbySlots(room);
  }

  _resetLobbyView() {
    if (this.lobbyAuthPanel) this.lobbyAuthPanel.style.display = 'flex';
    if (this.lobbyRoomLive) this.lobbyRoomLive.style.display = 'none';
    if (this.btnLobbyCopyCodeTop) this.btnLobbyCopyCodeTop.style.display = 'none';
    if (this.lobbyRoomCodeTag) this.lobbyRoomCodeTag.textContent = 'CÓDIGO: ----';
    this._showLobbyError(null);
  }

  _showLobbyError(msg) {
    if (!this.lobbyStatusError) return;
    if (msg) {
      this.lobbyStatusError.textContent = msg;
      this.lobbyStatusError.style.display = 'block';
    } else {
      this.lobbyStatusError.style.display = 'none';
    }
  }

  _renderLobbySlots(room) {
    if (!this.lobbyTrioGrid || !room) return;
    this.lobbyTrioGrid.innerHTML = '';

    const players = room.players || [];
    const isHost = this.multiplayer.isHost;

    // Renderiza exatamente 3 slots de jogadores (limite oficial cooperativo)
    for (let slotIdx = 0; slotIdx < 3; slotIdx++) {
      const p = players.find(x => x.slot === slotIdx);
      const card = document.createElement('div');

      if (p) {
        card.className = 'lobby-slot-card';

        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 105;
        canvas.className = 'lobby-slot-avatar';
        canvas.dataset.charId = p.charId;

        const nameEl = document.createElement('div');
        nameEl.className = 'lobby-slot-name';
        nameEl.textContent = p.name;
        if (p.isHost) {
          const crown = document.createElement('span');
          crown.className = 'host-crown';
          crown.textContent = ' 👑';
          crown.title = 'Anfitrião da Sala';
          nameEl.appendChild(crown);
        }

        const badge = document.createElement('div');
        badge.className = `lobby-slot-badge ${p.isReady ? 'ready' : 'waiting'}`;
        badge.textContent = p.isReady ? 'PRONTO' : 'ESCOLHENDO...';

        card.appendChild(canvas);
        card.appendChild(nameEl);

        if (p.id === this.multiplayer.playerId) {
          const youTag = document.createElement('div');
          youTag.className = 'you-tag';
          youTag.textContent = 'SEU COMBATENTE';
          card.appendChild(youTag);
        }

        card.appendChild(badge);
      } else {
        card.className = 'lobby-slot-card empty';
        card.innerHTML = `
          <div style="font-size: 24px; opacity: 0.4;">👥</div>
          <div style="font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px;">
            VAGA ${slotIdx + 1}<br>AGUARDANDO AMIGO...
          </div>
        `;
      }

      this.lobbyTrioGrid.appendChild(card);
    }

    // Exibe botão de iniciar para o anfitrião apenas se todos estiverem prontos
    if (this.btnLobbyStartBattle) {
      if (isHost) {
        this.btnLobbyStartBattle.style.display = 'inline-block';
        const allReady = players.length > 0 && players.every(p => p.isReady);
        this.btnLobbyStartBattle.disabled = !allReady;
        this.btnLobbyStartBattle.style.opacity = allReady ? '1' : '0.6';
      } else {
        this.btnLobbyStartBattle.style.display = 'none';
      }
    }
  }

  // =========================================================================
  // 5. TELA DE PREPARAÇÃO / VERSUS (FACEOFF CLÁSSICO DE ARCADE)
  // =========================================================================

  _initVersusScreen() {
    if (this.btnStartArenaNow) {
      this.btnStartArenaNow.onclick = () => {
        this._startArenaBattle();
      };
    }
  }

  _setupVersusFaceoff() {
    const char = CHARACTERS_CONFIG[this.selectedCharId] || CHARACTERS_CONFIG.di5;
    const stage = CAMPAIGN_STAGES[this.selectedStageIndex] || CAMPAIGN_STAGES[0];
    const bossConfig = BOSSES_CONFIG[stage.bossId] || BOSSES_CONFIG.sindico;

    if (this.versusPlayerName) this.versusPlayerName.textContent = char.name.toUpperCase();
    if (this.versusPlayerSubtag) this.versusPlayerSubtag.textContent = char.abilityName.toUpperCase();

    if (this.versusBossName) this.versusBossName.textContent = bossConfig.NAME.toUpperCase();
    if (this.versusBossSubtag) this.versusBossSubtag.textContent = bossConfig.DIFFICULTY.toUpperCase();

    if (this.vsStageName) {
      this.vsStageName.textContent = stage.arenaTheme ? stage.arenaTheme.replace('_', ' ').toUpperCase() : 'ARENA DE COMBATE';
    }
  }

  _startArenaBattle() {
    this.hideAllScreens();
    const isMultiplayer = Boolean(this.multiplayer && this.multiplayer.isConnected);
    if (this.onStartGameCallback) {
      this.onStartGameCallback(this.selectedCharId, isMultiplayer, this.selectedStageIndex);
    }
  }

  // =========================================================================
  // CONTROLES, OPÇÕES E ATALHOS
  // =========================================================================

  _initOptionsAndControls() {
    if (this.btnCloseControls) {
      this.btnCloseControls.onclick = () => {
        this.showScreen(this.previousScreenId || 'screen-title');
      };
    }

    if (this.optScreenShake) {
      this.optScreenShake.onchange = (e) => {
        if (window.__BOSS_MODE_GAME__) {
          window.__BOSS_MODE_GAME__.toggleScreenShake(e.target.checked);
        }
      };
    }

    if (this.optShowHitboxes) {
      this.optShowHitboxes.onchange = (e) => {
        if (window.__BOSS_MODE_GAME__) {
          window.__BOSS_MODE_GAME__.showHitboxes = e.target.checked;
        }
      };
    }

    if (this.btnResumeGame) {
      this.btnResumeGame.onclick = () => {
        this.hidePause();
        if (this.onResumeCallback) this.onResumeCallback();
      };
    }

    if (this.btnRestartGame) {
      this.btnRestartGame.onclick = () => {
        this.hidePause();
        if (this.onRestartCallback) this.onRestartCallback();
      };
    }
  }

  _initKeyboardShortcuts() {
    const charIds = Object.keys(CHARACTERS_CONFIG);

    window.addEventListener('keydown', (e) => {
      // Navegação por Teclado na Grade de Personagens (Arcade Style!)
      if (this.activeScreenId === 'screen-char-select') {
        const curIdx = charIds.indexOf(this.selectedCharId);
        let nextIdx = curIdx;

        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          nextIdx = (curIdx + 1) % charIds.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          nextIdx = (curIdx - 1 + charIds.length) % charIds.length;
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          nextIdx = (curIdx + 4) % charIds.length;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          nextIdx = (curIdx - 4 + charIds.length) % charIds.length;
        } else if (e.key === '1') {
          if (this.btnPreviewIdle) this.btnPreviewIdle.click();
        } else if (e.key === '2' || e.key === 'j' || e.key === 'z') {
          if (this.btnPreviewAttack) this.btnPreviewAttack.click();
        } else if (e.key === '3' || e.key === 'k' || e.key === 'x') {
          if (this.btnPreviewAbility) this.btnPreviewAbility.click();
        }

        if (nextIdx !== curIdx) {
          const nextCharId = charIds[nextIdx];
          const card = document.querySelector(`.char-card[data-char-id="${nextCharId}"]`);
          if (card) card.click();
        }
      }

      // ENTER para ação padrão na tela atual
      if (e.key === 'Enter') {
        if (this.activeScreenId === 'screen-title') {
          if (this.btnModeSolo) this.btnModeSolo.click();
        } else if (this.activeScreenId === 'screen-char-select') {
          if (this.btnCharSelectConfirm) this.btnCharSelectConfirm.click();
        } else if (this.activeScreenId === 'screen-campaign-select') {
          if (this.btnCampaignConfirm) this.btnCampaignConfirm.click();
        } else if (this.activeScreenId === 'screen-versus') {
          if (this.btnStartArenaNow) this.btnStartArenaNow.click();
        }
      } else if (e.key === 'c' || e.key === 'C') {
        if (this.activeScreenId === 'screen-title') {
          this.showScreen('controls-screen');
        }
      } else if (e.key === 'Escape') {
        if (this.activeScreenId === 'controls-screen') {
          this.showScreen(this.previousScreenId || 'screen-title');
        } else if (this.activeScreenId === 'screen-campaign-select') {
          this.showScreen('screen-char-select');
        } else if (this.activeScreenId === 'screen-char-select') {
          this.showScreen('screen-title');
        }
      }
    });
  }

  // =========================================================================
  // LOOP DE RENDERIZAÇÃO DE PRÉVIA & ANIMAÇÕES
  // =========================================================================

  _startAnimation() {
    if (this.animRaf) cancelAnimationFrame(this.animRaf);
    this.animRaf = requestAnimationFrame(this._animationLoop);
  }

  _stopAnimation() {
    if (this.animRaf) {
      cancelAnimationFrame(this.animRaf);
      this.animRaf = null;
    }
  }

  _animationLoop() {
    this.animTimer += 0.03;

    // 1. Renderiza o banner animado na Tela de Título
    if (this.activeScreenId === 'screen-title' && this.titleFightersCanvas) {
      this._renderTitleFightersBanner();
    }

    // 2. Renderiza o Herói Ampliado na Seleção de Personagens
    if (this.activeScreenId === 'screen-char-select' && this.fighterHeroCanvas) {
      this._renderHeroFighterCanvas();
    }

    // 3. Renderiza os Chefões na Seleção de Campanha
    if (this.activeScreenId === 'screen-campaign-select') {
      this._renderCampaignBossPreviews();
    }

    // 4. Renderiza Avatares Animados no Lobby
    if (this.activeScreenId === 'screen-lobby') {
      this._renderLobbyAvatars();
    }

    // 5. Renderiza Lutadores na Tela Versus
    if (this.activeScreenId === 'screen-versus') {
      this._renderVersusFighters();
    }

    if (this._isAnyModalActive()) {
      this.animRaf = requestAnimationFrame(this._animationLoop);
    }
  }

  _renderTitleFightersBanner() {
    const ctx = this.titleFightersCanvas.getContext('2d');
    const w = this.titleFightersCanvas.width;
    const h = this.titleFightersCanvas.height;
    ctx.clearRect(0, 0, w, h);
    this.renderer.prepareContext(ctx);

    // 1. Céu Urbano Noturno em Gradiente
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#060212');
    sky.addColorStop(0.65, '#12082b');
    sky.addColorStop(1, '#230b42');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Estrelas cintilantes nítidas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 28; i++) {
      const sx = (i * 47 + Math.sin(i * 31) * 20) % w;
      const sy = (i * 17 + Math.cos(i * 19) * 10) % 45;
      const alpha = 0.4 + Math.sin(this.animTimer * 2 + i) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(Math.round(sx), Math.round(sy), 2, 2);
    }

    // 2. Silhueta de Prédios Noturnos com Janelas Iluminadas
    const buildings = [
      { x: 10, w: 70, h: 65, color: '#0d0620' },
      { x: 85, w: 90, h: 85, color: '#140a2c' },
      { x: 180, w: 60, h: 55, color: '#0f0724' },
      { x: 245, w: 110, h: 95, color: '#160b33' },
      { x: 360, w: 80, h: 70, color: '#110729' },
      { x: 445, w: 95, h: 90, color: '#170c36' },
      { x: 545, w: 85, h: 60, color: '#0e0622' }
    ];

    buildings.forEach((b, bIdx) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, h - b.h, b.w, b.h);

      // Janelas pixeladas iluminadas
      const rows = Math.floor((b.h - 20) / 12);
      const cols = Math.floor((b.w - 14) / 12);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isLit = (bIdx * 7 + r * 3 + c * 5) % 3 !== 0;
          if (isLit) {
            ctx.fillStyle = (r + c + bIdx) % 2 === 0 ? '#facc15' : '#00f3ff';
            ctx.fillRect(b.x + 8 + c * 12, h - b.h + 8 + r * 12, 5, 6);
          }
        }
      }
    });

    // 3. Placas Neon Pixel Art no Topo dos Prédios
    // Neon "PARQUE COLUMBIA"
    ctx.fillStyle = 'rgba(0, 243, 255, 0.15)';
    ctx.fillRect(95, h - 82, 70, 14);
    ctx.strokeStyle = '#00f3ff';
    ctx.strokeRect(95, h - 82, 70, 14);
    ctx.fillStyle = '#00f3ff';
    ctx.font = '8px monospace';
    ctx.fillText('COLUMBIA', 104, h - 72);

    // Neon "ARCADE 24H"
    ctx.fillStyle = 'rgba(255, 0, 127, 0.15)';
    ctx.fillRect(265, h - 92, 70, 14);
    ctx.strokeStyle = '#ff007f';
    ctx.strokeRect(265, h - 92, 70, 14);
    ctx.fillStyle = '#ff007f';
    ctx.fillText('ARCADE 24H', 272, h - 82);

    // 4. Poste de Luz com Cone de Iluminação
    [175, 435].forEach(postX => {
      // Cone de luz suave na calçada
      const lightGrad = ctx.createRadialGradient(postX, h - 60, 4, postX, h - 10, 45);
      lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
      lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(postX - 5, h - 60);
      ctx.lineTo(postX + 40, h - 10);
      ctx.lineTo(postX - 40, h - 10);
      ctx.closePath();
      ctx.fill();

      // Haste e cúpula
      ctx.fillStyle = '#334155';
      ctx.fillRect(postX - 1, h - 65, 3, 50);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(postX - 4, h - 68, 9, 4);
    });

    // 5. Calçada / Pista Asfáltica com Faixa Neon
    const roadY = h - 20;
    ctx.fillStyle = '#0a0518';
    ctx.fillRect(0, roadY, w, 20);

    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, roadY);
    ctx.lineTo(w, roadY);
    ctx.stroke();

    // Faixas da calçada
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let x = 0; x < w; x += 36) {
      ctx.fillRect(x, roadY + 8, 18, 3);
    }

    // 6. Elenco Principal Marchando em Poses Expressivas
    const bannerRoster = ['di5', 'wendel', 'muniz', 'nalu', 'vitor_sonic', 'joao', 'douglas'];
    const spacing = w / (bannerRoster.length + 1);

    bannerRoster.forEach((charId, idx) => {
      const x = spacing * (idx + 1) - 22;
      const bob = Math.sin(this.animTimer * 4 + idx * 0.9) * 2;
      const y = roadY - 58 + bob;

      // Sombra pixel art projetada no chão
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x + 18, roadY + 3, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.85, 0.85);

      const mock = {
        x: 0,
        y: 0,
        width: 44,
        height: 76,
        charId: charId,
        facingRight: idx < 4,
        state: 'idle',
        isInvulnerable: false,
        isCrouching: false,
        abilityActive: false,
        shieldActive: charId === 'di5'
      };

      this.renderer.drawPlayer(ctx, mock, this.animTimer + idx * 0.4);
      ctx.restore();
    });
  }

  _renderHeroFighterCanvas() {
    const ctx = this.fighterHeroCanvas.getContext('2d');
    const w = this.fighterHeroCanvas.width;
    const h = this.fighterHeroCanvas.height;
    ctx.clearRect(0, 0, w, h);
    this.renderer.prepareContext(ctx);

    const char = CHARACTERS_CONFIG[this.selectedCharId] || CHARACTERS_CONFIG.di5;
    const sigColor = char.color || '#00f3ff';

    // 1. Holofote Circular Arcade com Anéis Concêntricos no Chão
    const groundY = h - 24;
    const ringRadius = 75;

    // Resplendor radial no chão na cor característica do personagem
    const podiumGrad = ctx.createRadialGradient(w / 2, groundY, 10, w / 2, groundY, ringRadius + 20);
    podiumGrad.addColorStop(0, `${sigColor}55`);
    podiumGrad.addColorStop(0.5, `${sigColor}22`);
    podiumGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = podiumGrad;
    ctx.beginPath();
    ctx.ellipse(w / 2, groundY, ringRadius + 15, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Anel externo com traço neon
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(w / 2, groundY, ringRadius, 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Anel interno sutil
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(w / 2, groundY, ringRadius * 0.6, 9, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Sombra do herói no chão
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.beginPath();
    ctx.ellipse(w / 2, groundY + 1, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Renderiza o Herói Ampliado (escala 2.6x com nitidez pixel art)
    ctx.save();
    ctx.translate(w / 2 - 58, groundY - 198);
    ctx.scale(2.6, 2.6);

    const isAttacking = this.heroPreviewMode === 'attack';
    const isAbility = this.heroPreviewMode === 'ability';

    const mockPlayer = {
      x: 0,
      y: 0,
      width: 44,
      height: 76,
      charId: this.selectedCharId,
      facingRight: true,
      state: isAttacking ? 'attacking' : 'idle',
      attackType: char.basicAttack ? char.basicAttack.type : 'punch',
      isInvulnerable: false,
      isCrouching: false,
      abilityActive: isAbility,
      shieldActive: isAbility && this.selectedCharId === 'di5'
    };

    this.renderer.drawPlayer(ctx, mockPlayer, this.animTimer);
    ctx.restore();

    // 3. Efeitos Visuais Adicionais para Golpes e Habilidade
    if (isAttacking) {
      // Efeito de impacto/fagulhas no ataque básico
      const sparkX = w / 2 + 58;
      const sparkY = groundY - 110 + Math.sin(this.animTimer * 12) * 8;
      ctx.fillStyle = '#ff0055';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(sparkX - 8, sparkY - 8, 16, 16);
    } else if (isAbility) {
      // Aura de poder pulsante na cor do personagem
      ctx.strokeStyle = sigColor;
      ctx.lineWidth = 1.5;
      const auraPulse = Math.sin(this.animTimer * 6) * 4;
      ctx.strokeRect(w / 2 - 45 - auraPulse, groundY - 195 - auraPulse, 90 + auraPulse * 2, 175 + auraPulse * 2);
    }
  }

  _renderCampaignBossPreviews() {
    const canvases = document.querySelectorAll('.boss-card-canvas');
    canvases.forEach(canvas => {
      const bossId = canvas.dataset.bossId;
      if (!bossId) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.renderer.prepareContext(ctx);

      ctx.save();
      ctx.translate(-26, -10);
      ctx.scale(0.68, 0.68);

      const mockBoss = {
        bossId: bossId,
        x: 60,
        y: 20,
        width: 140,
        height: 180,
        state: 'patrulha',
        currentAttack: 'chave_inglesa',
        isHurt: false,
        isEnraged: false,
        phase: 'PHASE_1'
      };

      this.renderer.drawBoss(ctx, mockBoss, this.animTimer);
      ctx.restore();
    });
  }

  _renderLobbyAvatars() {
    const canvases = document.querySelectorAll('.lobby-slot-avatar');
    canvases.forEach(canvas => {
      const charId = canvas.dataset.charId;
      if (!charId) return;
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      this.renderer.prepareContext(ctx);

      const char = CHARACTERS_CONFIG[charId] || CHARACTERS_CONFIG.di5;
      const sigColor = char.color || '#00f3ff';

      // Pedestal neon no chão do avatar
      const groundY = h - 14;
      ctx.fillStyle = `${sigColor}33`;
      ctx.beginPath();
      ctx.ellipse(w / 2, groundY, 34, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = sigColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(w / 2 - 28, groundY - 86);
      ctx.scale(1.25, 1.25);

      const mockPlayer = {
        x: 0,
        y: 0,
        width: 44,
        height: 76,
        charId: charId,
        facingRight: true,
        state: 'idle',
        isInvulnerable: false,
        isCrouching: false,
        abilityActive: false,
        shieldActive: charId === 'di5'
      };

      this.renderer.drawPlayer(ctx, mockPlayer, this.animTimer);
      ctx.restore();
    });
  }

  _renderVersusFighters() {
    // 1. Jogador à Esquerda
    if (this.versusPlayerCanvas) {
      const pctx = this.versusPlayerCanvas.getContext('2d');
      pctx.clearRect(0, 0, 180, 220);
      this.renderer.prepareContext(pctx);

      pctx.save();
      pctx.translate(45, 30);
      pctx.scale(2.0, 2.0);

      const mockPlayer = {
        x: 0,
        y: 0,
        width: 44,
        height: 76,
        charId: this.selectedCharId,
        facingRight: true,
        state: 'idle',
        isInvulnerable: false,
        isCrouching: false,
        abilityActive: false,
        shieldActive: this.selectedCharId === 'di5'
      };

      this.renderer.drawPlayer(pctx, mockPlayer, this.animTimer);
      pctx.restore();
    }

    // 2. Chefão à Direita
    if (this.versusBossCanvas) {
      const bctx = this.versusBossCanvas.getContext('2d');
      bctx.clearRect(0, 0, 180, 220);
      this.renderer.prepareContext(bctx);

      const stage = CAMPAIGN_STAGES[this.selectedStageIndex] || CAMPAIGN_STAGES[0];
      const bossId = stage.bossId || 'sindico';

      bctx.save();
      bctx.translate(-15, 10);
      bctx.scale(0.85, 0.85);

      const mockBoss = {
        bossId: bossId,
        x: 60,
        y: 20,
        width: 140,
        height: 180,
        state: 'patrulha',
        currentAttack: 'chave_inglesa',
        isHurt: false,
        isEnraged: false,
        phase: 'PHASE_1'
      };

      this.renderer.drawBoss(bctx, mockBoss, this.animTimer);
      bctx.restore();
    }
  }
}
