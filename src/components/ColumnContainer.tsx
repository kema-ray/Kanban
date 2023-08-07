import TrashIcon from "../icons/TrashIcon";
import { Column, Id } from "../types";

interface Props {
    column: Column
    deleteColumn: (id: Id) => void;
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn } = props;
    return (
        <div
        className="
      bg-columnBackgroundColor
      opacity-40
      border-2
      border-pink-500
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      ">
        <div
        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        flex
        items-center
        justify-between
        "
        >
        {column.title}
        <button onClick={() => {
            deleteColumn(column.id);
        }}
        className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "><TrashIcon /></button>
        </div>
      </div>
    )
}

export default ColumnContainer;