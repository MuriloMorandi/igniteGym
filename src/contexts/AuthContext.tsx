import {
  createContext,
  ReactNode,
  useEffect,
  useState
} from "react";

import { UserDTO } from "@dtos/UserDTO";
import { UsersignInDTO } from "@dtos/UserSignInDTO";
import { api } from "@services/api";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave
} from "@storage/storageUser";
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (user: UsersignInDTO) => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
  children: ReactNode,
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);
  
  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
    setUser(userData);
  }
  
  async function storageUserAndTokenSave(
      userData: UserDTO,
      token: string,
      refresh_token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData);
      await storageAuthTokenSave({ token, refresh_token });
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn({ email, password }: UsersignInDTO) {
    await api.post('/sessions', { email, password })
      .then(async ({ data }) => {
        await storageUserAndTokenSave(
          data.user,
          data.token,
          data.refresh_token
        );
        userAndTokenUpdate(data.user, data.token);

      })
      .catch((error) => {
        throw error;
      })
  }

  async function signOut() {
    try
    {
      setIsLoadingUserStorageData(false);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();
    }catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
    
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenGet();

      if(token && userLogged) {
        setUser(userLogged);
      } 
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, [])
  
  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    }
  },[])

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      updateUserProfile,
      signOut,
      isLoadingUserStorageData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}