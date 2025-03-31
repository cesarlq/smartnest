import React from 'react';
import { Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

interface StatusChipProps {
  status: 'pendiente' | 'completada' | undefined;
  className?: string;
}

// Chip personalizado con estilos específicos para cada estado
const CustomChip = styled(Chip)<{ status: 'pendiente' | 'completada' | undefined }>(({ status }) => ({
  ...(status === 'pendiente' && {
    color: 'var(--color-amber-700)',
    borderColor: 'var(--color-amber-200)',
    backgroundColor: 'var(--color-amber-50)',
  }),
  ...(status === 'completada' && {
    color: 'var(--color-green-700)',
    borderColor: 'var(--color-green-200)',
    backgroundColor: 'var(--color-green-50)',
  }),
}));

const StatusChipComponent: React.FC<StatusChipProps> = ({ status, className }) => {
  // Si no hay estado, no renderizar nada
  if (!status) return null;

  return (
    <Stack direction="row" spacing={1} className={className}>
      <CustomChip
        size="small"
        label={status}
        status={status}
        variant="outlined"
      />
    </Stack>
  );
};

export default StatusChipComponent;