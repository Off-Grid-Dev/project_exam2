import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
  it('renders label and responds to click when enabled', () => {
    const onClick = vi.fn();
    render(<Button label='Click me' type='button' onClick={onClick} />);
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const onClick = vi.fn();
    render(
      <Button label='Disabled' type='button' onClick={onClick} disabled />,
    );
    const btn = screen.getByRole('button', { name: /disabled/i });
    expect(btn).toBeTruthy();
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
