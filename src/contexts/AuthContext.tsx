import { createContext, ReactNode, useEffect, useState } from "react";

import { UserDTO } from "@dtos/UserDTO";
import { UserSingInDTO } from "@dtos/UserSingInDTO";
import { api } from "@services/api";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  singIn: (user: UserSingInDTO) => Promise<void>;
  singOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
  children: ReactNode,
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
   const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true); 

  async function singIn({ email, password }: UserSingInDTO) {
    await api.post('/sessions', { email, password })
      .then(({data}) => {
        setUser(data.user)
        storageUserSave(data.user)
      })
      .catch((error) => {
        console.log(error);
        throw error;
      })
  }

  async function singOut() {
    try
    {
      setIsLoadingUserStorageData(false);
      setUser({} as UserDTO);
      await storageUserRemove();
    }catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
    
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();

      if(userLogged) {
        setUser(userLogged);
      } 
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData()
  },[])

  return (
    <AuthContext.Provider value={{
      user,
      singIn,
      singOut,
      isLoadingUserStorageData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}