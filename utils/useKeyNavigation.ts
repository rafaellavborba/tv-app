import { useEffect } from 'react';
import KeyEvent from 'react-native-keyevent';

type KeyNavigationProps = {
  getFocus: () => number;
  setFocus: (index: number) => void;
};

const keyCodes = {
  left: 21,
  right: 22,
  up: 19,
  down: 20,
  enter: 66,
};

export function useKeyNavigation({ getFocus, setFocus }: KeyNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (keyEvent: { keyCode: number }) => {
      const focusedIndex = getFocus();

      switch (keyEvent.keyCode) {
        case keyCodes.right:
          if (focusedIndex === 0) setFocus(1);
          else if (focusedIndex === 1) setFocus(0); 
          break;

        case keyCodes.left:
          if (focusedIndex === 1) setFocus(0);
          else if (focusedIndex === 0) setFocus(1);
          break;

        case keyCodes.up:
          if (focusedIndex === 0 || focusedIndex === 1) setFocus(2);
          break;

        case keyCodes.down:
          if (focusedIndex === 2) setFocus(0);
          break;
        default:
          break;
      }
    };

    KeyEvent.onKeyDownListener(handleKeyDown);

    return () => {
      KeyEvent.removeKeyDownListener();
    };
  }, [getFocus, setFocus]);
}
