import React from 'react';
import { Checkbox, CheckboxProps } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

interface CustomCheckboxProps extends Omit<CheckboxProps, 'checkedIcon' | 'icon'> {
  className?: string;
}

const CheckboxComponent: React.FC<CustomCheckboxProps> = ({ className, ...props }) => {
  const label = { inputProps: { 'aria-label': 'Checkbox' } };

  return (
    <Checkbox
      {...label}
      {...props}
      className={className}
      icon={<FontAwesomeIcon className='w-[1.2rem] text-gray-300' icon={faCircle} />}
      checkedIcon={<FontAwesomeIcon className='w-[1.2rem] text-[var(--colorSmartNest)]' icon={faCircleCheck} />}
      sx={{
        '&.Mui-checked': {
          color: 'var(--colorSmartNest)',
        },
        ...props.sx
      }}
    />
  );
};

export default CheckboxComponent;