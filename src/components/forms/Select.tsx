import type { ChangeEvent, FC } from 'react';

type SelectProps = {
  ariaLabel: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
};

const Select: FC<SelectProps> = ({
  ariaLabel,
  value,
  onChange,
  name,
  options,
}) => {
  return (
    <>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        name={name}
        className='cursor-pointer'
      >
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Select;
