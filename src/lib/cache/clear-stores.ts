/**
 * Clears all Zustand store data from localStorage.
 * Call this on login/logout to ensure fresh data from the server.
 */
export function clearStoreCache(): void {
  if (typeof window === 'undefined') return;

  const storeKeys = [
    'myplanforsuccess:section-one',
    'myplanforsuccess:section-two',
    'myplanforsuccess:section-three',
    'myplanforsuccess:section-four',
    'myplanforsuccess:section-five',
  ];

  storeKeys.forEach((key) => {
    localStorage.removeItem(key);
  });
}
