// helpers.js

// Turns an ISO date into "2h ago", "Yesterday", or a real date for older posts
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatJoinDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// Converts a File (from an <input type="file">) into a base64 data URL
// so it can be stored directly inside a localStorage JSON object.
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

// Simple initials fallback for avatars, e.g. "Amna Khan" -> "A"
export function getInitial(name) {
  return name?.trim()?.charAt(0)?.toUpperCase() || '?';
}

// Deterministic-ish color from a name, so the same user always gets the same
// fallback avatar background instead of a random color on every render.
const AVATAR_PALETTE = ['#1FB88A', '#F2607D', '#3FD9AC', '#0F7A5C', '#8B95A1'];
export function getAvatarColor(name) {
  if (!name) return AVATAR_PALETTE[0];
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
}
