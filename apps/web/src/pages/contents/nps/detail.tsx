import { ContentDetailProvider } from "@/contexts/content-detail-context";
import { ContentVersionProvider } from "@/contexts/content-version-context";
import { SegmentListProvider } from "@/contexts/segment-list-context";
import { ContentListProvider } from "@/contexts/content-list-context";
import { ContentVersionListProvider } from "@/contexts/content-version-list-context";
import { useAppContext } from "@/contexts/app-context";
import { ContentDetailHeader } from "../components/detail/content-detail-header";
import { ContentDetailVersion } from "../components/version/content-detail-version";
import { ContentDetailAnalytics } from "../components/version/content-detail-analytics";
import { ContentLocalizationList } from "../components/version/content-localization-list";
import { ContentTypeName } from "@usertour-ui/types";
import { ThemeListProvider } from "@/contexts/theme-list-context";
import { ContentDetailSettings } from "../components/detail/content-detail-settings";
import { ContentDetailContent } from "../components/detail/content-detail-content";

export const NpsDetailContent = () => {
  const { project } = useAppContext();

  return (
    <ThemeListProvider projectId={project?.id}>
      <div className="p-14 mt-12 ">
        <div className="flex flex-row space-x-8 justify-center max-w-screen-xl mx-auto">
          <ContentDetailSettings />
          <ContentDetailContent />
        </div>
      </div>
    </ThemeListProvider>
  );
};

NpsDetailContent.displayName = "NpsDetailContent";

interface NpsDetailProps {
  contentId: string;
  type: string;
}
export const NpsDetail = (props: NpsDetailProps) => {
  const { contentId, type } = props;
  const { environment } = useAppContext();

  return (
    <SegmentListProvider
      environmentId={environment?.id}
      bizType={["COMPANY", "USER"]}
    >
      <ContentListProvider
        environmentId={environment?.id}
        key={"environmentId"}
        contentType={ContentTypeName.NPS}
        defaultPagination={{ pageSize: 100, pageIndex: 0 }}
      >
        <ContentDetailProvider
          contentId={contentId}
          contentType={ContentTypeName.NPS}
        >
          <ContentVersionProvider>
            <ContentVersionListProvider contentId={contentId}>
              <ContentDetailHeader />
              {type == "detail" && <NpsDetailContent />}
              {type == "versions" && <ContentDetailVersion />}
              {type == "analytics" && (
                <ContentDetailAnalytics contentId={contentId} />
              )}
              {type == "localization" && <ContentLocalizationList />}
            </ContentVersionListProvider>
          </ContentVersionProvider>
        </ContentDetailProvider>
      </ContentListProvider>
    </SegmentListProvider>
  );
};

NpsDetail.displayName = "NpsDetail";
