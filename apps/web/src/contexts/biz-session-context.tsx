import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@apollo/client";
import { queryBizSession } from "@usertour-ui/gql";
import { BizSessionObject, PageInfo, Pagination } from "@usertour-ui/types";
import { PaginationState } from "@tanstack/react-table";
import { useAnalyticsContext } from "./analytics-context";

const defaultPagination = {
  pageIndex: 0,
  pageSize: 10,
};

export interface BizSessionProviderProps {
  children?: ReactNode;
  contentId: string;
  defaultPagination?: typeof defaultPagination;
}

export interface BizSessionContextValue {
  refetch: any;
  requestPagination: Pagination;
  setRequestPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  pageCount: number;
  bizSessions: BizSessionObject[];
  totalCount: number;
}

export const BizSessionContext = createContext<
  BizSessionContextValue | undefined
>(undefined);

export function BizSessionProvider(
  props: BizSessionProviderProps
): JSX.Element {
  const { children, contentId } = props;
  const [requestPagination, setRequestPagination] = useState<Pagination>({
    first: defaultPagination.pageSize,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    ...defaultPagination,
  });
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [currentPagination, setCurrentPagination] = useState<PaginationState>({
    ...defaultPagination,
  });
  const [currentPageInfo, setCurrentPageInfo] = useState<PageInfo>();
  const [bizSessions, setBizSessions] = useState<BizSessionObject[]>([]);
  const [pageCount, setPageCount] = useState(defaultPagination.pageSize);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { dateRange } = useAnalyticsContext();

  const { data, refetch } = useQuery(queryBizSession, {
    variables: {
      ...requestPagination,
      query: {
        contentId,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
        timezone,
      },
      orderBy: { field: "createdAt", direction: "desc" },
    },
  });

  const contentList = data && data.queryBizSession;

  useEffect(() => {
    const { pageIndex, pageSize } = pagination;
    let varis: Pagination = { first: pageSize };
    if (
      currentPagination &&
      pageSize == currentPagination.pageSize &&
      pageIndex == currentPagination.pageIndex
    ) {
      return;
    }

    if (pageIndex == 0) {
      varis = { first: pageSize };
    } else if (pageIndex + 1 == pageCount) {
      const costSize = totalCount - (pageCount - 1) * pageSize;
      varis = {
        last: costSize > 0 ? costSize : pageSize,
      };
    } else if (currentPageInfo && pageIndex > currentPagination.pageIndex) {
      varis = {
        first: pageSize,
        after: currentPageInfo.endCursor,
      };
    } else if (currentPageInfo && pageIndex < currentPagination.pageIndex) {
      varis = {
        last: pageSize,
        before: currentPageInfo.startCursor,
      };
    }
    setCurrentPagination({ ...pagination });
    setRequestPagination(varis);
  }, [pagination, currentPagination, currentPageInfo, totalCount]);

  useEffect(() => {
    if (!contentList) {
      return;
    }
    const { edges, pageInfo, totalCount } = contentList;
    if (!edges || !pageInfo) {
      return;
    }
    setCurrentPageInfo(pageInfo);
    const c: BizSessionObject[] = edges.map((e: any) => {
      return { ...e.node };
    });
    setBizSessions(c);
    setTotalCount(totalCount);
    setPageCount(Math.ceil(totalCount / currentPagination.pageSize));
  }, [contentList, currentPagination]);

  useEffect(() => {
    if (!dateRange) {
      return;
    }
    setPagination((pre) => ({ ...pre, pageIndex: 0 }));
  }, [dateRange]);

  useEffect(() => {
    refetch();
  }, [requestPagination]);

  const value: BizSessionContextValue = {
    bizSessions,
    refetch,
    requestPagination,
    setRequestPagination,
    pagination,
    setPagination,
    pageCount,
    totalCount,
  };

  return (
    <BizSessionContext.Provider value={value}>
      {children}
    </BizSessionContext.Provider>
  );
}

export function useBizSessionContext(): BizSessionContextValue {
  const context = useContext(BizSessionContext);
  if (!context) {
    throw new Error(
      `useBizSessionContext must be used within a BizSessionProvider.`
    );
  }
  return context;
}
