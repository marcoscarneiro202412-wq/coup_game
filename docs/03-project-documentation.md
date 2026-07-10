# Project Documentation

## Project Overview

This project is a React implementation of a local Coup-inspired game. Players are registered inside the app, receive character cards, take turns, perform actions, lose HP, and eventually one winner remains.

Main technologies:

- React 18
- Vite
- Redux Toolkit
- React Redux
- React Router
- CSS Modules
- MUI components for some selects

## Current App Flow

```text
Home
  -> Login or Signup
  -> Register Players
  -> Play Game
  -> Winner
  -> Home
```

Current routes:

```text
/                Home
/login           Login form
/signup          Signup form
/history         User match history
/game            Redirects to /game/register
/game/register   Local player registration
/game/play       Main game screen
/game/winner     Winner screen
```

## Important Source Files

```text
src/App.jsx
```

Defines the browser routes.

```text
src/main.jsx
```

Mounts React and provides the Redux store.

```text
src/app/store.js
```

Creates the Redux store and registers reducers and listener middleware.

```text
src/data/characters.js
```

Defines available character roles.

```text
src/features/players/playerSlice.js
```

Stores players and most game actions.

```text
src/features/game/gameSlice.js
```

Stores match status and winner.

```text
src/features/game/turnSlice.js
```

Stores current turn and round number.

```text
src/features/auth/authSlice.js
```

Stores user authentication state.

```text
src/middleware/*.js
```

Handles side effects such as auth API requests, localStorage persistence, turn advancement, HP listener behavior, and final match history save.

## Current Redux State

### Auth State

```js
{
  isLoading: false,
  error: "",
  user: null,
  isAuthenticated: false
}
```

Purpose:

- Track logged-in user.
- Track login/signup loading.
- Track auth errors.

### Players State

```js
{
  players: [
    {
      id: 1,
      name: "Player name",
      imgUrl: "avatar url",
      money: 0,
      hp: 1,
      characters: [],
      alive: true,
      declaredCharacter: "duke"
    }
  ]
}
```

Purpose:

- Store local match players.
- Store coins, HP, cards, and alive status.

### Game State

```js
{
  status: "waiting",
  winner: null,
  gameStarted: false
}
```

Purpose:

- Track whether a game is active.
- Store winner information.

### Turn State

```js
{
  currentTurn: 0,
  round: 1
}
```

Purpose:

- Store whose turn it is.
- Count rounds.

## Character Data

Current characters:

- Duke
- Assassin
- Captain
- Ambassador
- Contessa

Each character has:

```js
{
  id: "duke",
  name: "Duke",
  action: "tax",
  description: "Recebe 3 moedas do tesouro.",
  attackOtherPlayer: false
}
```

## Current Game Actions

### Register Player

Source:

```text
src/pages/RegisterPlayers.jsx
src/features/players/playerSlice.js
```

Behavior:

- User enters name and optional avatar URL.
- App rejects duplicate names.
- App creates a player with money `0`, HP `0`, and no characters.

### Start Game

Source:

```text
src/pages/RegisterPlayers.jsx
src/features/players/playerSlice.js
src/features/game/gameSlice.js
```

Behavior:

- Requires at least 3 players.
- Generates one character for each player.
- Sets each player to alive with HP `1`.
- Sets game status to started.

### Declare Character

Source:

```text
src/components/Declare.jsx
src/features/players/playerSlice.js
src/middleware/playerInteractMiddleware.js
```

Behavior:

- Current player selects a character to declare.
- Duke gives 3 coins immediately.
- Ambassador may exchange cards if the player really has Ambassador.
- Assassin and Captain are handled by middleware because they attack another player.

### Coup D'Etat

Source:

```text
src/components/Actions.jsx
src/features/players/playerSlice.js
```

Behavior:

- Costs 7 coins.
- Asks for a target by name.
- Removes 1 HP from target.
- Removes one character card from target.

### Bargain

Source:

```text
src/components/Actions.jsx
src/features/players/playerSlice.js
```

Behavior:

- Costs 6 coins.
- Randomly replaces current player cards.

### Ritual

Source:

```text
src/components/Actions.jsx
src/features/players/playerSlice.js
```

Behavior:

- Costs 18 coins.
- Adds a new character and HP if possible.

### Pedir Auxilio

Source:

```text
src/components/Actions.jsx
src/features/players/playerSlice.js
```

Behavior:

- Gives current player 2 coins.

### Confront

Source:

```text
src/components/Confront.jsx
src/features/players/playerSlice.js
```

Behavior:

- Lets one player challenge another player's declaration.
- Current implementation transfers money depending on whether the declaration was truthful.

## Middleware Responsibilities

### Auth Middleware

File:

```text
src/middleware/authMiddleware.js
```

Responsibilities:

- Login API request.
- Signup API request.
- Delete history API request.
- Dispatch user or error updates.

### Intercept Middleware

File:

```text
src/middleware/interceptMiddleware.js
```

Responsibilities:

- Save players, turn, auth, and game state to localStorage after every action.

### HP Listener Middleware

File:

```text
src/middleware/hpListenerMiddleware.js
```

Responsibilities:

- Watch HP changes.
- Remove dead players.
- Finalize game if one player remains.
- Adjust current turn when player list changes.

### Next Turn Middleware

File:

```text
src/middleware/nextTurnMiddleware.js
```

Responsibilities:

- Advance turn after selected actions.

### Player Interact Middleware

File:

```text
src/middleware/playerInteractMiddleware.js
```

Responsibilities:

- Handle Assassin and Captain actions.
- Ask user for targets with `prompt`.
- Show results with `alert`.

### Finalize Game Middleware

File:

```text
src/middleware/finalizeGameMiddleware.js
```

Responsibilities:

- Save match result to remote history API.
- Update user history.
- Clear players and reset persisted game state.

## Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run start
```

Run lint:

```bash
npm run lint
```

Build production version:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Current External API

The app currently calls:

```text
https://users-api-coup.onrender.com/auth/login
https://users-api-coup.onrender.com/auth/signup
https://users-api-coup.onrender.com/history/create
https://users-api-coup.onrender.com/history/delete
```

These calls are made from middleware.

## Known Limitations

- The app currently depends on a remote API for auth/history.
- The game logic is not covered by automated tests.
- Browser prompts are used for target selection.
- There is no central protected route component.
- Game rules are partly implemented in reducers and partly in middleware.
- The current deck has only one copy of each character role.
- Winner state may be cleared before the winner page can display it.

## Recommended Documentation To Add Later

- `RULES.md`: exact game rules implemented by this app.
- `API.md`: remote API request and response contracts.
- `STATE.md`: Redux state shape and action catalog.
- `TESTING.md`: how to run and write tests.
- `CONTRIBUTING.md`: coding conventions for future students.
