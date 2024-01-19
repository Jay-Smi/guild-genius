export const createUserSlice = (set) => ({
    session: undefined,
    setSession: (session) => set((state) => ({ session: session })),
});
