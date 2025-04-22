import { Stack } from 'expo-router';
// import { useEffect } from 'react';
// import * as ScreenOrientation from 'expo-screen-orientation';
export default function Layout() {
  // useEffect(() => {
  //   const lockOrientation = async () => {
  //     try {
  //       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  //     } catch (error) {
  //       console.error("Erro ao bloquear orientação:", error);
  //     }
  //   };
  //   lockOrientation();
  //   return () => {
  //     ScreenOrientation.unlockAsync();
  //   };
  // }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}