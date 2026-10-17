# A Grande Família Game — Bíblia de Direção de Arte e Fichas dos Combatentes

Documento oficial de especificações técnicas, paletas, proporções, animações e regras visuais do **Modo Chefão**.

---

## 1. Diretrizes Gerais de Produção

- **Estilo Visual:** Pixel art 2D de 16-bits para arcade contemporâneo.
- **Escala de Exibição:** Resolução interna 960x540 (16:9), sem suavização (`imageSmoothingEnabled = false`).
- **Dimensões Base:**
  - Combatentes: 44px de largura × 76px de altura (área de colisão útil: 32×72px).
  - O Síndico: 140px de largura × 180px de altura (área de colisão útil: 116×170px).
- **Paleta Central:**
  - Fundo & Sombras: `#060211`, `#100520`, `#1a0833`, `#0f0a1c`.
  - Neon Primário: `#00f3ff` (Ciano), `#ff007f` (Magenta), `#ffe600` (Amarelo).
  - Perigo & Ataques: `#ef4444` / `#dc2626` (Vermelho Industrial), `#f59e0b` (Âmbar).

---

## 2. Fichas Técnicas dos 16 Combatentes

### 1. Di5 — Fumaça Blindada
- **Identidade:** Visual tático urbano, jaqueta escura com detalhes roxos e óculos escuros de armação pesada.
- **Paleta:** Primária `#1e1b4b` / `#312e81`, Secundária `#a855f7` (fumaça), Detalhes `#0f172a`.
- **Habilidade:** Escudo de energia e fumaça que absorve 1 impacto letal + 0,8s de invulnerabilidade. Recarga: 7s.
- **Animações:** Idle (respiração e brilho nos óculos), Run (4 frames com jaqueta ao vento), Jump/Fall, Attack (soco tático direto), Shield Active (bolha esférica ciano/roxa com partículas orbitais), Hurt.

### 2. Wendel — Chuteira Míssil
- **Identidade:** Atleta com camisa esportiva verde #10, faixa de cabeça esportiva e chuteiras douradas.
- **Paleta:** Primária `#15803d` / `#16a34a`, Secundária `#eab308` (ouro), Pele `#b07d62`.
- **Habilidade:** Chute potente em linha reta disparando bola de futebol com rastro de chamas a 750 px/s. Recarga: 4s.
- **Animações:** Idle (batendo chuteira no chão), Run (corrida veloz), Jump, Attack/Kick (chute de primeira), Celebração.

### 3. Muniz — Espírito do Vasco
- **Identidade:** Camisa preta com a tradicional faixa transversal branca e detalhe da Cruz de Malta vermelha no peito.
- **Paleta:** Primária `#0f172a` (preto carvão), Faixa `#f8fafc` (branco puro), Cruz `#dc2626`.
- **Habilidade:** Invoca a entidade cruzmaltina que cruza o campo em linha reta causando 140 de dano. Recarga: 6,5s.
- **Animações:** Idle (postura firme com punhos cerrados), Run, Jump, Attack, Invocação (braço erguido apontando para frente).

### 4. João — Carrinho Turbo
- **Identidade:** Piloto veloz com boné vermelho de corrida, acelerando um go-kart vermelho com rodas animadas e escapamento duplo.
- **Paleta:** Kart `#dc2626` / `#ef4444`, Pneus `#0f172a` / `#94a3b8`, Macacão `#2563eb`.
- **Habilidade:** Arrancada de kart com invulnerabilidade e dano por colisão frontal de 135. Recarga: 7s.
- **Animações:** Idle/Run (a pé), Kart Dash (montado no kart com chamas no escape e rodas girando), Jump, Hurt.

### 5. Douglas — Espada Dupla
- **Identidade:** Combatente marcial com faixa ciano na testa e duas lâminas de aço afiadas cruzadas nas costas.
- **Paleta:** Traje `#0891b2` / `#06b6d4`, Lâminas `#f8fafc` / `#94a3b8`, Cabelo `#0f172a`.
- **Habilidade:** Golpe cortante em arco de 200px com duas cargas armazenáveis (90 de dano por golpe). Recarga: 3,2s/carga.
- **Animações:** Idle (mão sobre o cabo da katana), Run, Jump, Slash (corte em arco duplo com rastro de luz ciano).

