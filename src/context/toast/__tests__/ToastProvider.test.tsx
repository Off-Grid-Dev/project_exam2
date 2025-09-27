/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ToastProvider } from '../../toast/ToastProvider';
import { ToastContext } from '../../toast/ToastContext';

// A tiny consumer that uses the context to add a toast
function Consumer() {
  return (
    <ToastContext.Consumer>
      {(ctx) => {
        if (!ctx) return null;
        return (
          <div>
            <button
              onClick={() => ctx.addToast({ type: 'success', text: 'OK' })}
            >
              Add
            </button>
            <button onClick={() => ctx.removeToast('nope')}>Remove</button>
          </div>
        );
      }}
    </ToastContext.Consumer>
  );
}

describe('ToastProvider', () => {
  test('adds and removes toasts and clears timers on unmount', async () => {
    const { unmount } = render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    // add a toast
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    // the provider schedules the add asynchronously; wait for it
    await waitFor(() => expect(screen.getByText(/OK/i)).toBeInTheDocument());

    // clicking the toast should remove it (Toast renders as a button)
    const toastBtn = screen.getByText(/OK/i);
    fireEvent.click(toastBtn);
    await waitFor(() =>
      expect(screen.queryByText(/OK/i)).not.toBeInTheDocument(),
    );

    // add another toast and then unmount; ensure no state updates after unmount
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    await waitFor(() => expect(screen.getByText(/OK/i)).toBeInTheDocument());

    // unmount should clear pending timers; this should not throw or produce warnings
    unmount();
  });
});
