import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Linking, 
  Alert, 
  ImageBackground, 
  Image,
  findNodeHandle,
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ModalPassword from '@/components/ModalPassword';
import { useDispatch } from "react-redux";
import { fetchImages, fetchVideos } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useMedias } from '@/hooks/useMedias';
import TypingLoop from '@/hooks/TypingLoop';
// import {Animated} from 'react-native'
import { Button } from '@/components/ui/Button';
import { AccessibilityInfo } from 'react-native';
import { BackHandler } from 'react-native';
import { useKeyNavigation } from '../utils/useKeyNavigation';
import { Platform } from 'react-native';
import { Pressable } from 'react-native';
import { useAppSelector } from '@/store/hooks';

export default function HomeScreen() {
  const playButtonRef = useRef<null | React.ElementRef<typeof Pressable>>(null);
  const supportButtonRef = useRef<null | React.ElementRef<typeof Pressable>>(null);
  const logoutButtonRef = useRef<null | React.ElementRef<typeof Pressable>>(null);
  const navigation = useNavigation();
  const { deviceState } = useAppSelector((state) => state.requests);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const focusRef = useRef(focusedIndex);
  focusRef.current = focusedIndex;
  useKeyNavigation({
    getFocus: () => focusRef.current,
    setFocus: setFocusedIndex
  });
  
 useFocusEffect(
    useCallback(() => {

      const onBackPress = () => {
        return true; 
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const {
    loading,  
    setLoading, 
    syncAndCleanMedia, 
  } = useMedias()

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        // const imageRes = await dispatch(fetchImages());
        const {payload} = await dispatch(fetchVideos());
        const allUrls = payload && typeof payload === 'string' ? JSON.parse(payload) : payload;
        if(allUrls?.length){
          await syncAndCleanMedia(allUrls);
        }
        
      } catch (error) {
        console.error("Erro ao carregar mídias:", error);
      } finally {
        setLoading(false);
      }
    };
    if(deviceState){
      loadMedia();
      
    }
    console.log("Estado do dispositivo:", deviceState);
  }, [deviceState]);

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

  const handlePressEnter = () => {
    switch (focusedIndex) {
      case 0:
        navigation.navigate('MediaScreen');
        break;
      case 1: 
        openAnyDesk()
        break;
      case 2:
        handleOpenPasswordModal()
      default:
        break;
    }
  }
  const focusElement = (ref: React.MutableRefObject<null>) => {
    const node = findNodeHandle(ref?.current);
    if (node) {
      AccessibilityInfo.setAccessibilityFocus(node);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (focusedIndex === 0) focusElement(playButtonRef);
      if (focusedIndex === 1) focusElement(supportButtonRef);
      if (focusedIndex === 2) focusElement(logoutButtonRef);
    }, 100); 
    return () => clearTimeout(timeout);
  }, [focusedIndex]);

  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      playButtonRef.current &&
      supportButtonRef.current &&
      logoutButtonRef.current
    ) {
      const playId = findNodeHandle(playButtonRef.current);
      const supportId = findNodeHandle(supportButtonRef.current);
      const logoutId = findNodeHandle(logoutButtonRef.current);

      playButtonRef.current.setNativeProps({
        nextFocusRight: supportId,
        nextFocusUp: logoutId,
      });

      supportButtonRef.current.setNativeProps({
        nextFocusLeft: playId,
        nextFocusUp: logoutId,
      });

      logoutButtonRef.current.setNativeProps({
        nextFocusDown: playId,
      });
    }
  }, []);

  useEffect(() => {
  if (focusedIndex === 0) {
    playButtonRef.current?.setNativeProps({
      style: {
        opacity: 1,
        elevation: 5
      },
    });
    supportButtonRef.current?.setNativeProps({
      style: {
        opacity: 0.5,
        elevation: 1
      }
    })
  } else {
    playButtonRef.current?.setNativeProps({
      style: {
        opacity: 0.5,
        elevation: 1
      },
    });
     supportButtonRef.current?.setNativeProps({
      style: {
        opacity: 1,
        elevation: 5
      }
    })
  }
}, [focusedIndex]);
  return (
    <View style={styles.content}>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/images/fundo_login.jpg')} resizeMode="cover">
        {/* <Button 
            ref={logoutButtonRef}
            onPress={handlePressEnter}
            label=''
            image={require('../assets/icon/logout.png')}
            hasTVPreferredFocus={false}
            style={[styles.logoutButton, focusedIndex === 2 && styles.buttonFocus]}
        /> */}
        <View style={styles.launcher}>
          <Text style={styles.title}>Bem-vindo a TV Borelli</Text>
          <View style={styles.buttons} focusable={true} >
             <Button
               ref={playButtonRef}
                onPress={handlePressEnter}
                label="Iniciar Programação"
                image={require('../assets/icon/button_play.png')}
                hasTVPreferredFocus={true}
                style={[styles.button, styles.firstButton, focusedIndex === 0 && styles.buttonFocus, ]}
              />
              <Button
                onPress={handlePressEnter}
                ref={supportButtonRef}
                label="Suporte"
                image={require('../assets/icon/support.png')}
                style={[styles.button, focusedIndex === 1 && styles.buttonFocus]}
                hasTVPreferredFocus={false}
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
  left: 40,
  opacity: 0.5
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
},
loadingMedias: {
  position: 'absolute',
  bottom: 40,
  color: '#836977',
  fontWeight: 'bold',
},

container: {
  position: 'absolute',
  padding: 20,
  width: 280,
  fontWeight: 'bold',
  bottom: 100
},
});