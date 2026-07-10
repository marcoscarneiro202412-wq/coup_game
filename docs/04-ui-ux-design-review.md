# UI and UX Design Review

This document focuses on the visual and interaction design of the app.

## Current Strengths

- The app has a clear game theme.
- Pages use CSS modules, which is a good organization choice.
- The project has reusable components such as `NavBar`, `Player`, `Actions`, `CardPlayer`, and `User`.
- Character assets are stored in `public/assets`, which makes them easy to display.

## Main Design Issues

### 1. The UI uses browser prompts for important actions

Current behavior:

- Coup asks for a target with `prompt`.
- Assassin asks for a target with `prompt`.
- Captain asks for a target with `prompt`.

Why this hurts UX:

- The user must type names exactly.
- It is easy to make mistakes.
- It does not show which targets are valid.
- It is not mobile-friendly.
- It breaks the visual style of the app.

Recommended design:

- Show an action panel when a player chooses an action.
- List valid targets as buttons or cards.
- Disable invalid targets, such as the current player.
- Show the cost before confirming.

Example:

```text
Action: Coup D'Etat
Cost: 7 coins
Choose target:
[Ana] [Bruno] [Carla]
[Cancel] [Confirm]
```

### 2. Clickable cards should be buttons

Current behavior:

- `Action.jsx` uses a clickable `div`.

Why this hurts UX:

- Keyboard users cannot tab to it correctly.
- Screen readers do not announce it as a button.
- The `disabled` attribute does not work on `div`.

Recommended design:

- Use `<button type="button">`.
- Keep the card visual style through CSS.
- Add disabled styles for unavailable actions.

### 3. The app needs clearer action feedback

Current feedback:

- Some results are shown through `alert`.
- Some invalid actions silently return.
- Some console logs are used for debugging.

Recommended design:

- Add an in-game message area.
- Use consistent messages for success and failure.
- Keep recent messages in an action log.

Examples:

```text
Ana declared Duke and received 3 coins.
Bruno tried to assassinate Carla, but Contessa blocked it.
Carla cannot use Coup D'Etat because she has only 4 coins.
```

### 4. The visual layout relies on large fixed sizes

Evidence:

- Navigation title uses very large text.
- Some panels use fixed widths like `50%`, `45vw`, `26vw`, and fixed pixel spacing.
- Several border radii are very large.

Why this matters:

The app may look acceptable on one desktop size but break on smaller screens. A game should be comfortable on laptops and tablets.

Recommended design:

- Use responsive layout containers.
- Prefer `max-width` with `width: min(...)`.
- Use smaller consistent spacing tokens.
- Use media queries for narrow screens.

Example:

```css
.panel {
  width: min(100% - 2rem, 720px);
  margin-inline: auto;
}
```

### 5. The design needs a shared system

Current design:

- Many files repeat similar colors.
- Buttons have different shapes.
- Inline styles duplicate CSS.

Recommended design tokens:

```css
:root {
  --color-bg: #0d1323;
  --color-surface: #171e35;
  --color-surface-2: #232a3d;
  --color-text: #ffffff;
  --color-muted: #d7dce8;
  --color-accent: #d4af37;
  --radius-sm: 6px;
  --radius-md: 10px;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
}
```

Why this helps:

- The app looks more consistent.
- Future changes are easier.
- Students learn scalable CSS habits.

### 6. Forms need better validation states

Current behavior:

- Auth fields turn red when there is any error.
- Player registration prevents duplicate names with an alert.

Recommended design:

- Show errors below the relevant field.
- Trim player names before checking duplicates.
- Disable submit only when needed.
- Show loading state inside the submit button.

Example validation:

```text
Name is required.
This player name already exists.
Avatar URL is optional.
```

### 7. Navigation should reflect authentication

Current behavior:

- `NavBar` always shows Login and History.

Recommended behavior:

- If logged out: show Home and Login.
- If logged in: show Home, History, Game, Logout/User.
- Protect History behind authentication.

### 8. The winner screen should use real winner data

Current behavior:

- Winner page displays a hardcoded image URL.

Recommended design:

- Use the winner avatar.
- Show rounds played.
- Show final player standings.
- Offer "New Game" and "Back Home".

Example:

```text
Winner: Ana
Rounds: 6
Final coins: 4
Remaining influence: Duke
```

### 9. Character visibility should be clearer

Current behavior:

- Current player can toggle character visibility.
- The text says "Nao Mostrar Personagens" when visible.

Recommended design:

- Use a button with two clear states:
  - "Hide Cards"
  - "Show Cards"
- Consider showing cards only after a "hold to reveal" interaction for local multiplayer privacy.

### 10. Add a game board layout

Current screen is mostly vertical panels.

Recommended game screen:

```text
Top bar:
  round, current player, logout/user

Main board:
  current player panel
  action panel
  target selection panel

Side or bottom:
  all players
  action log
```

This layout separates:

- Who is playing.
- What actions are possible.
- Who can be targeted.
- What happened recently.

## Accessibility Improvements

- Use real buttons for all clickable actions.
- Add `alt` text for every image.
- Avoid relying only on color to show errors.
- Use visible focus states.
- Keep form labels connected to inputs.
- Avoid duplicate ids.
- Use semantic headings in order.

## Suggested UI Component List

Reusable components to create:

- `Button`
- `Panel`
- `FormField`
- `ErrorMessage`
- `PlayerCard`
- `TargetPicker`
- `ActionLog`
- `GameStatusBar`
- `ProtectedRoute`

These do not need to be complex. Simple reusable components are enough.

## Student-Friendly Redesign Plan

1. Convert `Action.jsx` from `div` to `button`.
2. Move repeated inline styles into CSS modules.
3. Create a `TargetPicker` component.
4. Replace all `prompt` calls with `TargetPicker`.
5. Add an action result message to Redux state.
6. Render action results in the game screen.
7. Add responsive CSS for mobile and tablet widths.
8. Improve `NavBar` based on login state.
9. Improve winner screen with winner avatar and match summary.
10. Add an action log.
