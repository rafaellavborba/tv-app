import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  Alert, 
  ImageBackground, 
  Image,
  findNodeHandle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// import ModalPassword from '@/components/ModalPassword';
import { useDispatch } from "react-redux";
import { fetchImages, fetchVideos } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useMedias } from '@/hooks/useMedias';
import TypingLoop from '@/hooks/TypingLoop';
// import {Animated} from 'react-native'

export default function HomeScreen() {
  const [focusedButton, setFocusedButton] = useState(null);
  const navigation = useNavigation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {mediaList, 
    currentIndex, 
    loading, 
    setCurrentIndex, 
    setLoading, 
    setMediaList, 
    syncAndCleanMedia, 
    getAllSavedMedia, 
    downloadProgress 
  } = useMedias()

  useEffect(() => {
    setFocusedButton('play');
  }, []);

  // const handleOpenPasswordModal = () => {
  //   setShowPasswordModal(true);
  // };
  // const progressAnim = useState(new Animated.Value(0))[0];

  // useEffect(() => {
  //     Animated.timing(progressAnim, {
  //         toValue: downloadProgress,
  //         duration: 100,
  //         useNativeDriver: false,
  //     }).start();
  // }, [downloadProgress]);

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


  return (
    <View style={styles.content}>
      <ImageBackground style={styles.backgroundImage} source={require('../assets/images/fundo_login.jpg')} resizeMode="cover">
        {/* <TouchableOpacity 
          nativeID={"1"}
          nextFocusDown={2}
          nextFocusLeft={3}
          nextFocusRight={2}
          nextFocusUp={2}
          onPress={handleOpenPasswordModal}
          onFocus={() => setFocusedButton('logout')}
          style={[styles.logoutButton, focusedButton === 'logout' && styles.buttonFocus]} 
          accessibilityRole="button" 
          accessibilityLabel="Clique aqui para sair da aplicação"
        >
          <Image source={require('../assets/icon/logout.png')} style={styles.iconLogout} />
        </TouchableOpacity> */}
        <View style={styles.launcher}>
          <Text style={styles.title}>Bem-vindo a TV Borelli</Text>
          <View style={styles.buttons}>
            
            <TouchableOpacity 
              style={[styles.button, styles.firstButton, focusedButton === 'play' && styles.buttonFocus]} 
              onPress={navigateToProgram} 
              onFocus={() => setFocusedButton('play')}
              hasTVPreferredFocus={true}
              disabled={loading}
            >
              <Image 
                source={require('../assets/icon/button_play.png')} 
                style={styles.buttonIcon} 
                accessibilityLabel="Iniciar a produção"
              />
              <Text style={styles.buttonText}>Iniciar Programação</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, focusedButton === 'support' && styles.buttonFocus]} 
              onPress={openAnyDesk} 
              onFocus={() => setFocusedButton('support')}
            >
              <Image 
                source={require('../assets/icon/support.png')} 
                style={styles.buttonIcon} 
                resizeMode="contain" 
                accessibilityLabel="Clique aqui para acessar o suporte"
              />
              <Text style={styles.buttonText}>Suporte</Text>
            </TouchableOpacity>
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
  maxHeight: '100vh',
  maxWidth: '100vw',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
title: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#384c29',
  textShadow: 'color offsetX offsetY blurRadius',
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
firstButton: {
  marginRight: 32
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
buttonIcon: {
  height: 54,
  width: 54,
  marginBottom: 18
},
buttonText: {
  color: '#fff',
  fontSize: 18,
},
buttonFocus: {
  elevation: 5,
  opacity: 1
},
logoIcon: {
  position: 'absolute',
  bottom: 40,
  right: 40,
  height: 100,
  width:100,
},
loadingMedias: {
  position: 'absolute',
  bottom: 40,
  color: '#836977',
  fontWeight: 'bold',
},
container: {
  position: 'fixed',
  padding: 20,
  width: 280,
  bottom: 100
},
textLoading: {
  color: '#836977',
  fontWeight: 'bold'
}
});