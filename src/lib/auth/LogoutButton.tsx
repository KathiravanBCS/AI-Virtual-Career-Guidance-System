import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { signOut } from 'firebase/auth';

import { auth } from '@/config/firebaseConfig';

export function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      notifications.show({
        title: 'Logout Failed',
        message: error.message,
        color: 'red',
      });
    }
  };

  return (
    <Button onClick={handleLogout} variant="subtle">
      Sign Out
    </Button>
  );
}
