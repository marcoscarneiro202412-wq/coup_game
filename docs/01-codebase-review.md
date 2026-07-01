# Codebase Review

This review focuses on correctness, maintainability, architecture, testing, and learning value. The project is a React + Vite + Redux Toolkit implementation of a local Coup-inspired card game.

## Review Summary

The project has a good educational foundation: it uses React components, Redux Toolkit slices, listener middleware, CSS modules, routing, and persistent state. Those are useful concepts for a student project.

The biggest improvement area is separation of responsibilities. Right now the game rules, browser UI dialogs, API requests, localStorage persistence, turn progression, and winner handling are spread across reducers and middleware. This makes bugs hard to find because one user click can trigger several indirect state changes.

The most important next step is to make the game logic deterministic and testable. A good target design is:

- Components render UI and dispatch user intentions.
- Reducers update state only.
- Pure game-rule functions decide what should happen.
- Middleware handles side effects such as API calls and persistence.
- UI pages handle prompts, forms, and navigation.

## Blocking / High Priority Issues

### 1. Game rules can crash when selected players do not exist

Evidence:

- `playerInteractMiddleware` asks for a target name using `prompt`, then immediately reads `playerTarget.characters` without always checking that `playerTarget` exists: [src/middleware/playerInteractMiddleware.js](../src/middleware/playerInteractMiddleware.js:34)
- `confront` assumes both players exist: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:123)
- `coupDEtat` finds indexes, then uses `.at(enemy)` without validating the index: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:164)

Why this matters:

If the user types a wrong name, cancels the prompt, or a stale id is dispatched, the game can throw an error and stop rendering. Student projects often work on the happy path, but robust applications need to handle wrong input gracefully.

Suggested improvement:

- Replace free-text `prompt` target selection with a controlled `<select>` or modal listing valid players.
- Validate every action before mutating state.
- Return a clear error message in Redux state instead of using `alert`.

Example design:

```js
const target = selectPlayerById(state, targetId);
if (!target) {
  return { ok: false, message: "Target player does not exist." };
}
```

### 2. Middleware performs UI work with `prompt` and `alert`

Evidence:

- `playerInteractMiddleware` uses `prompt` and `alert`: [src/middleware/playerInteractMiddleware.js](../src/middleware/playerInteractMiddleware.js:32)
- `Actions.jsx` also uses `prompt`: [src/components/Actions.jsx](../src/components/Actions.jsx:26)

Why this matters:

Middleware should not control the browser UI. Redux middleware is better for side effects like API calls, analytics, persistence, or async coordination. Browser dialogs make the logic difficult to test and create a poor user experience on mobile.

Suggested improvement:

- Move target selection into React components.
- Use Redux state to store the selected target and action result.
- Render confirmation/error messages in the UI.

Better flow:

1. User clicks "Assassinate".
2. UI opens a target picker.
3. User selects a valid target.
4. Component dispatches `assassinate({ attackerId, targetId })`.
5. Reducer or game service applies the rule.

### 3. Reducers contain too many game-rule side effects and inconsistent validation

Evidence:

- `declareCharacter` both declares a character and directly gives Duke money or changes Ambassador cards: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:77)
- `coupDEtat` mutates money, HP, alive state, and character cards in one reducer: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:156)
- `bargain` uses random card generation inside the reducer: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:181)

Why this matters:

Redux Toolkit allows "mutating" syntax through Immer, so direct state changes are fine. The issue is not mutation syntax. The issue is that the reducers contain multiple responsibilities and random behavior, making it hard to test exact outcomes.

Suggested improvement:

- Create pure helper functions under `src/domain/gameRules.js`.
- Keep reducers small: "apply result to state".
- Inject randomness outside reducers or pass selected card ids in the action payload.

Example:

```js
const result = resolveCoup(state, { actorId, targetId });
if (!result.ok) return;
applyGameResult(state, result);
```

### 4. Turn progression is indirect and fragile

Evidence:

- `nextTurnMiddleware` advances the turn for a list of action names: [src/middleware/nextTurnMiddleware.js](../src/middleware/nextTurnMiddleware.js:7)
- `hpListenerMiddleware` removes dead players and may redefine the turn after HP changes: [src/middleware/hpListenerMiddleware.js](../src/middleware/hpListenerMiddleware.js:9)
- `playerInteractMiddleware` may also dispatch `defineTurn`: [src/middleware/playerInteractMiddleware.js](../src/middleware/playerInteractMiddleware.js:37)

