export const logEvent = (name: string, data?: unknown) => {
  // Simple console logger - replace with real analytics
  // eslint-disable-next-line no-console
  console.log('[analytics]', name, data);
};
