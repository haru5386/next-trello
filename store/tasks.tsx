import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UniqueIdentifier } from "@dnd-kit/core";

export interface Board {
  id: UniqueIdentifier;
  title: string;
}

export type BoardId = Board["id"];

export interface Task {
  id: UniqueIdentifier;
  title: string;
  description: string;
  deadline: string;
  creator: string;
  createTime: string;
}

export interface InitialState {
  tasks: Record<BoardId, Task[]>;
  boards: Board[];
  loading: boolean;
  error: string | null;
}

export interface AddTaskPayload {
  task: Task;
  board: BoardId;
}

const initialState: InitialState = {
  tasks: {},
  boards: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await fetch(
    `https://react-test-7a1ae-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json`
  );
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return await res.json(); // 假设返回 { tasks: {}, boards: {} }
});

export const postTasks = createAsyncThunk(
  "tasks/post",
  async (data: Record<BoardId, Task[]>) => {
    const res = await fetch(
      `https://react-test-7a1ae-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json`,
      { method: "PUT", body: JSON.stringify(data) }
    );
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return data;
  }
);

export const fetchBoards = createAsyncThunk("boards/fetch", async () => {
  const res = await fetch(
    `https://react-test-7a1ae-default-rtdb.asia-southeast1.firebasedatabase.app/boards.json`
  );
  if (!res.ok) throw new Error("Failed to fetch boards");
  return await res.json(); // 假设返回 { tasks: {}, boards: {} }
});

export const postBoards = createAsyncThunk(
  "boards/put",
  async (data: Board[]) => {
    const res = await fetch(
      `https://react-test-7a1ae-default-rtdb.asia-southeast1.firebasedatabase.app/boards.json`,
      { method: "PUT", body: JSON.stringify(data) }
    );
    if (!res.ok) throw new Error("Failed to put boards");
    return data;
  }
);


const tasksSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<AddTaskPayload>) => {
      state.tasks[action.payload.board].push(action.payload.task);
    },
    // addBoard: (state, action: PayloadAction<Board>) => {
    //   state.tasks[action.payload.id] = [];
    //   state.boards[action.payload] = action.payload;
    // },

    // removeTask: (state, action) => {
    //   state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    // },
  },
  extraReducers: (builder) => {
    builder

    // fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      })

      // put tasks
      .addCase(postTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postTasks.fulfilled, (state, action) => {
        state.tasks = action.payload; // 添加新任务
        state.loading = false;
      })
      .addCase(postTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to post data";
      })

      // put boards
      .addCase(postBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBoards.fulfilled, (state, action) => {
        state.boards = action.payload; // 添加新任务
        state.loading = false;
      })
      .addCase(postBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to post data";
      })

      // fetchBoards
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload; // 添加新任务
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export const tasksAction = tasksSlice.actions;
export default tasksSlice.reducer;
