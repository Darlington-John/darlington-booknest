import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Shelf {
  name: string;
  description: string;
}

interface ShelvesState {
  shelves: Shelf[];
  showPopup: boolean;
}

const initialState: ShelvesState = {
  shelves: [],
  showPopup: false,
};

const shelfSlice = createSlice({
  name: 'shelves',
  initialState,
  reducers: {
    togglePopup(state) {
      state.showPopup = !state.showPopup;
    },
    addShelf(state, action: PayloadAction<Shelf>) {
      state.shelves.push(action.payload);
    },
  },
});

export const { togglePopup, addShelf } = shelfSlice.actions;
export default shelfSlice.reducer;
