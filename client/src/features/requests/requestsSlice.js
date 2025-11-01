import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import requestsService from './requestsService';

const initialState = {
  myRequests: [],
  receivedRequests: [],
  bookRequests: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get my requests
export const getMyRequests = createAsyncThunk(
  'requests/getMyRequests',
  async (_, thunkAPI) => {
    try {
      return await requestsService.getMyRequests();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get received requests
export const getReceivedRequests = createAsyncThunk(
  'requests/getReceivedRequests',
  async (_, thunkAPI) => {
    try {
      return await requestsService.getReceivedRequests();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get book requests
export const getBookRequests = createAsyncThunk(
  'requests/getBookRequests',
  async (bookId, thunkAPI) => {
    try {
      return await requestsService.getBookRequests(bookId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create request
export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, thunkAPI) => {
    try {
      return await requestsService.createRequest(requestData);
    } catch (error) {
      console.error('Create request error:', error.response?.data || error.message);
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Accept request
export const acceptRequest = createAsyncThunk(
  'requests/acceptRequest',
  async (requestId, thunkAPI) => {
    try {
      return await requestsService.acceptRequest(requestId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Decline request
export const declineRequest = createAsyncThunk(
  'requests/declineRequest',
  async (requestId, thunkAPI) => {
    try {
      return await requestsService.declineRequest(requestId);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my requests
      .addCase(getMyRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myRequests = action.payload;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get received requests
      .addCase(getReceivedRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReceivedRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.receivedRequests = action.payload;
      })
      .addCase(getReceivedRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get book requests
      .addCase(getBookRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bookRequests = action.payload;
      })
      .addCase(getBookRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create request
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.myRequests)) {
          state.myRequests.push(action.payload);
        } else {
          state.myRequests = [action.payload];
        }
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Accept request
      .addCase(acceptRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.receivedRequests)) {
          state.receivedRequests = state.receivedRequests.map((request) =>
            request._id === action.payload._id ? action.payload : request
          );
        }
        if (Array.isArray(state.bookRequests)) {
          state.bookRequests = state.bookRequests.map((request) =>
            request._id === action.payload._id ? action.payload : request
          );
        }
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Decline request
      .addCase(declineRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(declineRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (Array.isArray(state.receivedRequests)) {
          state.receivedRequests = state.receivedRequests.map((request) =>
            request._id === action.payload._id ? action.payload : request
          );
        }
        if (Array.isArray(state.bookRequests)) {
          state.bookRequests = state.bookRequests.map((request) =>
            request._id === action.payload._id ? action.payload : request
          );
        }
      })
      .addCase(declineRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = requestsSlice.actions;
export default requestsSlice.reducer;
