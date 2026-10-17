/**
 * A Grande Família Game - Modo Chefão
 * Arquivo Central de Configurações e Balanceamento
 */

export const CANVAS_CONFIG = {
  WIDTH: 960,
  HEIGHT: 540,
  GROUND_Y: 460, // Nível do chão da arena
  GRAVITY: 1200, // Pixels por segundo ao quadrado
  CEILING_Y: 20
};

export const GAME_RULES = {
  BATTLE_TIME_LIMIT_SEC: 180, // 3 minutos em segundos reais
  PLAYER_START_LIVES: 3,
  INVULNERABILITY_DURATION_SEC: 1.5, // Pós-dano
  VULNERABILITY_WINDOW_DEFAULT_SEC: 2.0,
  MAX_DELTA_TIME_SEC: 0.1 // Previne saltos quando a aba fica inativa
};

export const BOSSES_CONFIG = {
  sindico: {
    ID: 'sindico',
    NAME: 'O Síndico do Parque Columbia',
    SUBTITLE: 'Terror das Reuniões de Condomínio',
    STAGE_TITLE: 'Fase 1: O Síndico do Parque Columbia',
    DIFFICULTY: 'Fácil • Tutorial',
    MAX_HP: 1000,
    WIDTH: 140,
    HEIGHT: 180,
    SPAWN_X: 740,
    SPAWN_Y: 280,
    WALK_SPEED: 90,
    RUN_SPEED: 140,
    PATROL_MIN_X: 480,
    PATROL_MAX_X: 820,
    PHASES: {
      PHASE_1: {
        THRESHOLD: 0.70,
        NAME: 'Fase 1: Notificação Amigável',
        ATTACK_COOLDOWN_SEC: 2.5,
        SPEED_MULTIPLIER: 1.0,
        COLOR: '#00f3ff'
      },
      PHASE_2: {
        THRESHOLD: 0.30,
        NAME: 'Fase 2: Assembleia Extraordinária',
        ATTACK_COOLDOWN_SEC: 1.8,
        SPEED_MULTIPLIER: 1.25,
        COLOR: '#ffbe0b'
      },
      PHASE_3: {
        THRESHOLD: 0.0,
        NAME: 'Fase 3: Execução de Penhora',
        ATTACK_COOLDOWN_SEC: 1.2,
        SPEED_MULTIPLIER: 1.5,
        COLOR: '#ff0055'
      }
    },
    ATTACKS: {
      CHAVE_INGLESA: {
        ID: 'chave_inglesa',
        NAME: 'Chave Inglesa Frontal',
        TELEGRAPH_SEC: 0.8,
        ACTIVE_SEC: 0.35,
        RECOVERY_SEC: 0.8,
        DAMAGE_LIVES: 1,
        RANGE_X: 200,
        HITBOX: { width: 180, height: 120 }
      },
      RECLAMACAO_CONDOMINIO: {
        ID: 'reclamacao_condominio',
        NAME: 'Reclamação do Condomínio (Onda Terrestre)',
        TELEGRAPH_SEC: 1.0,
        SHOCKWAVE_SPEED: 420,
        SHOCKWAVE_WIDTH: 50,
        SHOCKWAVE_HEIGHT: 70,
        DAMAGE_LIVES: 1,
        RECOVERY_SEC: 1.1
      },
      MULTA_SURPRESA: {
        ID: 'multa_surpresa',
        NAME: 'Multa Surpresa (Queda Aérea)',
        TELEGRAPH_SEC: 1.1,
        FALL_SPEED: 720,
        AREA_WIDTH: 110,
        AREA_HEIGHT: 130,
        DAMAGE_LIVES: 1,
        RECOVERY_SEC: 0.9
      }
    }
  },
  bandido: {
    ID: 'bandido',
    NAME: 'O Bandido',
    SUBTITLE: 'Assaltante Imprevisível dos Becos',
    STAGE_TITLE: 'Fase 2: O Bandido',
    DIFFICULTY: 'Médio',
    MAX_HP: 1300,
    WIDTH: 110,
    HEIGHT: 160,
    SPAWN_X: 740,
    SPAWN_Y: 300,
    WALK_SPEED: 160,
    RUN_SPEED: 260,
    PATROL_MIN_X: 380,
    PATROL_MAX_X: 840,
    PHASES: {
      PHASE_1: {
        THRESHOLD: 0.60,
        NAME: 'Fase 1: Encurralando a Vítima',
        ATTACK_COOLDOWN_SEC: 2.0,
        SPEED_MULTIPLIER: 1.0,
        COLOR: '#f97316'
      },
      PHASE_2: {
        THRESHOLD: 0.25,
        NAME: 'Fase 2: Fúria das Vielas',
        ATTACK_COOLDOWN_SEC: 1.4,
        SPEED_MULTIPLIER: 1.35,
        COLOR: '#ef4444'
      },
      PHASE_3: {
        THRESHOLD: 0.0,
        NAME: 'Fase 3: Cerco Desesperado',
        ATTACK_COOLDOWN_SEC: 0.95,
        SPEED_MULTIPLIER: 1.6,
        COLOR: '#ec4899'
      }
    },
    ATTACKS: {
      INVESTIDA_RELAMPAGO: {
        ID: 'investida_relampago',
        NAME: 'Investida Relâmpago',
        TELEGRAPH_SEC: 0.7,
        DASH_SPEED: 820,
        ACTIVE_SEC: 0.45,
        RECOVERY_SEC: 1.3, // Whiff window vulnerável para o jogador contra-atacar
        DAMAGE_LIVES: 1,
        HITBOX: { width: 120, height: 100 }
      },
      ARREMESSO_FACA: {
        ID: 'arremesso_faca',
        NAME: 'Arremesso de Navalha',
        TELEGRAPH_SEC: 0.6,
        PROJECTILE_SPEED: 620,
        DAMAGE_LIVES: 1,
        RECOVERY_SEC: 0.8
      },
      GOLPE_CORRENTE: {
        ID: 'golpe_corrente',
        NAME: 'Açoite de Corrente Pesada',
        TELEGRAPH_SEC: 0.65,
        RANGE_X: 240,
        ACTIVE_SEC: 0.3,
        RECOVERY_SEC: 0.9,
        DAMAGE_LIVES: 1,
        HITBOX: { width: 230, height: 90 }
      }
    }
  },
  chefao_trafico: {
    ID: 'chefao_trafico',
    NAME: 'O Chefão do Tráfico',
    SUBTITLE: 'O Dono do Morro e da Alta Cúpula',
    STAGE_TITLE: 'Fase 3: O Chefão do Tráfico (Final)',
    DIFFICULTY: 'Difícil • Chefe Final',
    MAX_HP: 1600,
    WIDTH: 130,
    HEIGHT: 185,
    SPAWN_X: 740,
    SPAWN_Y: 275,
    WALK_SPEED: 110,
    RUN_SPEED: 180,
    PATROL_MIN_X: 420,
    PATROL_MAX_X: 830,
    PHASES: {
      PHASE_1: {
        THRESHOLD: 0.65,
        NAME: 'Fase 1: Controle Territorial',
        ATTACK_COOLDOWN_SEC: 1.8,
        SPEED_MULTIPLIER: 1.0,
        COLOR: '#8b5cf6'
      },
      PHASE_2: {
        THRESHOLD: 0.30,
        NAME: 'Fase 2: Fogo Cruzado',
        ATTACK_COOLDOWN_SEC: 1.3,
        SPEED_MULTIPLIER: 1.3,
        COLOR: '#d946ef'
      },
      PHASE_3: {
        THRESHOLD: 0.0,
        NAME: 'Fase 3: Poder Absoluto',
        ATTACK_COOLDOWN_SEC: 0.85,
        SPEED_MULTIPLIER: 1.6,
        COLOR: '#ff0055'
      }
    },
    ATTACKS: {
      DOMINIO_ARENA: {
        ID: 'dominio_arena',
        NAME: 'Domínio da Arena (Zona Bloqueada)',
        TELEGRAPH_SEC: 1.0,
        ACTIVE_SEC: 2.2,
        RECOVERY_SEC: 0.8,
        ZONE_WIDTH: 360,
        DAMAGE_LIVES: 1
      },
      INVESTIDA_CAPANGAS: {
        ID: 'investida_capangas',
        NAME: 'Ordem de Investida dos Capangas',
        TELEGRAPH_SEC: 0.8,
        CAPANGA_SPEED: 550,
        RECOVERY_SEC: 1.0,
        DAMAGE_LIVES: 1
      },
      DISPARO_PESADO: {
        ID: 'disparo_pesado',
        NAME: 'Disparo de Calibre Pesado',
        TELEGRAPH_SEC: 0.7,
        PROJECTILE_SPEED: 800,
        RECOVERY_SEC: 0.7,
        DAMAGE_LIVES: 1
      }
    }
  }
};

