const usernamePattern = /^[a-z0-9][a-z0-9_]{2,19}$/;

const reservedUsernames = new Set([
  "admin",
  "administrator",
  "codetrail",
  "help",
  "moderator",
  "root",
  "security",
  "staff",
  "support",
  "system",
]);

export function normalizeUsername(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export function getUsernameError(value: string) {
  const username = normalizeUsername(value);

  if (!username) return null;

  if (!usernamePattern.test(username)) {
    return "Username must be 3–20 characters and use only lowercase letters, numbers, or underscores.";
  }

  if (reservedUsernames.has(username)) {
    return "That username is reserved. Choose another one.";
  }

  return null;
}
