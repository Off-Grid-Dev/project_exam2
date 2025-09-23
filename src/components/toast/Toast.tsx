import type { FC } from 'react';

type ToastProps = {
  type: string;
  text: string;
};

const Toast: FC<ToastProps> = ({ type, text }) => {
  let className;

  switch (type) {
    case 'success': {
      className = '';
      break;
    }
    case 'warning': {
      className = '';
      break;
    }
    case 'info': {
      className = '';
      break;
    }
  }

  return (
    <div className={className}>
      <span>{text}</span>
    </div>
  );
};

export default Toast;
