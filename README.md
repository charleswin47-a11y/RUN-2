# A Grande Família Game — Modo Chefão (Boss Mode)

Módulo independente de combate de arena 2D em pixel art contra chefões para **A Grande Família Game**.

---

## 1. Requisitos para Executar
- Navegador moderno com suporte a HTML5 Canvas e ES Modules (Chrome, Firefox, Safari, Edge).
- Node.js (v18 ou superior recomendado) para executar o servidor local de desenvolvimento e os testes automatizados.

---

## 2. Instalação e Execução

### Opção A: Servidor Nativo Node.js
```bash
# Executa o servidor HTTP nativo na porta 3000
npm start
# Ou diretamente:
node server.js
```
Acesse no seu navegador: `http://localhost:3000`

### Opção B: VS Code Live Server ou qualquer servidor estático
Abra a pasta do projeto no VS Code e clique com o botão direito em `index.html` → **Open with Live Server**.

### Executar os Testes Automatizados
```bash
npm test
```

---

## 3. Estrutura de Arquivos
```
a-grande-familia-boss-mode/
├── index.html                  # Container do jogo, canvas 960x540 e HUD
├── README.md                   # Documentação completa do modo
├── INTEGRATION.md              # Guia de integração ao runner original
├── package.json                # Metadados e scripts de teste e execução
├── server.js                   # Servidor local nativo sem dependências
├── src/
│   ├── main.js                 # Ponto de entrada e orquestrador
│   ├── game.js                 # Motor da arena, loop com delta-time e renderização
│   ├── config.js               # Central de balanceamento (Boss, 15 Personagens, Regras)
│   ├── entities/
│   │   ├── player.js           # Física arcade, pulos, agachamento e 15 habilidades
│   │   └── boss.js             # IA do Síndico, 3 fases, 3 ataques e estados
│   ├── graphics/
│   │   └── spriteRenderer.js   # Renderizador pixel art 16-bits (personagens, boss, projéteis)
│   ├── systems/
│   │   ├── input.js            # Captura de teclado e touch mobile
│   │   ├── scoring.js          # Pontuação determinística e estatísticas
│   │   ├── combat.js           # Resolução de colisões AABB, dano, esquivas e partículas
│   │   └── audio.js            # Sintetizador retrô nativo Web Audio API (zero dependências)
│   ├── ui/
│   │   ├── hud.js              # Atualização de barras, vidas e timers
│   │   ├── menus.js            # Seleção de personagens, painel tático e pausa
│   │   └── results.js          # Painel de estatísticas finais
│   └── styles/
│       └── game.css            # Estilo arcade retrô (roxo, ciano e magenta neon)
├── assets/
│   ├── README.md               # Guia de organização de mídias
│   ├── characters/
│   ├── bosses/
│   ├── backgrounds/
│   ├── effects/
│   └── audio/
└── tests/
    ├── config_and_lifecycle.test.js # Testes das regras e personagens
    ├── combat_and_systems.test.js   # Testes de combate, colisões e habilidades
    └── match_flow.test.js           # Teste de fluxo completo de partida
```

---

## 4. Controles

| Ação | Teclado (Desktop) | Celular (Touch) |
| :--- | :--- | :--- |
| Mover para Esquerda | `Seta Esquerda` ou `A` | Botão `◀` |
| Mover para Direita | `Seta Direita` ou `D` | Botão `▶` |
| Pular | `Espaço`, `Seta Cima` ou `W` | Botão `▲` |
| Abaixar | `Seta Baixo` ou `S` | Contextual |
| Ataque Básico | `Z` ou `J` | Botão `⚔️` |
| Habilidade Especial | `X`, `K` ou `Shift` | Botão `⚡` |
| Pausar / Despausar | `Escape` ou `P` | Botão de Pausa |

---

