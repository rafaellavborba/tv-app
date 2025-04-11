import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';
// import Video from 'react-native-video';
import { useMedias } from '@/hooks/useMedias';
const MediaScreen = () => {
  const {
    mediaList,
    currentIndex,
    loading,
    setCurrentIndex,
    getAllSavedMedia
  } = useMedias();
  const [midiasLocais, setMidiasLocais] = useState<string[]>([]);
  const fadeAnim = useState(new Animated.Value(1))[0];
  useEffect(() => {
    const buscarMidias = async () => {
      const midias = await getAllSavedMedia();
      setMidiasLocais(midias);
    };
    buscarMidias();
  }, []);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      midiasLocais.length > 0 &&
      /\.(jpg|jpeg|png|gif|webp)$/i.test(midiasLocais[currentIndex])
    ) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % midiasLocais.length);
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentIndex, midiasLocais]);
  useEffect(() => {
    animateFade();
  }, [currentIndex]);
  const animateFade = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };
  const handleVideoEnd = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % midiasLocais.length);
  };
  const isVideo = (uri: string) =>
    /\.(mp4|mov|mkv|avi|webm)$/i.test(uri);
  const isImage = (uri: string) =>
    /\.(jpg|jpeg|png|gif|webp)$/i.test(uri);
  return (
    <View style={styles.container}>
      {loading || !midiasLocais.length ? (
        <View style={styles.loadingView}>
          <Text>Carregando...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.mediaContainer, { opacity: fadeAnim }]}>
          {isVideo(midiasLocais[currentIndex]) ? (
          //  <Video
          //         source={{ uri: midiasLocais[currentIndex] }}
          //         style={styles.video}
          //         onEnd={handleVideoEnd}
          //         controls={true}
          //         resizeMode="cover"
          //   />
          null
          ) : isImage(midiasLocais[currentIndex]) ? (
            <Image
              source={{ uri: midiasLocais[currentIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.unsupported}>Mídia não suportada</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  mediaContainer: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unsupported: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  }
});
export default MediaScreen;