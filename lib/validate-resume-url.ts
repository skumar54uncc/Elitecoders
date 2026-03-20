/**
 * Job applications should only reference resumes uploaded to our Supabase public bucket
 * (prevents open redirects / malicious links in admin notification emails).
 */
export function isTrustedResumePublicUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      u.hostname.endsWith(".supabase.co") &&
      u.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
