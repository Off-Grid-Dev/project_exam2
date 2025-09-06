import '@testing-library/jest-dom';
import { afterEach } from 'vitest';

// Clean up after each test
afterEach(() => {
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Reset any global DOM state if needed
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});
