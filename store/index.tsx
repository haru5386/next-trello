import { configureStore } from "@reduxjs/toolkit";
import TasksReducer from "./tasks";

export const store = (preloadedState = {})=>{
    return configureStore({
        reducer: {
          // 這裡放入所有的 reducers
          tasksStore: TasksReducer,
        },
        preloadedState
      });
      
}
export type AppStore = ReturnType<typeof store>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