### 6. Nalu — Modo Loira Suprema
- **Identidade:** Heroína de cabelos loiros longos e volumosos, jaqueta dourada com zíper prateado e aura reluzente.
- **Paleta:** Cabelo `#fde047` / `#fef08a`, Jaqueta `#f59e0b` / `#d97706`, Calça `#1e1b4b`.
- **Habilidade:** Bônus de velocidade (+120 px/s) e multiplicador de pontuação de 1,5x por 3,8s. Recarga: 7s.
- **Animações:** Idle (cabelos esvoaçantes), Run, Jump, Transformação (brilho estelar ascendente), Attack.

### 7. Beatriz — Rioqualit
- **Identidade:** Combatente de azul celeste vibrante, tiara ciano e essência mística carioca.
- **Paleta:** Primária `#0284c7` / `#38bdf8`, Secundária `#bae6fd`, Cabelo `#1e293b`.
- **Habilidade:** Onda mística Rioqualit que percorre o solo em velocidade causando 130 de dano. Recarga: 6,5s.
- **Animações:** Idle, Run, Jump, Cast (liberação da onda líquida/mística com partículas azuis).

### 8. Vitor — Modo Sonic
- **Identidade:** Transformação em esfera azul giratória com espinhos rotativos dinâmicos e centelhas douradas.
- **Paleta:** Primária `#2563eb` / `#1d4ed8`, Tênis `#ef4444` / `#f8fafc`, Faíscas `#ffe600`.
- **Habilidade:** Spin Dash veloz (+340 px/s) com invulnerabilidade e dano por atropelamento de 120. Recarga: 7,5s.
- **Animações:** Idle/Run (forma normal), Spin Dash (esfera rotativa contínua com rastro de velocidade), Retorno.

### 9. Julya — Motinha da Julya
- **Identidade:** Piloto estilosa com scooter rosa choque, capacete personalizado com viseira fumê e farol aceso.
- **Paleta:** Scooter `#db2777` / `#ec4899`, Capacete `#f472b6`, Calça `#0f172a`.
- **Habilidade:** Arrancada ágil em duas rodas (+240 px/s) permitindo reposicionamento e golpe de 100 de dano. Recarga: 7s.
- **Animações:** Idle/Run (a pé), Motinha Dash (pilotando a moto com fumaça e rodas animadas), Jump, Hurt.

### 10. Junior — Cocô Voador
- **Identidade:** Garoto brincalhão de boné virado para trás, camiseta listrada e expressão travessa.
- **Paleta:** Boné `#854d0e`, Roupa `#d97706` / `#fef08a`, Projétil `#78350f` / `#582a0a`.
- **Habilidade:** Disparo balístico em parábola de cocô com física de gravidade real causando 95 de dano. Recarga: 4s.
- **Animações:** Idle, Run, Jump, Arremesso parabólico (arco com fumacinha cômica e impacto).

### 11. Clarinha — Passinho Especial
- **Identidade:** Dançarina carioca com tranças neon (magenta e ciano), top esportivo e brincos de argola.
- **Paleta:** Tranças `#db2777` & `#06b6d4`, Top `#ec4899`, Calça `#1e1b4b`.
- **Habilidade:** Coreografia de passinho que hipnotiza e atordoa o Síndico por 2s, cancelando ataques. Recarga: 12s.
- **Animações:** Idle, Run, Jump, Passinho (dança rítmica com movimento de ombros, passos cruzados e notas musicais).

### 12. Taynara — Raízes Vivas
- **Identidade:** Mulher negra de tranças longas e coroa de folhas verdes, sintonizada com a natureza urbana.
- **Paleta:** Pele `#6d4c41` / `#4e342e`, Traje `#166534` / `#22c55e`, Raízes `#78350f` / `#4ade80`.
- **Habilidade:** Raízes que brotam do asfalto, rastejam por 340px e imobilizam o chefão por 1,8s. Recarga: 8s.
- **Animações:** Idle, Run, Jump, Conjuração (mãos ao solo, raízes brotando do chão em direção ao boss).

