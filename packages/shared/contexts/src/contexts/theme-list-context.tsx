import { ReactNode, createContext, useContext } from "react";
import { Theme } from "@usertour-ui/types";
import { useQuery } from "@apollo/client";
import { listThemes } from "@usertour-ui/gql";

export interface ThemeListProviderProps {
  children?: ReactNode;
  projectId: string | undefined;
}

export interface ThemeListContextValue {
  themeList: Theme[] | null;
  refetch: any;
}
export const ThemeListContext = createContext<
  ThemeListContextValue | undefined
>(undefined);

export function ThemeListProvider(props: ThemeListProviderProps): JSX.Element {
  const { children, projectId } = props;
  const { data, refetch } = useQuery(listThemes, {
    variables: { projectId: projectId },
  });

  const themeList = data && data.listThemes;
  const value: ThemeListContextValue = {
    themeList,
    refetch,
  };

  return (
    <ThemeListContext.Provider value={value}>
      {children}
    </ThemeListContext.Provider>
  );
}

export function useThemeListContext(): ThemeListContextValue {
  const context = useContext(ThemeListContext);
  if (!context) {
    throw new Error(
      `useThemeListContext must be used within a ThemeListProvider.`
    );
  }
  return context;
}
