import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { authDTO } from "../dto/auth-dto";
import type { UserDTO } from "../dto/user-dto";
import { getLoggedUser, login, logout } from "../service/auth-service";

interface AuthStore {
    loggedUser: UserDTO | null;
    setLoggedUser: (user: UserDTO | null) => void;
    doLogin: (credentials: authDTO) => Promise<void>;
    getLogged: () => Promise<void>;
    doLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            loggedUser: null,
            setLoggedUser: (user) => set({ loggedUser: user }),
            doLogin: async ({ email, password }: authDTO) => {
                const user = await login({ email, password });
                set({ loggedUser: user });
            },
            getLogged: async () => {
                try {
                    const user = await getLoggedUser();
                    set({ loggedUser: user });
                } catch (error) {
                    set({ loggedUser: null });
                }
            },
            doLogout: async () => {
                await logout();
                set({ loggedUser: null });
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);