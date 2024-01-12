import config from "../../config";

export const createCustomizationSlice = (set) => ({
    isOpen: [],
    defaultId: "default",
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    menuOpen: (id) => set((state) => ({ isOpen: [id] })),
    toggleMenu: () => set((state) => ({ opened: !state.opened })),
    setFontFamily: (fontFamily) => set((state) => ({ fontFamily: fontFamily })),
    setBorderRadius: (borderRadius) =>
        set((state) => ({ borderRadius: borderRadius })),
    setOpened: (bool) => set((state) => ({ opened: bool })),
});
