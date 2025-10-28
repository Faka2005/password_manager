
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

type BasicsAlertsProps = {
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
};

export default function BasicAlerts({type,message}:BasicsAlertsProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert severity={type}>{message}</Alert>
    </Stack>
  );
}