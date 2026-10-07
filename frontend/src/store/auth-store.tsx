import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { authDTO } from "../dto/auth-dto";
import type { UserDTO } from "../dto/user-dto";
import { getLoggedUser, login, logout } from "../service/auth-service";

interface AuthStore {
    loggedUser: UserDTO | null;
    imageVersion: number;
    setLoggedUser: (user: UserDTO | null) => void;
    refreshProfileImage: () => void;
    doLogin: (credentials: authDTO) => Promise<UserDTO>;
    getLogged: () => Promise<void>;
    doLogout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            loggedUser: null,
            imageVersion: 0,
            setLoggedUser: (user) => set({ loggedUser: user }),
            refreshProfileImage: () => set((state) => ({ imageVersion: state.imageVersion + 1 })),
            doLogin: async ({ email, password }: authDTO): Promise<UserDTO> => {
                await login({ email, password });
                const user = await getLoggedUser();
                set({ loggedUser: user });
                return user;
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
