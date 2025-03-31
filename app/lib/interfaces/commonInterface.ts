export interface inputComponetI {
    placeholder: string;
    name: string;
    type: string;
    autoComplete?: string;
    id: string;
    className?: string;
    onChange: (value: string) => void;
    value?: string;
    error?: boolean;
    helperText?: string;
  }

export interface selectComponentI {
    label: string | undefined;
    id: string;
    value: string | number | readonly string[] | undefined;
    onChange: (value: string | number | readonly string[] | undefined) => void;
    options: {
      value: string | number | readonly string[] | undefined;
      label: string;
      disabled?: boolean;
    }[];
    className?: string;
    error?: boolean;
    helperText?: string;
    minWidth?: string;
    variant?: 'standard' | 'outlined' | 'filled';
  }

export interface textFieldAdornmentI {
    id: string;
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    variant?: 'standard' | 'outlined' | 'filled';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    maxRows?: number;
  }