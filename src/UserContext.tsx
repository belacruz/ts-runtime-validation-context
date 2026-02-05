import React, { type PropsWithChildren } from 'react';
import useFetch from './useFetch.tsx';
import {
  UserShapeValidado,
  type User,
  type UserContent,
} from './UserSchema.ts';

type IUserContext = {
  data: User[] | null;
  loading: boolean;
  error: string | null;
  userData: UserContent | null;
  userLoading: boolean;
  userError: string | null;
  fetchUser: (id: number) => void;
};

const UserContext = React.createContext<IUserContext | null>(null);

export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (context === null)
    throw new Error('useContext deve estar dentro do provider');
  return context;
};

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const { data, loading, error } = useFetch<unknown>(
    'https://data.origamid.dev/usuarios/',
  );

  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useFetch<User>(
    selectedId ? `https://data.origamid.dev/usuarios/${selectedId}` : null,
  );

  const fetchUser = React.useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  function isUserArray(value: unknown): value is User[] {
    if (!Array.isArray(value)) return false;
    return value.every((d) => UserShapeValidado.parse(d).success);
  }

  function isUserContent(value: unknown): value is UserContent {
    return UserShapeValidado.parse(value).success;
  }

  const validateUserData = React.useMemo<UserContent | null>(() => {
    if (isUserArray(userData)) return null;
    if (!isUserContent(userData)) return null;
    return userData;
  }, [userData]);

  const validateUser = React.useMemo<User[] | null>(() => {
    if (!isUserArray(data)) return null;
    return data;
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        data: validateUser,
        loading,
        error,
        userData: validateUserData,
        userLoading,
        userError,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
