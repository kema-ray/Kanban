import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";
import ClearIcon from "../icons/ClearIcon";

import { useDispatch } from "react-redux";
import { addNewTask, deleteAllColumn } from "../Redux/cardSlice";

interface Props {
    column: Column
    deleteColumn: (id: Id) => void;
    updateColumn: (id: Id, title: string) => void
    createTask: (columnId: Id) => void;
    updateTask: (id: Id, content: string) => void;
    deleteTask: (id: Id) => void;
    clearTasks: (id: Id) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask, clearTasks } = props;

    const [editMode, setEditMode] = useState(false);
    const [clearingTasks, setClearingTasks] = useState(false);
    const taskIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks])


    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return(
            <div ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor opacity-60 border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-mdflex flex-col">
            </div>
        )
    }

    const dispatch = useDispatch();

    return (
        <div className="bg-columnBackgroundColor border-2 border-pink-500 w-[400px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div
      {...attributes}
      {...listeners}
        onClick={() => {
          if (!clearingTasks) {
            setEditMode(true);
          }
        }}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between relative"
      >
        {editMode && !clearingTasks ? (
          <input
            className="bg-white focus:border-rose-500 border-rounded outline-none px-2"
            value={column.title}
            onChange={(e) => updateColumn(column.id, e.target.value)}
            autoFocus
            onBlur={() => {
              setEditMode(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              setEditMode(false);
            }}
            disabled={clearingTasks}
          />
        ) : (
          <span>{column.title}</span>
        )}
        <div>
          <button
            onClick={() => {
              dispatch(deleteAllColumn(column.id));
            }}
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded py-2 px-4 right-1"
          >
            <TrashIcon />
          </button>
          <button
            onClick={() => {
              clearTasks(column.id);
              setClearingTasks(true);
            }}
            className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded py-2 px-4 ml-2"
          >
            <ClearIcon />
          </button>
        </div>
      </div>


        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
            <SortableContext items={taskIds}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task}
                    deleteTask={deleteTask} 
                    updateTask={updateTask}/>
                ))}
            </SortableContext>
        </div>

        <button className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
            dispatch(addNewTask({ columnID: column.id, taskTitle: `New Task` }));
            // dispatch(addNewTask({ columnID: column.id.toString(), taskTitle: `New Task` }));
            createTask(column.id);
        }}
        ><PlusIcon />Add Task</button>
      </div>
    )
}

export default ColumnContainer;