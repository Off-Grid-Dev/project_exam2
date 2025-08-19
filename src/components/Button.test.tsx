import { expect, test } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { vi } from 'vitest';

test('Button renders and handles click', () => {
  const handleClick = vi.fn(); // Create a mock function for the click handler

  render(<Button onClick={handleClick}>Click Me HARDER</Button>);

  // Assert that the button is rendered with the correct text
  expect(screen.getByText('Click Me HARDER')).toBeInTheDocument();

  // Simulate a click event
  fireEvent.click(screen.getByText('Click Me HARDER'));

  // Assert that the click handler was called
  expect(handleClick).toHaveBeenCalledTimes(1);
});
