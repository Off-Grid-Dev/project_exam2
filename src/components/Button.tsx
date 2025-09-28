// React imports
import type { FC, MouseEventHandler, ReactNode } from 'react';

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  type?: 'submit' | 'reset' | 'button';
  additionalClasses?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const Button: FC<ButtonProps> = ({
  label,
  children,
  type = 'button',
  additionalClasses = '',
  disabled = false,
  onClick,
}) => {
  const baseClasses =
    'rounded-sm border-2 px-4 py-2 text-[10px] sm:text-md whitespace-nowrap';
  const classes = disabled
    ? `bg-button-disabled cursor-not-allowed text-text-disabled ${additionalClasses}`
    : `bg-button-primary hover:bg-button-primary-hover text-text-base border-button-primary hover:text-text-dark cursor-pointer ${additionalClasses}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${classes}`}
      onClick={onClick}
      aria-disabled={disabled}
    >
      {children ?? label}
    </button>
  );
};

export default Button;
