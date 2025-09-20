import type { FC, MouseEventHandler } from 'react';

type ButtonProps = {
  label: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  additionalClasses?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

const Button: FC<ButtonProps> = ({
  label,
  type,
  additionalClasses,
  disabled,
  onClick,
}) => {
  const baseClasses = 'rounded-sm border-2 px-4 py-2';
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
      {label}
    </button>
  );
};

export default Button;
