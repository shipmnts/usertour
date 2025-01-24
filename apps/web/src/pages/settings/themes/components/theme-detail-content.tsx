import { useThemeDetailContext } from "@/contexts/theme-detail-context";
import { ThemeSettings } from "./settings";
import { ThemeDetailPreview } from "./theme-detail-preview";
import { deepmerge } from "deepmerge-ts";
import { defaultSettings } from "@/types/theme-settings";

export const ThemeDetailContent = () => {
  const { setSettings, theme } = useThemeDetailContext();
  return (
    <div className="flex flex-row pt-24 px-8 ">
      <ThemeSettings
        onChange={setSettings}
        defaultSettings={deepmerge(defaultSettings, theme.settings)}
      />
      <ThemeDetailPreview />
    </div>
  );
};

ThemeDetailContent.displayName = "ThemeDetailContent";