Why this matters:

The turn can change because of several different middleware files. This makes it hard to answer "who plays next?" after a player dies, a challenge succeeds, or an action is blocked.

Suggested improvement:

- Use one central turn engine.
- After every valid action, call one function that receives current players, current turn, and action result.
- Prefer keeping eliminated players in the list with `alive: false` instead of removing them. Removing players changes indexes and makes turn math harder.

### 5. Winner flow conflicts with state cleanup

Evidence:

- `finalizeGame` stores the winner id in game state: [src/features/game/gameSlice.js](../src/features/game/gameSlice.js:10)
- `finalizeGameMiddleware` immediately cleans players and resets game in localStorage: [src/middleware/finalizeGameMiddleware.js](../src/middleware/finalizeGameMiddleware.js:45)
- `Winner.jsx` looks up the winner inside `players.players`: [src/pages/Winner.jsx](../src/pages/Winner.jsx:10)

Why this matters:

The winner screen depends on player data still being available. But the finalize middleware clears the players. This can cause the winner page to redirect home instead of showing the winner.

Suggested improvement:

- Store a complete winner snapshot in `game.winner`, not just the id.
- Do not clear game state until the user clicks "New Game" or "Back Home".
- Save history separately from display state.

Example state:

```js
winner: {
  id: 3,
  name: "Marcos",
  avatar: "...",
  rounds: 5
}
```

### 6. Authentication and route protection are incomplete

Evidence:

- `/history` is public in the router, and the page redirects only after loading: [src/App.jsx](../src/App.jsx:16)
- `/game/play` is accessible by URL if there are players, regardless of auth state: [src/App.jsx](../src/App.jsx:29)
- `RegisterPlayers` checks auth locally: [src/pages/RegisterPlayers.jsx](../src/pages/RegisterPlayers.jsx:20)
- `Goal.md` describes a `ProtectedRoute`, but it does not exist in the source tree.

Why this matters:

Authorization is easier to maintain when it is centralized. If every page protects itself manually, one route is easy to forget.

Suggested improvement:

- Create a `ProtectedRoute` component.
- Wrap all authenticated routes in that component.
- Redirect unauthenticated users to `/login`, not `/`.

### 7. Remote API calls have no network error handling

Evidence:

- `authMiddleware` calls `fetch` but does not use `try/catch`: [src/middleware/authMiddleware.js](../src/middleware/authMiddleware.js:19)
- `finalizeGameMiddleware` posts match history without checking `res.ok`: [src/middleware/finalizeGameMiddleware.js](../src/middleware/finalizeGameMiddleware.js:16)

Why this matters:

If the API is offline, slow, or returns invalid JSON, the app can get stuck in a loading state or throw an unhandled error.

Suggested improvement:

- Wrap API calls in `try/catch`.
- Check `res.ok` before parsing or trusting data.
- Store a user-friendly error message in Redux.
- Consider moving API code to `src/services/authApi.js` and `src/services/historyApi.js`.

## Medium Priority Issues

### 8. LocalStorage parsing can crash app startup

Evidence:

- `playerSlice` parses localStorage directly at module load: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:4)
- Other slices do the same for `auth`, `game`, and `turn`.

Why this matters:

If localStorage contains invalid JSON, the app can fail before React renders. This happens often during development when state shape changes.

Suggested improvement:

- Create a `safeLoadState(key, fallback)` helper.
- Validate that loaded state has the expected shape.
- Provide a "Reset game data" action.

### 9. Action buttons use a `disabled` attribute on a `div`

Evidence:

- `Action.jsx` renders a `<div disabled={...}>`: [src/components/Action.jsx](../src/components/Action.jsx:8)

Why this matters:

`disabled` does not work on `div`. Users can still click it, keyboard users cannot activate it properly, and screen readers do not understand it as a button.

Suggested improvement:

- Use a real `<button>`.
- Add `disabled={money < cost || disabled}`.
- Style the button to look like a card.

### 10. History delete button condition is reversed

Evidence:

- The button is disabled when `isLoading` is true: [src/pages/History.jsx](../src/pages/History.jsx:29)
- The click handler returns when `!isLoading`: [src/pages/History.jsx](../src/pages/History.jsx:41)

Why this matters:

