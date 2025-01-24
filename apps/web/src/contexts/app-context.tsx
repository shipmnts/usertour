import { Environment, Project } from "@/types/project";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserInfo } from "@usertour-ui/gql";
import { useQuery } from "@apollo/client";
import { UserProfile } from "@usertour-ui/types";

interface AppContextProps {
  environment: Environment | null;
  setEnvironment: React.Dispatch<React.SetStateAction<Environment | null>>;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  userInfo: UserProfile | null | undefined;
  setUserInfo: React.Dispatch<
    React.SetStateAction<UserProfile | null | undefined>
  >;
  refetch: any;
}

export const AppContext = createContext<AppContextProps | null>(null);

export interface AppProviderProps {
  children?: ReactNode;
}

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props;
  const [environment, setEnvironment] = useState<Environment | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfile | null | undefined>(
    undefined
  );
  const { data, refetch, loading, error } = useQuery(getUserInfo);

  useEffect(() => {
    if (loading || error) {
      if (error) {
        setUserInfo(null);
      }
      return;
    }
    if (!data || !data?.me) {
      setUserInfo(null);
      return;
    }
    setUserInfo({ ...data.me });
    const activedProjects = data?.me?.projects.filter((p: any) => {
      return p.actived == true;
    });
    if (activedProjects && activedProjects.length > 0) {
      const userProject = activedProjects[0];
      setProject({
        role: userProject.role,
        actived: userProject?.actived,
        ...userProject?.project,
      });
    }
  }, [data, loading, error]);

  const value = {
    environment,
    setEnvironment,
    project,
    setProject,
    userInfo,
    setUserInfo,
    refetch,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext(): AppContextProps {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`useAppContext must be used within a AppProvider.`);
  }
  return context;
}
