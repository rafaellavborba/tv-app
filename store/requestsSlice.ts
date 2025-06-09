import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface RequestsState {
  images: any,
  videos: any,
  deviceState: string

}
const initialState: RequestsState = {
  images: null,
  videos: null,
  deviceState: ''
};
const RequestsSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
      setImages(state, {payload}){
        state.images = payload
      },
      setVideos(state, {payload}){
        state.videos = payload
      },
      setDevice(state, {payload}){
        state.deviceState = payload
      }
    },
  });
  export const { setImages, setVideos, setDevice } = RequestsSlice.actions;
  export default RequestsSlice.reducer;