import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../services/axios";

export const fetchAuthData = createAsyncThunk('auth/fetchUserData', async (params) => {
  console.log('params: ', params);
  const { data } = await axios.post('/auth/login', params)
  return data
})


const initialState = {
  data: null,
  status: 'loading',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null
    }
  },

  extraReducers: {
    [fetchAuthData.pending]: (state) => {
      state.status = 'loading'
      state.data = null
    },
    [fetchAuthData.fulfilled]: (state, action) => {
      state.status = 'loaded'
      state.data = action.payload
    },
    [fetchAuthData.rejected]: (state) => {
      state.status = 'error'
      state.data = null
    },
  }
})

export const isAuthSelect = state => Boolean(state.auth.data)

export const authReducer = authSlice.reducer

export const { logout } = authSlice.actions