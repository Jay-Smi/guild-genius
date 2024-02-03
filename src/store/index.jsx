import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { arrayMove } from "@dnd-kit/sortable";

import { createCustomizationSlice } from "./slices/customizationSlice";
import { createUserSlice } from "./slices/userSlice";

export const useStore = create()(
    immer((...a) => ({
        ...createCustomizationSlice(...a),
        ...createUserSlice(...a),
    }))
);
