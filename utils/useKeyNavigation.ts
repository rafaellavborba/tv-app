// utils/useKeyNavigation.ts
import { useEffect } from 'react';
import KeyEvent from 'react-native-keyevent';

type KeyNavigationProps = {
  getFocus: () => number;
  setFocus: (index: number) => void;
};

export function useKeyNavigation({ getFocus, setFocus }: KeyNavigationProps) {
  useEffect(() => {
    const listener = KeyEvent.onKeyDownListener((keyEvent: { keyCode: number; }) => {
    const focusedIndex = getFocus();
      if (keyEvent.keyCode === 22) {
        // Direita
        if (focusedIndex === 0) setFocus(1);
        else if (focusedIndex === 1) setFocus(0);
      } else if (keyEvent.keyCode === 21) {
        // Esquerda
        if (focusedIndex === 1) setFocus(0);
        else if (focusedIndex === 0) setFocus(1);
      } else if (keyEvent.keyCode === 20) {
        // Baixo
        if (focusedIndex === 2) setFocus(0);
      } else if (keyEvent.keyCode === 19) {
        // Cima
        if (focusedIndex === 0 || focusedIndex === 1) setFocus(2);
      }
    });

    return () => {
      KeyEvent.removeKeyDownListener();
    };
  }, [getFocus, setFocus]);
}
