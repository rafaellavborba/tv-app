'use client'
import React from 'react';
import HomeScreen from '../../screens/HomeScreen.tsx';
import * as Device from 'expo-device'
import { fetchDevice } from '@/store/requestsActions';
import { AppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { deviceState } = useAppSelector((state) => state.requests);
  
  useEffect(() => {
    if(!deviceState){
      const send = {identifier: Device.osInternalBuildId || Device.modelName}
      dispatch(fetchDevice(send))
    }
  }, []);
  return <HomeScreen />;
}