import { useThemeListContext } from "@/contexts/theme-list-context";
import { useState } from "react";
import { ThemeCreateForm } from "./theme-create-form";
import { Button } from "@usertour-ui/button";

export const ThemeListHeader = () => {
  const [open, setOpen] = useState(false);
  const { refetch } = useThemeListContext();
  const handleCreateTheme = () => {
    setOpen(true);
  };
  const handleOnClose = () => {
    setOpen(false);
    refetch();
  };
  return (
    <>
      <div className="relative ">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row justify-between ">
            <h3 className="text-2xl font-semibold tracking-tight">Themes</h3>
            <Button onClick={handleCreateTheme}>New Theme</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              With themes, you can make flows and other Usertour content look
              like a native part of your app.
            </p>
          </div>
        </div>
      </div>
      <ThemeCreateForm isOpen={open} onClose={handleOnClose} />
    </>
  );
};

ThemeListHeader.displayName = "ThemeListHeader";
