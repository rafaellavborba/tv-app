'use client'
import React from 'react';
import HomeScreen from '../../screens/HomeScreen';
import * as Device from 'expo-device'
import { fetchDevice } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';
import DeviceInfo from 'react-native-device-info';
export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { deviceState } = useAppSelector((state) => state.requests);

    useEffect(() => {
      const init = async () => {
        try {

          if (!deviceState) {
            const send = {
              identifier: await DeviceInfo.getUniqueId(),
            };
            dispatch(fetchDevice(send));
          }
        } catch (error) {
          console.error('Erro ao obter serial:', error);
        }
      };

      init();
    }, []);
  
  return <HomeScreen />;
}