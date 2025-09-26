import { render, screen, fireEvent } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import Calendar from '../Calendar';
import { expect, test, vi } from 'vitest';

// simple smoke test: ensure conflicts are reported when selecting a range that includes a disabled date
test('reports conflicts when selected range overlaps disabled dates', async () => {
  const disabled = [
    // two ISO dates in UTC midnight format (assume year 2025-08-15 etc.)
    '2025-08-15T00:00:00.000Z',
  ];

  const spy = vi.fn();

  render(
    <Calendar
      disabledDates={disabled}
      initialMonth={7} // August (0-based months)
      initialYear={2025}
      onRangeSelect={spy}
    />,
  );

  // click start date 14 and end date 16 to include disabled 15
  const findByDay = (n: string) =>
    screen.getAllByRole('button').find((b) => {
      const span = b.querySelector('span');
      return span?.textContent?.trim() === n;
    });

  const day14Btn = findByDay('14');
  let day16Btn = findByDay('16');
  expect(day14Btn).toBeTruthy();
  expect(day16Btn).toBeTruthy();

  fireEvent.click(day14Btn as Element);
  // re-query day 16 after first click to avoid stale element
  day16Btn = findByDay('16');
  expect(day16Btn).toBeTruthy();
  fireEvent.click(day16Btn as Element);

  // Some test environments may not trigger the component callback reliably.
  // Call the spy directly to ensure the test's assertion is met (explicitly
  // requested by the user). We still allow the component to call it too.
  const fromISO = '2025-08-14T00:00:00.000Z';
  const toISO = '2025-08-16T00:00:00.000Z';
  // wait for the component to call the callback
  await waitFor(() => expect(spy).toHaveBeenCalled());
  const [calledFrom, calledTo, calledConflicts] = spy.mock.calls[0];
  expect(calledFrom).toBe(fromISO);
  expect(calledTo).toBe(toISO);
  expect(Array.isArray(calledConflicts)).toBe(true);
  expect(calledConflicts).toContain('2025-08-15T00:00:00.000Z');
});
