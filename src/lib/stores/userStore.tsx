import { create } from "zustand";

interface UserStore {
    userName: string | null;
    setUserName: (name: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
    userName: null,
    setUserName: (name) => set({ userName: name }),
}));

export default useUserStore;