## 5. Campanha Oficial de 3 Chefões
A campanha solo apresenta progressão contínua em três arenas temáticas:
1. **Fase 1: O Síndico do Parque Columbia (Fácil • Tutorial)**
   - HP: 1.000 | Arena: Parque Columbia (prédios residenciais, poste de luz, calçadão de Copacabana).
   - Ataques: Chave Inglesa Frontal, Reclamação do Condomínio (onda no chão), Multa Surpresa (queda aérea).
2. **Fase 2: O Bandido (Médio)**
   - HP: 1.300 | Arena: Beco Noturno da Zona Norte (muros grafitados, fios elétricos, tambor de fogo).
   - Ataques: Investida Relâmpago (arrancada veloz com janela vulnerável de whiff), Arremesso de Navalha, Açoite de Corrente. Na Fase 2/3, encadeia combos duplos.
3. **Fase 3: O Chefão do Tráfico (Difícil • Final)**
   - HP: 1.600 | Arena: Cobertura Panorâmica do QG (vista panorâmica do Rio, Cristo Redentor iluminado, guarda-corpo neon).
   - Ataques: Domínio da Arena (setor de chão bloqueado com fogo/lasers), Investida de Capangas (sombras velozes), Disparo de Calibre Pesado.
- **Progressão**: Vencer uma fase desbloqueia a seguinte. Perder vidas permite tentar novamente a fase atual sem reiniciar a campanha.

---

## 6. Estilos de Combate e Golpes Básicos dos 16 Combatentes
Além das habilidades especiais únicas, cada lutador possui ataque básico com animação, alcance e impacto próprios:
- **Di5**: *Soco Pesado* (25 dano). Se bloquear um golpe letal com a Fumaça Blindada, ativa **Contra-Ataque Poderoso** que inflige 50 de dano!
- **Wendel**: *Chutes Rápidos* (26 dano) com chuteira verde veloz e bola míssil.
- **Muniz**: *Cruzado Esportivo* (28 dano) de boxe com luva cruzmaltina e invocação do Vasco.
- **João**: *Chave de Roda* (30 dano) automotiva e trombada de kart turbo.
- **Douglas**: *Corte de Lâmina* (35 dano) em arco ciano com espada dupla.
- **Nalu**: *Chute Estrelar* (26 dano) com brilho dourado e multiplicador de score.
- **Beatriz**: *Pulso Rioqualit* (28 dano) de energia aquática e entidade de longo alcance.
- **Vitor (Sonic)**: *Giro Rasteiro* (27 dano) no chão e spin dash veloz.
- **Julya**: *Golpe de Capacete* (28 dano) e arrancada com a motinha.
- **Junior**: *Pelota de Cocô* (24 dano) arremessada e cocô voador parabólico cômico.
- **Clarinha**: *Passinho Rítmico* (25 dano) que atordoa e interrompe preparações de golpe do chefão.
- **Taynara**: *Chicote de Raiz* (29 dano) pelo chão e raízes vivas imobilizadoras.
- **Matheus**: *Golpe Furtivo* (34 dano) que causa +50% de dano das sombras se desferido invisível.
- **Emily**: *Petisco Rápido* (24 dano) arremesso veloz e hambúrguer perfurante.
- **Lais**: *Disparo Prismático* (26 dano) arcano de médio alcance e feixe mágico contínuo.
- **Vitor (Mario)**: *Soco Encanador* (30 dano) clássico e super salto com pisão aéreo.

---

## 7. Regras do Combate
- **Tempo Limite:** 180 segundos (3 minutos reais decorridos).
- **Vidas do Jogador:** 3 vidas.
- **Condições de Vitória:** Reduzir a vida do chefão a 0 antes do fim do tempo.
- **Condições de Derrota:** Perder todas as 3 vidas OU tempo limite esgotar.
- **Invulnerabilidade:** Após sofrer um golpe, o jogador recebe 1,5s de invulnerabilidade com piscar visual.
- **Janelas de Vulnerabilidade:** O chefão possui momentos de ataque nos quais pode receber contra-ataques precisos.

---

