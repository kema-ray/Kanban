import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { Column, Task} from "../types";
// import { generateId } from "../components/KanbanBoard"
import { v4 as uuidv4 } from 'uuid';

interface CardState {
    columns: Column[];
}

const initialState: CardState = {
    columns: [{
        id: "todo",
        title: "Todo",
        tasks: []
      },
      {
        id: "doing",
        title: "Work in progress",
        tasks: []
      },
      {
        id: "done",
        title: "Done",
        tasks: []
      }]
}

const cardSlice = createSlice({
    name: "cards",
    initialState,
    reducers:{
        addColumn(state, action:PayloadAction<string>){
            console.log(state)
            if (state.columns.length < 2){
                const newColumn: Column = {
                    id: uuidv4(),
                    title: action.payload,
                    tasks: []
                };
                state.columns.push(newColumn);
            }
        },
        addAllColumns(state, action: PayloadAction<Column[]>){
            action?.payload?.map((column) => state.columns.push(column));
        },
        updateColumn(state, action:PayloadAction<{ columnId: string; newTitle: string }>) {
            const { columnId, newTitle } = action.payload;
            const column = state.columns.find(col => col.id === columnId);
            if (column) {
              column.title = newTitle;
            }
        },
        deleteAllColumn: (state, action) => {
            const id = action.payload;
            state.columns = state.columns.filter((col) => col.id !== id);
            // return state.columns.filter(col => col.id !== action.payload);
        },
        addNewTask(state,action: PayloadAction<{ columnID: any; taskTitle: string }>) {
            const { columnID, taskTitle } = action.payload;
            const column = state.columns.find((col) => col.id === columnID);
            if (column) {
              const newTasks: Task = {
                  id: uuidv4(),
                  content: taskTitle,
                  columnId: uuidv4()
              };
              column.tasks.push(newTasks);
            }
        },
        updateNewTask(state, action: PayloadAction<{ taskId: string; newContent: string }>) {
            const { taskId, newContent } = action.payload;
            for (const column of state.columns) {
              const task = column.tasks.find(t => t.id === taskId);
              if (task) {
                task.content = newContent;
                break;
              }
            }
        },
        deleteAddedTask(state, action: PayloadAction<{ taskId: string }>) {
            const { taskId } = action.payload;
            for (const column of state.columns) {
              column.tasks = column.tasks.filter(task => task.id !== taskId);
            }
        },
        
        dragTaskBetweenColumns(
            state,
            action: PayloadAction<{ taskId: string; fromColumnId: any; toColumnId: any }>
          ) {
            const { taskId, fromColumnId, toColumnId } = action.payload;
      
            const fromColumn = state.columns.find((col) => col.id === fromColumnId);
            const toColumn = state.columns.find((col) => col.id === toColumnId);
      
            if (fromColumn && toColumn) {
              const taskIndex = fromColumn.tasks.findIndex(
                (task) => task.id === taskId
              );

              console.log(fromColumn)
      
              if (taskIndex !== -1) {
                const task = fromColumn.tasks.splice(taskIndex, 1)[0];
                console.log(task);
                toColumn.tasks.push(task);
              }
            }
          },        
        // dragAddedEvent(
        //     state, action: PayloadAction<{taskID: string; fromColumnID:string; toColumnID: string;}>
        // ) {
        //     const {taskID, fromColumnID,toColumnID} = action.payload;
        //     const fromColumn = state.columns.find((col) => col.id === fromColumnID);
        //     const toColumn = state.columns.find((col) => col.id === toColumnID);

        //     if (fromColumn && toColumn) {
        //         const taskIndex = fromColumn.tasks.findIndex(
        //           (task) => task.id === taskID
        //         );
        
        //         if (taskIndex !== -1) {
        //           const task = fromColumn.tasks.splice(taskIndex, 1)[0];
        //           toColumn.tasks.push(task);
        //         }
        //       }
        //     },
    }
})

export const {
    addColumn,
    addAllColumns,
    updateColumn,
    deleteAllColumn,
    addNewTask,
    updateNewTask,
    deleteAddedTask,
    dragTaskBetweenColumns,
        // dragAddedEvent,
} = cardSlice.actions;

export default cardSlice.reducer;
