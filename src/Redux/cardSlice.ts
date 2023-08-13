import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Column, Task } from "../types";

interface CardState {
    columns: Column[];
}

const initialState: CardState = {
    columns: []
}

const cardSlice = createSlice({
    name: "cards",
    initialState,
    reducers:{}
})

export default cardSlice.reducer;
