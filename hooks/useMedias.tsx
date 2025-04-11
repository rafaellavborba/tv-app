import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
export function useMedias(){
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaList, setMediaList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const getAllSavedMedia = async () => {
      try {
        const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        const mediaFiles = files.filter(file =>
          file.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov|mkv|avi|webm)$/i)
        );
        const mediaUris = mediaFiles.map(file => FileSystem.documentDirectory + file);
        return mediaUris;
      } catch (error) {
        console.error("Erro ao buscar mídias salvas:", error);
        return [];
      }
    };
     const syncAndCleanMedia = async (mediaUrls: string[]) => {
       setLoading(true)
       const dir = FileSystem.documentDirectory!;
       const localFiles = await FileSystem.readDirectoryAsync(dir);
       const expectedFilenames = mediaUrls.map(url => url.split('filename=').pop());
       // Limpa arquivos que não estão na lista
       for (const file of localFiles) {
         if (!expectedFilenames.includes(file)) {
           try {
             await FileSystem.deleteAsync(`${dir}${file}`, { idempotent: true });
           } catch (err) {
             console.error(`Erro ao remover ${file}:`, err);
           }
         }
       }
       for (const url of mediaUrls) {
         const filename = url.split('filename=').pop();
         const finalPath = `${FileSystem.documentDirectory}${filename}`;
         const fileInfo = await FileSystem.getInfoAsync(finalPath);
         if (!fileInfo.exists) {
           try {
             const downloadRes = await FileSystem.downloadAsync(url, finalPath);
           } catch (error) {
             console.error(`Erro ao processar ${filename}:`, error);
           }
         }
       }
         setLoading(false)
     };
    return {
        mediaList,
        currentIndex,
        loading,
        setCurrentIndex,
        setLoading,
        setMediaList,
        getAllSavedMedia,
        syncAndCleanMedia
    }
}