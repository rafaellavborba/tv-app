import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, Animated, TouchableOpacity } from 'react-native';
import { useMedias } from '@/hooks/useMedias';
import Video from 'react-native-video';

const MediaScreen = () => {
  const {
    mediaList,
    currentIndex,
    loading,
    setCurrentIndex,
    getAllSavedMedia
  } = useMedias();

  const [midiasLocais, setMidiasLocais] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const buscarMidias = async () => {
    try {
      const midias = await getAllSavedMedia();
      console.log('Mídias locais encontradas:', midias);
      setMidiasLocais(midias);
    } catch (error) {
      console.error('Erro ao buscar mídias:', error);
    }
  };

  useEffect(() => {
    buscarMidias();
  }, []);

  useEffect(() => {
    if (!midiasLocais.length) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const currentUri = midiasLocais[currentIndex];
    if (isImage(currentUri)) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % midiasLocais.length);
      }, 30000); // 30 segundos
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, midiasLocais]);

  useEffect(() => {
    if (!loading && midiasLocais.length > 0) {
      animateFade();
    }
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
    setCurrentIndex((prev) => (prev + 1) % midiasLocais.length);
  };

  const handlePress = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const isVideo = (uri: string) => /\.(mp4|mov|mkv|avi|webm)$/i.test(uri);
  const isImage = (uri: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(uri);

  const currentUri = midiasLocais[currentIndex];
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={1}>
      {loading || !midiasLocais.length ? (
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.mediaContainer, { opacity: fadeAnim }]}>
          {isVideo(currentUri) ? (
            <Video
              key={currentUri}
              source={{ uri: currentUri }}
              style={styles.video}
              onEnd={handleVideoEnd}
              controls={false}
              resizeMode="cover"
              repeat={false}
              paused={false}
            />
          ) : isImage(currentUri) ? (
            <Image
              key={currentUri}
              source={{ uri: currentUri }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.unsupported}>Mídia não suportada</Text>
          )}
        </Animated.View>
      )}
    </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  unsupported: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MediaScreen;
