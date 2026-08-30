export function getSafeNextPath(value: string | null | undefined, fallback = '/account') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}
