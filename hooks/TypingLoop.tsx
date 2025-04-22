import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
const TypingLoop = ({
  text = "Carregando mídias",
  speed = 60,
  delay = 80,
  style
}: any)  => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    let typingInterval: any;
    if (currentIndex < text.length) {
      typingInterval = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
    } else {
      // Quando terminar de digitar tudo, espera um tempo e reinicia
      typingInterval = setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
      }, delay);
    }
    return () => clearTimeout(typingInterval);
  }, [currentIndex, text, speed, delay]);
  return <Text style={style}>{displayedText}</Text>;
}
export default TypingLoop