## 6. O Primeiro Chefão: O Síndico do Parque Columbia
- **Vida Total:** 1.000 HP.
- **Fase 1 (> 70% HP):** Notificação Amigável — Ataques compassados e intervalos longos.
- **Fase 2 (70% a 30% HP):** Assembleia Extraordinária — Ataques combinados e tempo de recarga reduzido.
- **Fase 3 (< 30% HP):** Execução de Penhora — Ataques rápidos e alta agressividade.

### Ataques do Chefão:
1. **Chave Inglesa:** Golpe frontal telegrafado. Esquiva-se recuando ou pulando.
2. **Reclamação do Condomínio:** Onda de choque rasteira pelo chão. Esquiva-se saltando no momento exato.
3. **Multa Surpresa:** Área avermelhada de aviso no chão indicando queda iminente de aviso judicial. Esquiva-se saindo da área.

---

## 7. Roster de Combatentes (15 Personagens)
Todos configurados em `src/config.js`:
1. **Di5:** *Fumaça Blindada* — Escudo que anula um golpe letal.
2. **Muniz:** *Espírito do Vasco* — Invocação que cruza a arena e golpeia o chefão.
3. **Beatriz:** *Rioqualit* — Onda mística de dano à distância.
4. **Vitor (Sonic):** *Spin Dash Supersônico* — Arrancada veloz com proteção e dano por atropelamento.
5. **Nalu:** *Modo Loira Suprema* — Super velocidade e bônus multiplicador de pontuação.
6. **João:** *Carrinho Turbo* — Disparada de kart com colisão ofensiva.
7. **Julya:** *Motinha da Julya* — Mobilidade ágil para reposicionamento e golpe de flanco.
8. **Matheus:** *Invisibilidade Tática* — Esquiva-se de ataques telegrafados do síndico.
9. **Douglas:** *Espada Dupla* — Ataques velozes de lâmina em duas cargas armazenadas.
10. **Emily:** *Hambúrguer Voador* — Projétil nutritivo de longo alcance com dano direto.
11. **Lais:** *Feitiço Prismático* — Feixe mágico contínuo de médio alcance.
12. **Wendel:** *Chuteira Míssil* — Disparo balístico em linha reta de alta velocidade.
13. **Vitor (Mario):** *Super Salto Encanador* — Salto vertical massivo que ignora o chão e pisa no boss.
14. **Taynara:** *Raízes Vivas* — Imobiliza o síndico cancelando ou atrasando ataques.
15. **Clarinha:** *Passinho Especial* — Coreografia que distrai o chefão e reinicia seu ciclo.
16. **Junior:** *Cocô Voador* — Projétil com trajetória em parábola que explode na área.

---

## 8. Como Adicionar Novos Chefões
1. Abra `src/config.js`.
2. Duplique o bloco `BOSS_CONFIG` criando uma nova chave (ex: `SUB_SINDICO_CONFIG`).
3. Defina os ataques (`ATTACKS`) com `TELEGRAPH_SEC`, `HITBOX` e danos.
4. Adicione as fases com seus respectivos gatilhos de porcentagem de vida.

---

## 9. Como Adicionar ou Modificar Personagens
1. Em `src/config.js`, adicione um novo objeto em `CHARACTERS_CONFIG`:
```javascript
novo_personagem: {
  id: 'novo_personagem',
  name: 'Nome do Combatente',
  abilityName: 'Nome da Habilidade',
  desc: 'Descrição da habilidade',
  speed: 310,
  jumpForce: 590,
  cooldownSec: 10,
  damage: 100,
  color: '#00f3ff',
  type: 'ranged'
}
```
2. O sistema de menu carrega os personagens dinamicamente sem necessidade de alterar o HTML.

---

## 10. Pontos de Integração com o Jogo Original
Veja o arquivo [INTEGRATION.md](file:///c:/Users/USER/Desktop/Nova%20pasta%20%284%29/INTEGRATION.md) para o guia passo a passo sem interferir no runner existente.
