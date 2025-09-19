import type { FC, MouseEventHandler } from 'react';

type ButtonProps = {
  label: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  additionalClasses?: string;
  onclick?: MouseEventHandler<HTMLButtonElement>;
};

const Button: FC<ButtonProps> = ({
  label,
  type,
  additionalClasses,
  onclick,
}) => {
  return (
    <button
      type={type}
      className={`bg-button-primary hover:bg-button-primary-hover text-text-base border-button-primary hover:text-text-dark cursor-pointer rounded-sm border-2 px-4 py-2 ${additionalClasses}`}
      onClick={onclick}
    >
      {label}
    </button>
  );
};

export default Button;
