const defaultAvatarSvg = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <rect width="160" height="160" rx="42" fill="#ffd9e5"/>
  <circle cx="80" cy="64" r="30" fill="#ff7fa3"/>
  <path d="M34 139c8-31 27-47 46-47s38 16 46 47" fill="#d94676"/>
  <circle cx="66" cy="62" r="5" fill="#fff8fb"/>
  <circle cx="94" cy="62" r="5" fill="#fff8fb"/>
  <path d="M66 78c9 9 19 9 28 0" stroke="#fff8fb" stroke-width="6" stroke-linecap="round" fill="none"/>
</svg>`);

export const DEFAULT_AVATAR_URL = `data:image/svg+xml;charset=UTF-8,${defaultAvatarSvg}`;

export const getAvatarUrl = (avatarUrl?: string | null) => {
  const trimmed = avatarUrl?.trim();
  if (!trimmed) return DEFAULT_AVATAR_URL;

  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
        return `${url.pathname}${url.search}${url.hash}`;
      }
    } catch {
      return trimmed;
    }

    return trimmed;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};
