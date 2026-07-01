export function safeLoadState(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (err) {
    console.error(err.message);
    return fallback;
  }
}
