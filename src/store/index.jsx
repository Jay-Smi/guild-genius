import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { arrayMove } from "@dnd-kit/sortable";

import { createCustomizationSlice } from "./slices/customizationSlice";

export const useStore = create()(
    immer((...a) => ({
        ...createCustomizationSlice(...a),
    }))
);