### 13. Matheus — Invisibilidade
- **Identidade:** Jovem negro com corte degradê navalhado perfeito e casaco casual cinza escuro.
- **Paleta:** Pele `#6d4c41`, Cabelo `#1c1917`, Casaco `#475569` / `#334155`, Fantasma `rgba(255,255,255,0.28)`.
- **Habilidade:** Transforma-se em silhueta espectral translúcida por 3,5s, imune a ataques telegrafados. Recarga: 8,5s.
- **Animações:** Idle, Run, Jump, Transição Espectral (fade suave para forma translúcida), Hurt.

### 14. Emily — Hambúrguer Voador
- **Identidade:** Chef lanchoneira com chapéu de mestre-cuca branco e avental laranja com bolso frontal.
- **Paleta:** Chapéu `#f8fafc`, Avental `#ea580c`, Pão do Burger `#d97706`, Carne `#78350f`, Alface `#22c55e`.
- **Habilidade:** Arremesso de hambúrguer gigante artesanal em linha reta perfurando até 3 obstáculos (95 de dano). Recarga: 5,6s.
- **Animações:** Idle, Run, Jump, Arremesso de Hambúrguer (lançamento estilo frisbee giratório).

### 15. Lais — Feitiço Prismático
- **Identidade:** Feiticeira urbana com tiara roxa cravejada com cristal ciano e manto estelar.
- **Paleta:** Manto `#7e22ce` / `#a855f7`, Cristal `#38bdf8`, Feixe `#c084fc` / `#38bdf8` / `#f472b6`.
- **Habilidade:** Disparo contínuo de feixe prismático arco-íris de 400px causando dano direto. Recarga: 6,5s.
- **Animações:** Idle (orbe mágico flutuante na mão), Run, Jump, Disparo Prismático (raio cintilante com faíscas).

### 16. Vitor — Modo Mario / Super Salto
- **Identidade:** Forma alternativa retrô com boné vermelho com aba, macacão jeans azul com botões dourados e bigode.
- **Paleta:** Boné `#dc2626`, Macacão `#2563eb`, Luvas `#f8fafc`, Botas `#78350f`.
- **Habilidade:** Super salto vertical com impulso massivo (-750 px/s) para escapar de ameaças terrestres. Recarga: 6,5s.
- **Animações:** Idle, Run, Super Salto (pose clássica com punho levantado), Queda rápida com impacto.

---

## 3. Especificação do Chefão: O Síndico do Parque Columbia

- **Anatomia & Proporções:**
  - Altura: 180px, Largura: 140px.
  - Cabeça: Calvície superior com 5 mechas finas esticadas sobre o couro cabeludo, costeletas grisalhas volumosas.
  - Rosto: Óculos de armação preta com lentes azuis e reflexo branco diagonal, bigode espesso em arco, queixo duplo pronunciado.
  - Tronco: Camisa polo amarela mostarda `#eab308` (muda para vermelho rubi `#e11d48` na Fase 3 Enraivecida), botões brancos, suspensórios pretos com fivelas de prata.
  - Pernas: Calça social cinza escuro de cós alto `#475569`, cinto preto com fivela dourada retangular, sapatos sociais Oxford pretos com brilho no bico.
  - Acessório Esquerdo: Prancheta de madeira nobre `#78350f`, clipe metálico superior, folhas de papel sulfite com tarja vermelha e carimbo de "MULTA".
  - Acessório Direito: Chave inglesa industrial vermelha de 24 polegadas com mandíbula metálica ajustável cinza e parafuso sextavado.

- **Comportamento das 3 Fases:**
  - **Fase 1 (> 70% HP):** Notificação Amigável (Aura Ciano `#00f3ff`). Ataques calmos e pausados.
  - **Fase 2 (70% - 30% HP):** Assembleia Extraordinária (Aura Dourada `#ffbe0b`). Ataques rápidos com combinações de perigo.
  - **Fase 3 (< 30% HP):** Execução de Penhora (Aura Vermelha Intensa `#ff0055`). O Síndico fica com a pele vermelha de raiva, vapor sai dos seus ouvidos e seus golpes têm intervalos mínimos.
