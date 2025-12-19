/**
 * Collects a safe, non-PII device snapshot.
 * IP is NEVER collected here (server derives it).
 */
export function collectDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio,
    },

    memory: (navigator as any).deviceMemory ?? null,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
  };
}
