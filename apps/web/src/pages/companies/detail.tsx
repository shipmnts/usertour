import { useParams } from "react-router-dom";
import { CompanyListProvider } from "@/contexts/company-list-context";
import { CompanyDetailContent } from "./components/detail-content";
import { useAppContext } from "@/contexts/app-context";

export const CompanyDetail = () => {
  const { companyId } = useParams();
  const { environment } = useAppContext();
  return (
    <CompanyListProvider
      environmentId={environment?.id}
      defaultQuery={{ companyId }}
    >
      {environment?.id && companyId && (
        <CompanyDetailContent
          environmentId={environment?.id}
          companyId={companyId}
        />
      )}
    </CompanyListProvider>
  );
};

CompanyDetail.displayName = "CompanyDetail";
