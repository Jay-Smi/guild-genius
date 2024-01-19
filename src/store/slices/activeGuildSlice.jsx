export const createActiveGuildSlice = (set) => ({
    userHasGuild: false,

    setUserHasGuild: (bool) => set((state) => ({ userHasGuild: bool })),
});
