import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface RequestsState {
  images: any,
  videos: any,
}
const initialState: RequestsState = {
  images: null,
  videos: null
};
const RequestsSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
      setImages(){
      },
      setVideos(){
      }
    },
    
  });
  export const { setImages, setVideos } = RequestsSlice.actions;
  export default RequestsSlice.reducer;