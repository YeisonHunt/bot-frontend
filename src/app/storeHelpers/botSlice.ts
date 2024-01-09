import { BACKEND_API_URL } from '@/shared/constants';
import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

import { Action, Bot, BotsState } from "../../../types/generalTypes"

export const fetchBots = createAsyncThunk<Bot[]>('bots/fetchBots', async () => {
  const response = await axios.get<Bot[]>(`${BACKEND_API_URL}/bots`);
  return response.data;
});

export const fetchRules = createAsyncThunk<Action[]>('bots/fetchRules', async () => {
  const response = await axios.get<Action[]>(`${BACKEND_API_URL}/rules`);
  return response.data;
});

export const updateBot = createAsyncThunk('bots/updateBot', async (bot:Bot) => {
    const response = await axios.put<Bot>(`${BACKEND_API_URL}/bots/${bot.id}`, bot);
    return response.data;
});

export const updateRule = createAsyncThunk('rules/updateRule', async (action:Action) => {
  const response = await axios.put<Action>(`${BACKEND_API_URL}/rules/${action.id}`, action);
  return response.data;
});

export const createBot = createAsyncThunk('bots/createBot', async (bot:Bot) => {
    const response = await axios.post<Bot>(`${BACKEND_API_URL}/bots`, bot);
    return response.data;
});

//we define the initial state

const initialState: BotsState = {
  bots: [],
  status: 'idle',
  error: null,
  rules: [],
};

//lets define the slice for the previous state and functions

const botsSlice = createSlice({
  name: 'bots',
  initialState,
  reducers: {
    botAdded(state, action: PayloadAction<Bot>) {
      state.bots.push(action.payload);
    },
    botUpdated(state, action: PayloadAction<Bot>) {
      const { id, title, completedActions } = action.payload;
      const existingBot = state.bots.find((bot) => bot.id === id);
      if (existingBot) {
        existingBot.title = title;
        existingBot.completedActions = completedActions;
      }
    },
    botDeleted(state, action: PayloadAction<Bot>) {
      const { id } = action.payload;
      const existingBot = state.bots.find((bot) => bot.id === id);
      if (existingBot) {
        state.bots.filter((bot) => bot.id !== id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBots.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(fetchBots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bots = action.payload;
      })
      .addCase(fetchBots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateBot.fulfilled, (state, action) => {
        const { id, title, completedActions } = action.payload;
        const existingBot = state.bots.find((bot) => bot.id === id);
        if (existingBot) {
          existingBot.title = title;
          existingBot.completedActions = completedActions;
        }
      }).addCase(fetchRules.pending, (state, _action) => {
        state.status = 'loading';
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateRule.fulfilled, (state, action) => {
        const { id, title, duration, state: actionState } = action.payload;
        const existingAction = state.rules.find((action) => action.id === id);
        if (existingAction) {
          existingAction.title = title;
          existingAction.duration = duration;
          existingAction.state = actionState;
        }
      })
      .addCase(createBot.fulfilled, (state, action) => {
        state.bots.push(action.payload);
      });
  },
});

export const selectBots = (state: RootState) => state.bots.bots;
export const selectBotStatus = (state: RootState) => state.bots.status;
export const selectBotError = (state: RootState) => state.bots.error;

export const selectBotById = createSelector(
  selectBots,
  (_state: BotsState, botId: number | string) => botId,
  (bots, botId) => bots.find((bot) => bot.id === botId)
);

export default botsSlice.reducer;

