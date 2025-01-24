import {
  AdminLayoutNewContent,
  AdminNewLayout,
} from "./components/admin-layout";
import { SettingsSidebarNav } from "./components/settings-sidebar-nav";
import { AdminMainNewNav } from "./components/admin-main-nav";
import { ScrollArea } from "@usertour-ui/scroll-area";
import { useParams } from "react-router-dom";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export const AdminSettingsLayout = ({ children }: SettingsLayoutProps) => {
  const { settingType } = useParams();
  return (
    <>
      <AdminNewLayout>
        <AdminMainNewNav />
        <AdminLayoutNewContent
          className={settingType === "account" ? "bg-slate-50" : ""}
        >
          <SettingsSidebarNav />
          <ScrollArea className="h-full w-full ">{children}</ScrollArea>
        </AdminLayoutNewContent>
      </AdminNewLayout>
    </>
  );
};

AdminSettingsLayout.displayName = "AdminSettingsLayout";
