import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Linking, 
  Alert, 
  ImageBackground, 
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ModalPassword from '@/components/ModalPassword';
import * as FileSystem from 'expo-file-system';
import { useDispatch } from "react-redux";
import { fetchImages, fetchVideos } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useMedias } from '@/hooks/useMedias';
import TypingLoop from '@/hooks/TypingLoop';
const { height, width } = Dimensions.get('window');
export default function HomeScreen() {
  const [focusedButton, setFocusedButton] = useState(null);
  const navigation = useNavigation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {mediaList, currentIndex, loading, setCurrentIndex, setLoading, setMediaList, syncAndCleanMedia, getAllSavedMedia} = useMedias()
  useEffect(() => {
    setFocusedButton('play');
  }, []);
  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };
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
        const images = imageRes.payload.map((img: any) => {
          const filename = img.url.split('filename=').pop();
          const localUri = `${FileSystem.documentDirectory}${filename}`;
          return { ...img, type: 'image', localUri };
        });
        const videos = videoRes.payload.map((vid: any) => {
          const filename = vid.url.split('?').pop();
          const localUri = `${FileSystem.documentDirectory}${filename}`;
          return { ...vid, type: 'video', localUri };
        });
        setMediaList([...images, ...videos]);
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
        <TouchableOpacity 
          onPress={handleOpenPasswordModal}
          onPressIn={() => setFocusedButton('logout')}
          onPressOut={() => setFocusedButton(false)}
          style={[styles.logoutButton, focusedButton === 'logout' && styles.buttonFocus]} 
          accessibilityRole="button" 
          accessibilityLabel="Clique aqui para sair da aplicação"
        >
          <Image source={require('../assets/icon/logout.png')} style={styles.iconLogout} />
        </TouchableOpacity>
        <View style={styles.launcher}>
          <Text style={styles.title}>Bem-vindo a TV Borelli</Text>
          <View style={styles.buttons}>
            
            <TouchableOpacity 
              style={[styles.button, styles.firstButton, focusedButton === 'play' && styles.buttonFocus]} 
              onPress={navigateToProgram} 
              onPressIn={() => setFocusedButton('play')}
              onPressOut={() => setFocusedButton(null)}
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
              onPressIn={() => setFocusedButton('support')}
              onPressOut={() => setFocusedButton(false)}
            >
              <Image 
                source={require('../assets/icon/support.png')} 
                style={styles.buttonIcon} 
                accessibilityLabel="Clique aqui para acessar o suporte"
              />
              <Text style={styles.buttonText}>Suporte</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image source={require('../assets/icon/borelli.png')} style={styles.logoIcon} />
        {loading ? (
          <TypingLoop style={styles.loadingMedias} />
        ) : null}
      </ImageBackground>
      {showPasswordModal 
        ? (<ModalPassword showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}/> ) 
        : null
      }
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
  maxHeight: height,
  maxWidth: width,
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
title: {
  fontSize: 36,
  fontWeight: 'bold',
  color: '#384c29',
  textShadowColor: 'rgba(0, 0, 0, 0.2)',
  textShadowOffset: { width: 2, height: 4 },
  textShadowRadius: 8,
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
},
buttonIcon: {
  height: 54,
  width: 54,
  resizeMode: 'contain',
  marginBottom: 18
},
buttonText: {
  color: '#fff',
  fontSize: 18,
},
buttonFocus: {
  borderColor: '#C59D58', 
  borderWidth: 2,
  elevation: 5,
},
logoIcon: {
  position: 'absolute',
  bottom: 40,
  right: 40,
  height: 100,
  width:100,
  resizeMode: 'cover',
},
loadingMedias: {
  position: 'absolute',
  bottom: 40,
  color: '#836977',
  fontWeight: 'bold',
}
});