The delete action will not run when the app is not loading, which is the normal clickable state.

Suggested improvement:

Use this condition:

```js
if (isLoading) return;
dispatch(deleteHistory(...));
```

### 11. Player ids are generated from array length

Evidence:

- `createPlayer` uses `state.players.length + 1`: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:25)

Why this matters:

If a player is removed and a new one is created, ids can repeat. Repeated ids break React keys, target selection, and game logic.

Suggested improvement:

- Use `crypto.randomUUID()` for ids.
- Or keep `nextPlayerId` in state and increment it.

### 12. Challenge logic appears incorrect

Evidence:

- `confront` checks `confrontedPlayer.declaredCharacter.id`, but `declaredCharacter` is stored as a string: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:91)
- The same reducer then checks `.includes(confrontedPlayer.declaredCharacter)`: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:132)

Why this matters:

The first check mixes object and string shapes. That suggests the code changed during development but the challenge logic was not fully updated.

Suggested improvement:

- Decide whether `declaredCharacter` is a string id or a full character object.
- Use one shape everywhere. A string id is simpler.
- Add tests for "truthful declaration" and "bluff declaration".

### 13. Card distribution does not match the planned game

Evidence:

- `Goal.md` says there will be 12 characters in 4 groups of 3.
- `src/data/characters.js` currently defines 5 characters.
- `generateCharacterForPlayers` gives each player one character and removes each card from a single list: [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:36)

Why this matters:

Coup usually has duplicate influence cards. A single copy of each role makes the game impossible for more than five players and changes the bluffing strategy.

Suggested improvement:

- Define the deck separately from character definitions.
- Example: `characters` describe roles; `deck` contains multiple cards.
- Shuffle the deck once at game start.

### 14. Dependencies include unused or suspicious packages

Evidence:

- `package.json` includes `redux`, `redux-thunk`, `thunk`, and `mui` in addition to Redux Toolkit and MUI Material: [package.json](../package.json:12)

Why this matters:

Extra dependencies increase install time, bundle size, and confusion. Redux Toolkit already includes thunk middleware by default.

Suggested improvement:

- Keep `@reduxjs/toolkit` and `react-redux`.
- Remove direct `redux`, `redux-thunk`, `thunk`, and `mui` unless they are truly used.
- Verify the correct MUI package versions for the React version used.

## Low Priority / Cleanliness Issues

### 15. Console logs should not remain in production code

Evidence:

- Several files contain `console.log`, including [src/features/players/playerSlice.js](../src/features/players/playerSlice.js:40), [src/middleware/authMiddleware.js](../src/middleware/authMiddleware.js:18), and [src/pages/History.jsx](../src/pages/History.jsx:19).

Suggested improvement:

- Remove debugging logs.
- If logging is needed, create a small logger that can be disabled in production.

### 16. Inline styles make design harder to maintain

Evidence:

- `AuthPage.jsx`, `Game.jsx`, `RegisterPlayers.jsx`, and `History.jsx` contain repeated inline styles.

Why this matters:

Inline styles are harder to reuse and do not support media queries or shared design tokens well.

Suggested improvement:

- Move styles into CSS modules.
- Create shared classes for buttons, form fields, error text, and layout containers.

### 17. Repeated labels and ids hurt accessibility

Evidence:

- `Declare.jsx` and `Confront.jsx` both use `demo-simple-select-label` and `label="Age"`: [src/components/Declare.jsx](../src/components/Declare.jsx:16), [src/components/Confront.jsx](../src/components/Confront.jsx:16)

Suggested improvement:

- Use unique ids.
- Use meaningful labels: "Character" and "Player".

### 18. Some components use array indexes as keys

Evidence:

- `RegisterPlayers.jsx` uses `key={i}`: [src/pages/RegisterPlayers.jsx](../src/pages/RegisterPlayers.jsx:28)
- `Actions.jsx` uses `key={i}`: [src/components/Actions.jsx](../src/components/Actions.jsx:65)

Suggested improvement:

- Use stable ids or names: `key={p.id}` and `key={a.name}`.

## Verification Notes

I attempted to run:

```bash
npm run lint
```

It failed because local dependencies are not installed:

```text
'eslint' is not recognized as an internal or external command
```

Recommended setup step:

```bash
npm install
npm run lint
npm run build
```

After dependencies are installed, lint and build should be the first automated checks.
