import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setImages, setVideos, setDevice } from "./requestsSlice";
interface fetchMediaError {
    message: 'string'
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImages = createAsyncThunk<any, string, { rejectValue: fetchMediaError }>(
    "fetchImages",
    async(_, {dispatch, rejectValue}) => {
        try{
            const {data} = await axios.get(`https://apiptv.gelatoborelli.com.br/api/tv/${deviceState}`, {
                headers: {
                Authorization: "Bearer ee6d9123-3f88-4175-829f-6d08ca8810b8",
                },
            
            })
            if(data?.data?.length){
                dispatch(setImages(data.data))
                return data.data
            }
            return []
        } catch(e){
            console.error("Erro ao buscar imagens:", e);
            return rejectValue({
                message: 'Erro: ' + axios.isAxiosError(e) ? Error.message: 'Erro desconhecido'
            })
        }
    }
)   
export const fetchVideos = createAsyncThunk<any, string, { rejectValue: fetchMediaError }>(
    "fetchVideos",
    async(_, {dispatch, getState}) => {
        try{
            const { requests } = getState();
            const {deviceState} = requests
            const {data} = await axios.get(`https://apiptv.gelatoborelli.com.br/api/tv/${deviceState}`, {
                headers: {
                    Authorization: "ee6d9123-3f88-4175-829f-6d08ca8810b8",
                },
            })
            if(data?.playlist?.length){
                dispatch(setVideos(data.playlist))
                return data.playlist
            }
            return []
        } catch(e){
            console.error("Erro ao buscar vídeos:", e);
        }
    }
)   
export const fetchDevice = createAsyncThunk<any, any, {rejectValue: fetchMediaError}>(
    "fetchDevice", 
    async(device, {dispatch}) => {
        try {
            dispatch(setDevice(device.identifier))
            const {data} = await axios.post(`https://apiptv.gelatoborelli.com.br/api/device_tv`, device, {
                headers: {
                    Authorization: "ee6d9123-3f88-4175-829f-6d08ca8810b8",
                },
            })
        } catch (error) {
            
            console.error('Erro ao identificar o device: ', error)
        }
    }
)
