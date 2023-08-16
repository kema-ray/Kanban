import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Button } from "@mui/material";
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import PlusIcon from "../icons/PlusIcon";
import { addAllColumns, dragTaskBetweenColumns } from "../Redux/cardSlice";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
// import cardSlice, { addAllColumns, addNewTask } from "../Redux/cardSlice";
// import { createSlice } from "@reduxjs/toolkit";

const defaultCols: Column[] = [
    {
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
    },
  ];
  
  const defaultTasks: Task[] = [
    {
      id: "1",
      columnId: "todo",
      content: "List admin APIs for dashboard",
    },
    {
      id: "2",
      columnId: "todo",
      content:
        "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
    },
    {
      id: "3",
      columnId: "doing",
      content: "Conduct security testing",
    },
    {
      id: "4",
      columnId: "doing",
      content: "Analyze competitors",
    },
    {
      id: "5",
      columnId: "done",
      content: "Create UI kit documentation",
    },
    {
      id: "6",
      columnId: "done",
      content: "Dev meeting",
    },
    {
      id: "7",
      columnId: "done",
      content: "Deliver dashboard prototype",
    },
    {
      id: "8",
      columnId: "todo",
      content: "Optimize application performance",
    },
    {
      id: "9",
      columnId: "todo",
      content: "Implement data validation",
    },
    {
      id: "10",
      columnId: "todo",
      content: "Design database schema",
    },
    {
      id: "11",
      columnId: "todo",
      content: "Integrate SSL web certificates into workflow",
    },
    {
      id: "12",
      columnId: "doing",
      content: "Implement error logging and monitoring",
    },
    {
      id: "13",
      columnId: "doing",
      content: "Design and implement responsive UI",
    },
  ];

   // useEffect(() => {
    //     dispatch(addAllColumns(createSlice.columns));
    // }, [dispatch]);

    // const addColumns = useCallback() => dispatch({ addAllColumns(defaultCols)}, [])

function KanbanBoard() {
    const dispatch = useDispatch();
    const columns = useSelector((state: any) => state.cards.columns)

    // const [columns, setColumns]=useState<Column[]>(storedCols);
    const columnsId = useMemo(() => columns.map((col: any) => col.id),
    [columns])
    const [tasks, setTasks] = useState<Task[]>(defaultTasks);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);


    // const clearColumn = () => {
    //     setTasks([]);
    // };
    // console.log(columns)
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 3,
        }
    }))

    return (
        <div className = "m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns?.map((col: any) => (
                                <ColumnContainer column={col} 
                                key={col.id}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                clearTasks={clearTasks}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                 />
                            ))}
                        </SortableContext>
                    </div>
                    <Button variant="contained" className="button"  onClick={() => {
                        createNewColumn();
                    }}>
                        <PlusIcon />Add Card</Button>                    
                </div>
                {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                clearTasks={clearTasks}
                                tasks={tasks.filter((task) =>
                                    task.columnId === activeColumn.id)}
                         />
                    )}
                    {
                    activeTask &&
                    <TaskCard
                    // key={task.id}
                    // task={task}
                    // deleteTask={() => deleteTask(tasks.id)}
                    task={activeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    />
                    }
                </DragOverlay>,
                document.body
                )}
            </DndContext>
        </div>
        
    );

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        }
        setTasks([...tasks, newTask]);
        // dispatch(addNewTask(newTask));
    }

    function clearTasks(columnId: Id) {
        setTasks((tasks) => tasks.filter((task) => task.columnId !== columnId));
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
        // dispatch(deleteAdde({ taskId: id }));
        // dispatch(deleteAddedTask({ taskId: tasks.id }));
    }

  //   function deleteTaskFromRedux(taskId: Id) {
  //     dispatch(deleteAddedTask({ taskId }));
  // }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content };
        });

        setTasks(newTasks);
    }

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
            tasks: []
        };
            // setColumns([...columns, columnToAdd]);
            dispatch(addAllColumns([columnToAdd]));
    }

    function deleteColumn(id: Id) {
        // const filteredColumns = columns.filter((col) => col.id !== id);
        // setColumns(filteredColumns);

        // const newTasks = tasks.filter((t) => t.columnId !== id);
        // setTasks(newTasks);
        return null;
    }


    function updateColumn(id: Id, title: string){
        const newColumns = columns.map((col: any) => {
            if (col.id !== id) return col;
            return{...col, title};
        });
        // setColumns(newColumns);
    }

    function onDragStart(event: DragStartEvent) {
        // console.log("DRAG START", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event:DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        // setColumns((columns) => {
        //     const activeColumnIndex = columns.findIndex(
        //         (col) => col.id === activeColumnId
        //     );
        //     const overColumnIndex = columns.findIndex(
        //         (col) => col.id === overColumnId
        //     );

        //     return arrayMove(columns, activeColumnIndex, overColumnIndex);
        // })

        dispatch(dragTaskBetweenColumns({taskId: active.data.current!.id, fromColumnId: activeColumnId, toColumnId: overColumnId}))

    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        // If i want to drop a Task over another Task
        if (isActiveATask && isOverATask) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            tasks[activeIndex].columnId = tasks[overIndex].columnId;

            return arrayMove(tasks, activeIndex, overIndex);
        });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        // I want to drop a Task over a column=>moving between two columns(A&B)
        if (isActiveATask && isOverAColumn) {
        setTasks((tasks) => {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);

            tasks[activeIndex].columnId = overId;

            return arrayMove(tasks, activeIndex, activeIndex);
        });
        }
    }
}


function generateId() {
    return Math.floor(Math.random() * 101);
}

export default KanbanBoard;