import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setImages, setVideos } from "./requestsSlice";
interface fetchMediaError {
    message: 'string'
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImages = createAsyncThunk<any, string, { rejectValue: fetchMediaError }>(
    "fetchImages",
    async(_, {dispatch, rejectValue}) => {
        try{
            const {data} = await axios.get(`https://ibucket.gelatoborelli.com.br/painel_tv/?type=images`, {
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
    async(_, {dispatch, rejectValue}) => {
        try{
            const {data} = await axios.get(`https://ibucket.gelatoborelli.com.br/painel_tv/?type=videos`, {
                headers: {
                Authorization: "Bearer ee6d9123-3f88-4175-829f-6d08ca8810b8",
                },
            })
            if(data?.data?.length){
                dispatch(setVideos(data.data))
                return data.data
            }
            return []
        } catch(e){
            console.error("Erro ao buscar vídeos:", e);
            return rejectValue({
                message: 'Erro: ' + axios.isAxiosError(e) ? Error.message: 'Erro desconhecido'
            })
        }
    }
)   