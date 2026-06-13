# 🎴 Coup React - Roadmap de Arquitetura

## Visão Geral

Projeto inspirado no jogo de cartas Coup, desenvolvido utilizando React e Redux Toolkit.

O jogo será totalmente local (singleplayer), permitindo múltiplos jogadores na mesma partida, com autenticação simulada através de JSON Server.

---

# Objetivos do Projeto

- Desenvolver uma aplicação React escalável.
- Centralizar a lógica do jogo no Redux.
- Utilizar Context API apenas para gerenciamento de tema.
- Implementar autenticação fake utilizando JSON Server.
- Criar um sistema de turnos e rodadas.
- Implementar personagens com habilidades únicas.
- Determinar automaticamente o vencedor da partida.

---

# Regras do Jogo

## Jogadores

- Apenas usuários autenticados podem acessar o jogo.
- A partida pode possuir múltiplos jogadores locais.
- Cada jogador possui:
  - Nome
  - Dinheiro
  - Vida
  - Personagens

## Personagens

Serão 12 personagens divididos em 4 grupos de 3.

Cada personagem possuirá:

- Nome
- Grupo
- Descrição
- Habilidade Única

Exemplo:

javascript
{
  id: 1,
  name: "Assassino",
  group: "Crime",
  ability: "kill"
}


## Condição de Vitória

O vencedor será o último jogador vivo.


1 jogador vivo
↓
Fim da partida
↓
Vencedor declarado


---

# Arquitetura da Aplicação

## Rotas


/
├── Login
├── Registro
└── Home

/game
├── Setup da Partida
└── Partida


Fluxo:


Login
 ↓
Home
 ↓
Criar Jogadores
 ↓
Iniciar Partida
 ↓
Game
 ↓
Fim de Jogo


---

# Estrutura de Pastas


src/
│
├── app/
│   └── store.js
│
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   └── authAPI.js
│   │
│   ├── game/
│   │   ├── gameSlice.js
│   │   ├── turnSlice.js
│   │   └── actionsSlice.js
│   │
│   ├── players/
│   │   └── playersSlice.js
│   │
│   └── characters/
│       └── charactersSlice.js
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Game.jsx
│
├── components/
│   ├── PlayerCard.jsx
│   ├── CharacterCard.jsx
│   ├── TurnIndicator.jsx
│   ├── ActionPanel.jsx
│   ├── MoneyDisplay.jsx
│   └── WinnerModal.jsx
│
├── contexts/
│   └── ThemeContext.jsx
│
├── routes/
│   └── ProtectedRoute.jsx
│
└── services/
    └── api.js


---

# Redux Store


Store
│
├── Auth
├── Players
├── Characters
├── Turns
└── Game


## Auth Slice

javascript
{
  user: null,
  isAuthenticated: false,
  loading: false
}


## Players Slice

javascript
{
  players: [
    {
      id: 1,
      name: "Marcos",
      money: 2,
      hp: 2,
      alive: true,
      characters: []
    }
  ]
}


## Characters Slice

javascript
{
  characters: []
}


## Turn Slice

javascript
{
  currentTurn: 0,
  round: 1
}


## Game Slice

javascript
{
  status: "waiting",
  winner: null,
  gameStarted: false
}


---

# Sistema de Turnos


Início do Turno
      ↓
Exibir Nome do Jogador
      ↓
Escolher Ação
      ↓
Executar Habilidade
      ↓
Atualizar Redux
      ↓
Verificar Vitória
      ↓
Próximo Turno


---

# Sistema de Ações

## Roubar


Selecionar Roubar
 ↓
Input de Nome
 ↓
Escolher Alvo
 ↓
Transferir Dinheiro


## Assassinar


Selecionar Assassinar
 ↓
Input de Nome
 ↓
Escolher Alvo
 ↓
Remover Vida
 ↓
Verificar Morte


## Golpe de Estado

Condição:

javascript
player.money >= 7


Fluxo:


Botão Disponível
 ↓
Escolher Alvo
 ↓
Remover 7 Moedas
 ↓
Eliminar Jogador


---

# Seleção de Jogadores por Nome


Digite o nome do jogador:
[____________]


Usado para:

- Roubar
- Assassinar
- Golpe de Estado

---

# Verificação de Vitória

javascript
const alivePlayers = players.filter(
  player => player.alive
);

if (alivePlayers.length === 1) {
  winner = alivePlayers[0];
  status = "finished";
}


---

# Context API

javascript
{
  theme: "light",
  toggleTheme()
}


Temas:

- Light
- Dark

---

# Proteção de Rotas

jsx
<ProtectedRoute>
  <Game />
</ProtectedRoute>


Fluxo:


Usuário Logado?
     ↓
   Sim → /game
     ↓
   Não → /login


---

# Roadmap de Desenvolvimento

## Fase 1 - Configuração

- [ ] Criar projeto React
- [ ] Configurar React Router
- [ ] Configurar Redux Toolkit
- [ ] Configurar JSON Server
- [ ] Configurar autenticação

## Fase 2 - Usuários

- [ ] Login
- [ ] Registro
- [ ] Persistência de sessão
- [ ] Proteção de rotas

## Fase 3 - Jogadores

- [ ] Criar jogadores
- [ ] Listar jogadores
- [ ] Remover jogadores
- [ ] Selecionar personagens

## Fase 4 - Personagens

- [ ] Criar 12 personagens
- [ ] Implementar habilidades
- [ ] Organizar por grupos

## Fase 5 - Sistema de Turnos

- [ ] Controle de rodada
- [ ] Controle de turno
- [ ] Exibição do jogador atual

## Fase 6 - Mecânicas do Jogo

- [ ] Roubar
- [ ] Assassinar
- [ ] Golpe de Estado
- [ ] Habilidades especiais

## Fase 7 - Finalização

- [ ] Detectar vencedor
- [ ] Tela de vitória
- [ ] Reiniciar partida

## Fase 8 - UX/UI

- [ ] Dark Mode
- [ ] Light Mode
- [ ] Animações
- [ ] Sons
- [ ] Feedback visual das ações