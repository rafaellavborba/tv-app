import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableHighlight , 
  StyleSheet, 
  Linking, 
  Alert, 
  ImageBackground, 
  Image,
  findNodeHandle,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import ModalPassword from '@/components/ModalPassword';
import { useDispatch } from "react-redux";
import { fetchImages, fetchVideos } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useMedias } from '@/hooks/useMedias';
import TypingLoop from '@/hooks/TypingLoop';
// import {Animated} from 'react-native'
import { Button } from '@/components/ui/Button';
import { AccessibilityInfo } from 'react-native';
import KeyEvent from 'react-native-keyevent';


export default function HomeScreen() {

  AccessibilityInfo.addEventListener('focusChanged', (isFocused) => {
    console.log('Focus changed:', isFocused);
  });
  const navigation = useNavigation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
    const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    KeyEvent.onKeyDownListener((keyEvent) => {
      if (keyEvent.keyCode === 22) {
        // Direita
        setFocusedIndex((prev) => (prev + 1) % 2);
      } else if (keyEvent.keyCode === 21) {
        // Esquerda
        setFocusedIndex((prev) => (prev - 1 + 2) % 2);
      } else if (keyEvent.keyCode === 23) {
        // Enter / OK
        if (focusedIndex === 0) {
          console.log('Play pressionado');
        } else {
          console.log('Suporte pressionado');
        }
      }
    });

    return () => KeyEvent.removeKeyDownListener();
  }, [focusedIndex]);
  const {
    loading,  
    setLoading, 
    syncAndCleanMedia, 
  } = useMedias()


  // const handleOpenPasswordModal = () => {
  //   setShowPasswordModal(true);
  // };


  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        const imageRes = await dispatch(fetchImages());
        const videoRes = await dispatch(fetchVideos());
        const allUrls = [
          ...imageRes.payload.map((img: any) => img.url),
          ...videoRes.payload.map((vid: any) => vid.url)
        ];
        const localUris = await syncAndCleanMedia(allUrls);
        
      } catch (error) {
        console.error("Erro ao carregar mídias:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMedia();
  }, [dispatch]);

  const openAnyDesk = () => {
    const anydeskURL = 'anydesk://';
    Linking.canOpenURL(anydeskURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(anydeskURL);
        } else {
          Alert.alert('Erro', 'O aplicativo AnyDesk não está instalado.');
        }
      })
      .catch((err) => console.error('Erro ao abrir o AnyDesk:', err));
  };

  const navigateToProgram = () => {
    navigation.navigate('MediaScreen');
  };


  const playButtonRef = useRef(null);
  const supportButtonRef = useRef(null);

// const checkFocus = () => {
//     const focusedField = TextInput.State.currentlyFocusedField();
//     const playHandle = findNodeHandle(playButtonRef.current);
//     const supportHandle = findNodeHandle(supportButtonRef.current);
  
//   };

  // useEffect(() => {
  //   const interval = setInterval(checkFocus, 1000); 
  //   return () => clearInterval(interval);
  // }, []);
  return (
    <View style={styles.content}>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/images/fundo_login.jpg')} resizeMode="cover">
        {/* <TouchableHighlight  
          nativeID={"1"}
          nextFocusDown={2}
          nextFocusLeft={3}
          nextFocusRight={2}
          nextFocusUp={2}
          onPress={handleOpenPasswordModal}
          onFocus={() => setFocusedButton('logout')}
          
          accessibilityRole="button" 
          accessibilityLabel="Clique aqui para sair da aplicação"
        >
          <Image source={require('../assets/icon/logout.png')} style={styles.iconLogout} />
        </TouchableHighlight > */}
        <View style={styles.launcher}>
          <Text style={styles.title}>Bem-vindo a TV Borelli</Text>
          <View style={styles.buttons} focusable={true} onKeyDown={handleKeyDown}>
             <Button
               ref={playButtonRef}
                onPress={navigateToProgram}
                label="Iniciar Programação"
                image={require('../assets/icon/button_play.png')}
                hasTVPreferredFocus={true}
                style={[styles.button, styles.firstButton]}
              />
              <Button
                ref={supportButtonRef}
                label="Suporte"
                onPress={openAnyDesk}
                image={require('../assets/icon/support.png')}
                style={[styles.button]}
              />
          </View>
        </View>
        <Image source={require('../assets/icon/borelli.png')} style={styles.logoIcon} resizeMode="cover"  />
        {(loading && <TypingLoop style={styles.loadingMedias} />
        ) }
      </ImageBackground>
      {/* {showPasswordModal 
        ? (<ModalPassword showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}/> ) 
        : null
      } */}
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative'
  },
  launcher: {
    padding: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    minHeight: '60%',
    borderRadius: 30,
    opacity: 1
 },
content: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
title: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#384c29',
  // textShadow property removed; use textShadowColor, textShadowOffset, textShadowRadius if needed
},
buttonFocus: {
  elevation: 5,
  opacity: 1
},
button: {
  backgroundColor: '#836977',
  padding: 15,
  borderRadius: 30,
  marginBottom: 20,
  width: '49%',
  height: 200,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 4,
  opacity: 0.5
},
firstButton: {
  marginRight: 32
},
logoutButton: {
  position: 'absolute',
  top: 40,
  left: 40
},
iconLogout: {
  height: 42,
  width: 42
},
buttons:{
  marginTop:60,
  flexDirection: 'row',
  width: '95%',
  height: 'auto',
  alignItems: 'center',
  justifyContent: 'center'
},
logoIcon: {
  position: 'absolute',
  bottom: 40,
  right: 40,
  height: 100,
  width: 100,
  // overflow property removed to avoid type error with ImageStyle
},
loadingMedias: {
  position: 'absolute',
  bottom: 40,
  color: '#836977',
  fontWeight: 'bold',
},

container: {
  // position: 'fixed', // Not supported in React Native
  position: 'absolute',
  padding: 20,
  width: 280,
  fontWeight: 'bold',
  bottom: 100
},
});