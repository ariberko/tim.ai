export function getSupabaseConfigError(url?: string, anonKey?: string): string | null {
  if (!url?.trim() || !anonKey?.trim()) {
    return 'The Supabase project URL and public API key have not been configured.';
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Unsupported protocol');
    }
  } catch {
    return 'The Supabase project URL must be a valid HTTP or HTTPS address.';
  }

  return null;
}
