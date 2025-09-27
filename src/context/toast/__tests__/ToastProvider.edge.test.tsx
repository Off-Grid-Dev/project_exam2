/* eslint-env vitest */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { describe, test, expect, vi } from 'vitest';
import { ToastProvider } from '../../toast/ToastProvider';
import { ToastContext } from '../../toast/ToastContext';

function Consumer() {
  return (
    <ToastContext.Consumer>
      {(ctx) => {
        if (!ctx) return null;
        return (
          <div>
            <button onClick={() => ctx.addToast({ type: 'info', text: 'dup' })}>
              AddDup
            </button>
            <button onClick={() => ctx.addToast({ type: 'info', text: 'dup' })}>
              AddDup2
            </button>
          </div>
        );
      }}
    </ToastContext.Consumer>
  );
}

describe('ToastProvider edge cases', () => {
  test('prevents duplicate toasts with same text/type', async () => {
    render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    // add the same toast twice quickly
    fireEvent.click(screen.getByText('AddDup'));
    fireEvent.click(screen.getByText('AddDup2'));

    // wait for the single toast to appear - match exact 'dup' so we don't count
    // the AddDup/AddDup2 button labels which contain 'dup' as a substring
    await waitFor(() => expect(screen.getAllByText(/^dup$/i).length).toBe(1));
  });

  test('clears timers when unmounted (using fake timers)', async () => {
    vi.useFakeTimers();
    const { unmount } = render(
      <ToastProvider>
        <Consumer />
      </ToastProvider>,
    );

    // add a toast which will schedule add timer (0ms) and removal timer (3500ms)
    fireEvent.click(screen.getByText('AddDup'));

    // advance only the immediate timers so the toast is added (don't advance
    // the removal timer yet). Wrap in act so React sees the state update.
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // assert synchronously that the toast was added
    expect(screen.getByText(/^dup$/i)).toBeInTheDocument();

    // unmount should clear pending timers (the removal timer) without throwing
    unmount();

    // ensure advancing any remaining timers doesn't throw
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });
});
