# Architecture and Design Improvements

This document suggests a cleaner design for the project. The goal is not to make the app more complicated. The goal is to make the game easier to understand, test, and extend.

## Current Architecture

Current structure:

```text
src/
  app/
    store.js
  components/
  data/
    characters.js
  features/
    auth/
    game/
    players/
  middleware/
  pages/
```

This is a reasonable start. The main issue is that responsibilities are mixed:

- Components sometimes contain game rules and browser prompts.
- Reducers contain random card drawing and multi-step rules.
- Middleware contains UI behavior, API calls, persistence, and turn coordination.
- The winner screen depends on state that middleware may clear.

## Recommended Target Architecture

Suggested structure:

```text
src/
  app/
    store.js

  domain/
    constants.js
    deck.js
    gameRules.js
    turnRules.js
    validation.js

  features/
    auth/
      authSlice.js
      authThunks.js
      authSelectors.js
    game/
      gameSlice.js
      gameSelectors.js
    players/
      playersSlice.js
      playersSelectors.js

  services/
    authApi.js
    historyApi.js
    storage.js

  components/
    ui/
    game/
    layout/

  pages/
  routes/
    ProtectedRoute.jsx
```

## Design Principle 1: Keep Game Rules Pure

A pure function is a function that:

- Receives all needed data as arguments.
- Returns a result.
- Does not call `fetch`, `alert`, `prompt`, `localStorage`, or `Math.random`.
- Does not mutate global state.

Why this helps:

- It is easy to test.
- It is easy to debug.
- It makes game behavior predictable.

Example:

```js
export function canCoup(player) {
  return player.money >= 7;
}

export function resolveCoup(state, actorId, targetId) {
  const actor = state.players.find((p) => p.id === actorId);
  const target = state.players.find((p) => p.id === targetId);

  if (!actor) return { ok: false, error: "Actor not found." };
  if (!target) return { ok: false, error: "Target not found." };
  if (actor.id === target.id) return { ok: false, error: "Cannot target yourself." };
  if (actor.money < 7) return { ok: false, error: "Not enough money." };

  return {
    ok: true,
    changes: [
      { type: "money", playerId: actorId, amount: -7 },
      { type: "damage", playerId: targetId, amount: 1 }
    ]
  };
}
```

The reducer can then apply the result. The test can check the result without rendering React.

## Design Principle 2: Model the Deck Separately

Current design mixes character definitions with card availability.

Better model:

```js
export const characterDefinitions = {
  duke: {
    name: "Duke",
    action: "tax",
    blocks: []
  },
  contessa: {
    name: "Contessa",
    action: null,
    blocks: ["assassinate"]
  }
};

export const startingDeck = [
  "duke", "duke", "duke",
  "assassin", "assassin", "assassin",
  "captain", "captain", "captain",
  "ambassador", "ambassador", "ambassador",
  "contessa", "contessa", "contessa"
];
```

Why this helps:

- A role definition is different from a physical card.
- Duplicate cards become possible.
- Exchange actions can return cards to the deck.
- The game can support normal Coup rules more naturally.

## Design Principle 3: Avoid Removing Players During the Match

Current behavior removes dead players from the array. That makes turn indexes harder.

Suggested state:

```js
{
  id: "player-1",
  name: "Ana",
  money: 2,
  influence: ["duke", "captain"],
  revealedInfluence: [],
  alive: true
}
```

When a player loses influence:

- Move one card from `influence` to `revealedInfluence`.
- Set `alive` to false when no hidden influence remains.
- Keep the player in the array.

Why this helps:

- Player ids stay stable.
- Turn calculation can skip dead players.
- The UI can still show eliminated players and revealed cards.
- Match history is easier to explain.

## Design Principle 4: Centralize Turn Resolution

Instead of advancing turns from several middleware files, create one rule:

```js
export function getNextAlivePlayerIndex(players, currentIndex) {
  if (players.every((p) => !p.alive)) return -1;

  let index = currentIndex;
  do {
    index = (index + 1) % players.length;
  } while (!players[index].alive);

  return index;
}
```

Then call it after a valid action.

This makes the turn behavior easy to reason about:

- Invalid action: same player can retry or the action fails visibly.
- Valid action: turn advances.
- Player eliminated: next alive player is selected.
- Game over: winner is stored.

## Design Principle 5: Separate Authentication from Local Game State

Authentication and the local match are different domains:

- Auth answers: "Who is logged in?"
- Game answers: "What is happening in this local match?"

Recommended approach:

- `authSlice` stores user, loading, and auth errors.
- `gameSlice` stores match state.
- `historyApi` saves completed matches.
- Route guards protect authenticated routes.

Avoid having the finalize middleware clear match state before the winner page has rendered.

## Design Principle 6: Use Real UI Controls

Avoid browser dialogs for core gameplay.

Better UX:

- Use a target picker panel.
- Disable invalid targets.
- Show action result messages in the page.
- Show blocked actions with an explanation.
- Use real buttons instead of clickable divs.

Example user flow for Coup:

```text
Current player clicks "Coup"
Target picker opens
Player selects target
Confirm button dispatches action
Game result appears in action log
Turn advances
```

## Design Principle 7: Add an Action Log

A Coup game has many hidden and visible events. A log helps players understand the game.

Suggested state:

```js
log: [
  {
    id: "event-1",
    round: 2,
    playerId: "player-1",
    type: "tax",
    message: "Ana declared Duke and took 3 coins."
  }
]
```

Benefits:

- Easier debugging.
- Better student demonstration.
- Better history page.
- Good foundation for replay features.

## Design Principle 8: Use Selectors

Selectors make components simpler and avoid repeated state calculations.

Examples:

```js
export const selectPlayers = (state) => state.players.players;
export const selectCurrentTurn = (state) => state.turn.currentTurn;
export const selectCurrentPlayer = (state) =>
  selectPlayers(state)[selectCurrentTurn(state)];
export const selectAlivePlayers = (state) =>
  selectPlayers(state).filter((player) => player.alive);
```

Then components can do:

```js
const currentPlayer = useSelector(selectCurrentPlayer);
```

## Design Principle 9: Improve Persistence

Current persistence writes all slices to localStorage after every action.

Better approach:

- Persist only selected slices.
- Debounce persistence if needed.
- Use a version number for stored state.
- Add safe parsing.

Example:

```js
{
  version: 1,
  state: {
    auth: {},
    game: {},
    players: {}
  }
}
```

When the state shape changes, the app can ignore or migrate old saved data.

## Design Principle 10: Testing Strategy

Start with tests for pure functions before testing React.

High-value tests:

- Creating players gives unique ids.
- Starting a game deals the correct number of cards.
- Coup costs 7 coins and removes one influence.
- Assassin costs 3 coins.
- Contessa blocks assassination.
- Captain cannot steal from a missing target.
- Winner is detected when one player remains alive.
- Turn skips eliminated players.

Recommended tools:

- Vitest for unit tests.
- React Testing Library for component behavior.
- ESLint for static checks.
- Prettier for formatting.

## Suggested Implementation Order

1. Add safe storage helpers.
2. Add selectors for current player and alive players.
3. Replace clickable action `div`s with buttons.
4. Replace prompts with UI target selection.
5. Create `domain/gameRules.js`.
6. Move Coup, Assassin, Captain, Duke, Ambassador rules into pure functions.
7. Centralize turn progression.
8. Store winner snapshot before cleanup.
9. Add unit tests for game rules.
10. Add protected route wrapper.

This order keeps the project working while improving one area at a time.