// Aliases para retrocompatibilidade
export const BOSS_CONFIG = BOSSES_CONFIG.sindico;

export const CAMPAIGN_STAGES = [
  {
    id: 'stage_1',
    stageIndex: 0,
    bossId: 'sindico',
    title: 'Fase 1: O Síndico do Parque Columbia',
    difficulty: 'Fácil • Tutorial',
    arenaTheme: 'parque_columbia'
  },
  {
    id: 'stage_2',
    stageIndex: 1,
    bossId: 'bandido',
    title: 'Fase 2: O Bandido',
    difficulty: 'Médio',
    arenaTheme: 'beco_noturno'
  },
  {
    id: 'stage_3',
    stageIndex: 2,
    bossId: 'chefao_trafico',
    title: 'Fase 3: O Chefão do Tráfico',
    difficulty: 'Difícil • Chefe Final',
    arenaTheme: 'cobertura_qg'
  }
];

export const CHARACTERS_CONFIG = {
  di5: {
    id: 'di5',
    name: 'Di5',
    abilityName: 'Fumaça Blindada',
    desc: 'Escudo de fumaça que absorve um golpe letal e concede proteção temporária.',
    speed: 310,
    jumpForce: 580,
    cooldownSec: 18,
    durationSec: 4.0,
    color: '#a855f7',
    type: 'defense',
    basicAttack: {
      name: 'Soco Pesado',
      type: 'heavy_punch',
      damage: 25,
      range: 65,
      cooldown: 0.35,
      duration: 0.22,
      counterBonus: 25
    }
  },
  muniz: {
    id: 'muniz',
    name: 'Muniz',
    abilityName: 'Espírito do Vasco',
    desc: 'Invoca o espírito cruzmaltino que avança pela arena causando dano contundente ao chefão.',
    speed: 300,
    jumpForce: 590,
    cooldownSec: 12,
    durationSec: 2.5,
    damage: 120,
    color: '#f8fafc',
    type: 'summon',
    basicAttack: {
      name: 'Cruzado Esportivo',
      type: 'sport_strike',
      damage: 28,
      range: 58,
      cooldown: 0.30,
      duration: 0.20
    }
  },
  beatriz: {
    id: 'beatriz',
    name: 'Beatriz',
    abilityName: 'Rioqualit',
    desc: 'Libera a essência do Rioqualit que percorre o campo atingindo o chefão em janelas válidas.',
    speed: 315,
    jumpForce: 590,
    cooldownSec: 12,
    durationSec: 2.2,
    damage: 125,
    color: '#38bdf8',
    type: 'projectile',
    basicAttack: {
      name: 'Pulso Rioqualit',
      type: 'rioqualit_pulse',
      damage: 28,
      range: 72,
      cooldown: 0.30,
      duration: 0.20
    }
  },
  vitor_sonic: {
    id: 'vitor_sonic',
    name: 'Vitor (Modo Sonic)',
    abilityName: 'Spin Dash Supersônico',
    desc: 'Giro veloz que atropela o terreno com velocidade extrema, proteção breve e dano ao impacto.',
    speed: 340,
    jumpForce: 620,
    cooldownSec: 10,
    durationSec: 1.6,
    dashSpeed: 680,
    damage: 110,
    color: '#2563eb',
    type: 'mobility_offensive',
    basicAttack: {
      name: 'Giro Rasteiro',
      type: 'spin_kick',
      damage: 27,
      range: 64,
      cooldown: 0.25,
      duration: 0.16
    }
  },
  nalu: {
    id: 'nalu',
    name: 'Nalu',
    abilityName: 'Modo Loira Suprema',
    desc: 'Impulso glamouroso de agilidade e multiplicador de pontuação para jogadas perfeitas.',
    speed: 350,
    jumpForce: 600,
    cooldownSec: 14,
    durationSec: 5.0,
    scoreMultiplier: 1.5,
    color: '#facc15',
    type: 'buff',
    basicAttack: {
      name: 'Chute Estrelar',
      type: 'star_kick',
      damage: 26,
      range: 62,
      cooldown: 0.26,
      duration: 0.18
    }
  },
  joao: {
    id: 'joao',
    name: 'João',
    abilityName: 'Carrinho Turbo',
    desc: 'Avanço fulminante de kart que colide com o chefão causando dano massivo em janela segura.',
    speed: 305,
    jumpForce: 570,
    cooldownSec: 11,
    durationSec: 1.8,
    dashSpeed: 620,
    damage: 135,
    color: '#ef4444',
    type: 'mobility_offensive',
    basicAttack: {
      name: 'Chave de Roda',
      type: 'wrench_jab',
      damage: 30,
      range: 60,
      cooldown: 0.33,
      duration: 0.20
    }
  },
  julya: {
    id: 'julya',
    name: 'Julya',
    abilityName: 'Motinha da Julya',
    desc: 'Arrancada rápida em duas rodas para reposicionamento relâmpago e golpe de flanco.',
    speed: 320,
    jumpForce: 590,
    cooldownSec: 9,
    durationSec: 1.4,
    dashSpeed: 650,
    damage: 100,
    color: '#ec4899',
    type: 'mobility_offensive',
    basicAttack: {
      name: 'Golpe de Capacete',
      type: 'helmet_strike',
      damage: 28,
      range: 58,
      cooldown: 0.30,
      duration: 0.20
    }
  },
  matheus: {
    id: 'matheus',
    name: 'Matheus',
    abilityName: 'Invisibilidade Tática',
    desc: 'Torna-se imperceptível, esquivando-se automaticamente de ataques telegrafados.',
    speed: 310,
    jumpForce: 590,
    cooldownSec: 16,
    durationSec: 3.5,
    color: '#64748b',
    type: 'evasion',
    basicAttack: {
      name: 'Golpe Furtivo',
      type: 'shadow_jab',
      damage: 34,
      range: 56,
      cooldown: 0.32,
      duration: 0.20
    }
  },
  douglas: {
    id: 'douglas',
    name: 'Douglas',
    abilityName: 'Espada Dupla',
    desc: 'Combos cortantes de curto alcance armazenáveis em até duas cargas.',
    speed: 310,
    jumpForce: 590,
    maxCharges: 2,
    cooldownSec: 7,
    durationSec: 0.6,
    damage: 85,
    color: '#06b6d4',
    type: 'melee',
    basicAttack: {
      name: 'Corte de Lâmina',
      type: 'sword_slash',
      damage: 35,
      range: 78,
      cooldown: 0.30,
      duration: 0.22
    }
  },
  emily: {
    id: 'emily',
    name: 'Emily',
    abilityName: 'Hambúrguer Voador',
    desc: 'Lança um hambúrguer calórico aerodinâmico que atinge o chefão com impacto saboroso.',
    speed: 305,
    jumpForce: 580,
    cooldownSec: 6,
    durationSec: 1.5,
    projectileSpeed: 600,
    damage: 90,
    color: '#f97316',
    type: 'ranged',
    basicAttack: {
      name: 'Petisco Rápido',
      type: 'snack_toss',
      damage: 24,
      range: 220,
      cooldown: 0.30,
      duration: 0.18,
      isProjectile: true
    }
  },
  lais: {
    id: 'lais',
    name: 'Lais',
    abilityName: 'Feitiço Prismático',
    desc: 'Dispara um feixe prismático arcano de médio alcance que drena a resistência do chefão.',
    speed: 310,
    jumpForce: 580,
    cooldownSec: 8,
    durationSec: 1.2,
    range: 480,
    damage: 105,
    color: '#d946ef',
    type: 'magic',
    basicAttack: {
      name: 'Disparo Prismático',
      type: 'prismatic_shot',
      damage: 26,
      range: 200,
      cooldown: 0.30,
      duration: 0.20,
      isProjectile: true
    }
  },
  wendel: {
    id: 'wendel',
    name: 'Wendel',
    abilityName: 'Chuteira Míssil',
    desc: 'Bomba de longa distância em linha reta, gol de placa indefensável.',
    speed: 310,
    jumpForce: 600,
    cooldownSec: 7,
    durationSec: 1.5,
    projectileSpeed: 750,
    damage: 95,
    color: '#10b981',
    type: 'ranged',
    basicAttack: {
      name: 'Chutes Rápidos',
      type: 'fast_kick',
      damage: 26,
      range: 65,
      cooldown: 0.28,
      duration: 0.18
    }
  },
  vitor_mario: {
    id: 'vitor_mario',
    name: 'Vitor (Modo Mario)',
    abilityName: 'Super Salto Encanador',
    desc: 'Salto estratosférico que ignora completamente ataques terrestres e permite pisar no chefão.',
    speed: 300,
    jumpForce: 780,
    cooldownSec: 8,
    durationSec: 1.8,
    stompDamage: 115,
    color: '#dc2626',
    type: 'jump',
    basicAttack: {
      name: 'Soco Encanador',
      type: 'stomp_punch',
      damage: 30,
      range: 60,
      cooldown: 0.32,
      duration: 0.20
    }
  },
  taynara: {
    id: 'taynara',
    name: 'Taynara',
    abilityName: 'Raízes Vivas',
    desc: 'Brota raízes do asfalto que imobilizam o chefão por breve período ou cancelam ataques.',
    speed: 305,
    jumpForce: 580,
    cooldownSec: 15,
    durationSec: 2.2,
    rootDurationSec: 1.8,
    color: '#22c55e',
    type: 'crowd_control',
    basicAttack: {
      name: 'Chicote de Raiz',
      type: 'root_whip',
      damage: 29,
      range: 85,
      cooldown: 0.34,
      duration: 0.22
    }
  },
  clarinha: {
    id: 'clarinha',
    name: 'Clarinha',
    abilityName: 'Passinho Especial',
    desc: 'Coreografia carioca envolvente que confunde o chefão e atrasa ou interrompe o próximo golpe.',
    speed: 320,
    jumpForce: 600,
    cooldownSec: 13,
    durationSec: 2.0,
    delaySec: 2.0,
    color: '#ec4899',
    type: 'disrupt',
    basicAttack: {
      name: 'Passinho Rítmico',
      type: 'dance_strike',
      damage: 25,
      range: 62,
      cooldown: 0.28,
      duration: 0.18,
      canInterrupt: true
    }
  },
  junior: {
    id: 'junior',
    name: 'Junior',
    abilityName: 'Cocô Voador',
    desc: 'Disparo parabólico com física de arco balístico que estoura causando dano e lentidão.',
    speed: 305,
    jumpForce: 580,
    cooldownSec: 6.5,
    durationSec: 2.0,
    damage: 95,
    color: '#854d0e',
    type: 'parabolic_ranged',
    basicAttack: {
      name: 'Pelota de Cocô',
      type: 'short_splat',
      damage: 24,
      range: 160,
      cooldown: 0.32,
      duration: 0.20,
      isProjectile: true
    }
  }
};

export const SCORING_RULES = {
  DAMAGE_POINT_MULTIPLIER: 10,
  DODGE_BONUS: 250,
  TIME_SURVIVED_PER_SEC: 15,
  LIFE_REMAINING_BONUS: 1000,
  VICTORY_BONUS: 5000,
  FAST_FINISH_BONUS_PER_SEC_LEFT: 25
};

export const INPUT_BINDINGS = {
  LEFT: ['ArrowLeft', 'KeyA', 'a', 'A'],
  RIGHT: ['ArrowRight', 'KeyD', 'd', 'D'],
  JUMP: ['ArrowUp', 'KeyW', 'w', 'W', 'Space', ' '],
  CROUCH: ['ArrowDown', 'KeyS', 's', 'S'],
  BASIC_ATTACK: ['KeyZ', 'z', 'Z', 'KeyJ', 'j', 'J'],
  ABILITY: ['KeyX', 'x', 'X', 'KeyK', 'k', 'K', 'ShiftLeft', 'ShiftRight'],
  PAUSE: ['Escape', 'KeyP', 'p', 'P']
};
