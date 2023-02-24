import { AuthContextProvider } from "./AuthContext";

interface AppContextProvider{
    children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProvider) {
    return (
        <AuthContextProvider>
            { children }
        </AuthContextProvider>
    )
}