import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

export function useMedias() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaList, setMediaList] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [downloadProgress, setDownloadProgress] = useState<number>(0); 
    const [totalFilesToDownload, setTotalFilesToDownload] = useState<number>(0);
    const [filesDownloaded, setFilesDownloaded] = useState<number>(0);

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
        setTotalFilesToDownload(0);
        setFilesDownloaded(0);
        setDownloadProgress(0);
        setLoading(true);
        const dir = FileSystem.documentDirectory!;
        const localFiles = await FileSystem.readDirectoryAsync(dir);
        const expectedFilenames = mediaUrls.map(url => url.split('filename=').pop());
        const filesToDownload = [];
        
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
                filesToDownload.push({ url, finalPath, filename });
            }
        }
        setTotalFilesToDownload(filesToDownload.length);

        for (const item of filesToDownload) {
            try {
                await FileSystem.downloadAsync(item.url, item.finalPath);
                setFilesDownloaded((prevCount) => prevCount + 1);
                const progress = (filesDownloaded + 1) / totalFilesToDownload * 100;
                setDownloadProgress(progress);
            } catch (error) {
                console.error(`Erro ao processar ${item.filename}:`, error);
            }
        }
        setLoading(false);
        setDownloadProgress(100);
    };

    return {
        mediaList,
        currentIndex,
        loading,
        setCurrentIndex,
        setLoading,
        setMediaList,
        getAllSavedMedia,
        syncAndCleanMedia,
        downloadProgress, 
    };
}