# Student Learning Roadmap

This roadmap explains what to improve and what concept each improvement teaches.

## Level 1: Make the Existing App Safer

### Goal

Prevent common crashes and make the current app easier to use.

### Tasks

1. Add validation before reading target player data.
2. Replace `console.log` with useful UI messages.
3. Fix the history delete condition.
4. Replace clickable `div`s with real buttons.
5. Add `try/catch` around all API calls.
6. Add a safe localStorage parser.

### Concepts Learned

- Defensive programming
- Form validation
- Error handling
- Accessibility basics
- Browser storage safety

## Level 2: Clean Up Redux State

### Goal

Make Redux easier to understand.

### Tasks

1. Create selectors:
   - `selectPlayers`
   - `selectCurrentPlayer`
   - `selectAlivePlayers`
   - `selectWinner`
2. Store a full winner object instead of only a winner id.
3. Keep eliminated players in state with `alive: false`.
4. Add an `actionMessage` or `actionLog` field to game state.
5. Use stable ids for players.

### Concepts Learned

- Derived state
- Stable identity
- State shape design
- Debuggable UI state

## Level 3: Move Game Rules into Pure Functions

### Goal

Make Coup rules testable without React.

### Tasks

1. Create `src/domain/gameRules.js`.
2. Move Coup rule into a pure function.
3. Move Duke tax rule into a pure function.
4. Move Assassin rule into a pure function.
5. Move Captain steal rule into a pure function.
6. Move winner detection into a pure function.

### Concepts Learned

- Pure functions
- Unit testing
- Domain modeling
- Separating business logic from UI

## Level 4: Replace Prompts with UI

### Goal

Make the game feel like a real app instead of a prototype.

### Tasks

1. Create a `TargetPicker` component.
2. Let each action declare whether it needs a target.
3. Show valid targets visually.
4. Disable invalid targets.
5. Confirm actions before dispatching.
6. Show the result in the game screen.

### Concepts Learned

- Controlled UI state
- Component composition
- Better UX design
- Input validation

## Level 5: Improve Routing and Authentication

### Goal

Make navigation predictable and secure.

### Tasks

1. Create `ProtectedRoute.jsx`.
2. Protect `/game/*` and `/history`.
3. Redirect logged-out users to `/login`.
4. Show different navigation items for logged-in users.
5. Add logout to the nav or user menu.

### Concepts Learned

- Route guards
- Auth state
- Conditional rendering
- User flow design

## Level 6: Add Tests

### Goal

Make future changes safer.

### Recommended First Tests

1. `canCoup` returns false when player has fewer than 7 coins.
2. Coup removes 7 coins from actor and 1 influence from target.
3. Assassin requires 3 coins.
4. Contessa blocks assassination.
5. Captain cannot steal from missing target.
6. Turn skips eliminated players.
7. Winner is detected when only one player is alive.
8. Safe localStorage parser returns fallback on invalid JSON.

### Concepts Learned

- Unit tests
- Behavior-based testing
- Edge cases
- Refactoring with confidence

## Level 7: Improve Styling System

### Goal

Make the UI consistent and responsive.

### Tasks

1. Define CSS variables for colors, spacing, and radius.
2. Create reusable button styles.
3. Create reusable panel styles.
4. Replace large fixed widths with responsive layout rules.
5. Add media queries for smaller screens.
6. Remove repeated inline styles.

### Concepts Learned

- Design tokens
- Responsive design
- CSS maintainability
- Component styling

## Suggested Study Topics

### React

- Controlled forms
- Component composition
- Conditional rendering
- Lifting state up
- Error boundaries

### Redux Toolkit

- Slices
- Selectors
- Listener middleware
- Async thunks
- State normalization

### JavaScript

- Pure functions
- Array methods
- Object copying
- Error handling
- `crypto.randomUUID`

### Testing

- Vitest
- React Testing Library
- Arrange, Act, Assert
- Testing behavior instead of implementation details

### CSS

- Flexbox
- Grid
- CSS variables
- Responsive layouts
- Focus states

## Suggested Final Project Quality Checklist

Before considering the project complete, check:

- The game can be played from start to finish without console errors.
- Wrong target selection cannot crash the app.
- Every route behaves correctly when logged in and logged out.
- The winner screen always displays the correct winner.
- Actions explain why they are disabled.
- There are no leftover debug logs.
- Lint passes.
- Build passes.
- Core game rules have unit tests.
- UI works on mobile-width screens.

## Best Next Step

The best first refactor is to replace `prompt` target selection with a React target picker. It improves UX immediately and also forces the game logic to receive ids instead of free-text names, which prevents many bugs.
