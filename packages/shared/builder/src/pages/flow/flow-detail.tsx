"use client";

import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@usertour-ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@usertour-ui/card";
import {
  EXTENSION_CONTENT_SIDEBAR,
  MESSAGE_CRX_OPEN_NEW_TARGET,
} from "@usertour-ui/constants";
import { OutlineInput } from "@usertour-ui/input";
import { ScrollArea } from "@usertour-ui/scroll-area";
import { Separator } from "@usertour-ui/separator";
import {
  Align,
  ContentAlignmentData,
  ContentModalPlacementData,
  ContentVersion,
  ModalPosition,
  Side,
  Step,
  Theme,
} from "@usertour-ui/types";
import { cn } from "@usertour-ui/ui-utils";
import {
  ChangeEvent,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BuilderMode, useBuilderContext } from "../../contexts";
import { dataURLtoFile } from "../../utils/aws";
import { ContentAlignment } from "../../components/content-alignment";
import { ContentModal } from "../../components/content-modal";
import { ContentModalPlacement } from "../../components/content-modal-placement";
import { ContentPopper } from "../../components/content-popper";
import {
  ContentSettings,
  ContentSettingsData,
} from "../../components/content-settings";
import { ContentTheme } from "../../components/content-theme";
import { ContentWidth } from "../../components/content-width";
import { SidebarMini } from "../sidebar/sidebar-mini";
import { useAws } from "../../hooks/use-aws";
import {
  useAttributeListContext,
  useContentListContext,
  useThemeListContext,
} from "@usertour-ui/contexts";
import { postProxyMessageToWindow } from "../../utils/post-message";
import { ContentEditorRoot, createValue1 } from "@usertour-ui/shared-editor";
import { defaultStep, getErrorMessage } from "@usertour-ui/shared-utils";
import { SpinnerIcon } from "@usertour-ui/icons";
import { useMutation } from "@apollo/client";
import { addContentStep, updateContentStep } from "@usertour-ui/gql";
import { useToast } from "@usertour-ui/use-toast";
import { ContentType } from "../../components/content-type";
import {
  ExtensionElementListener,
  WebElementListener,
} from "../../components/element-listener";
import { FlowPlacement } from "./components/flow-placement";

const FlowBuilderDetailHeader = () => {
  const { setCurrentMode, currentStep, currentContent, updateCurrentStep } =
    useBuilderContext();

  const handleBackup = () => {
    setCurrentMode({ mode: BuilderMode.FLOW });
  };

  const handleStepNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCurrentStep((pre) => ({
      ...pre,
      name: e.target.value,
    }));
  };

  return (
    <CardHeader className="flex-none p-5 space-y-2">
      <CardTitle className="text-base truncate ...">
        {currentContent?.name}
      </CardTitle>
      <div className="flex">
        <Button
          variant="link"
          size="icon"
          onClick={handleBackup}
          className="mr-2 text-foreground w-6 h-8"
        >
          <ChevronLeftIcon className="h-6 w-6 " />
        </Button>
        <div className="grow text-base leading-8">
          <OutlineInput
            value={currentStep?.name}
            className="h-8 focus-visible:ring-0"
            onChange={handleStepNameChange}
          />
        </div>
      </div>
    </CardHeader>
  );
};

const FlowBuilderDetailBody = () => {
  const {
    zIndex,
    currentStep,
    updateCurrentStep,
    currentTheme,
    projectId,
    webHost,
    isWebBuilder,
  } = useBuilderContext();
  const { themeList } = useThemeListContext();

  const handleEditTheme = useCallback(() => {
    if (!currentStep || !currentTheme) {
      return false;
    }
    const url = `/project/${projectId}/settings/theme/${
      currentStep.themeId || currentTheme.id
    }`;
    if (isWebBuilder) {
      return window.open(url, "_blank");
    }
    postProxyMessageToWindow({
      kind: MESSAGE_CRX_OPEN_NEW_TARGET,
      url: `${webHost}${url}`,
    });
  }, [currentStep, currentTheme]);

  const handleAlignmentChange = (value: ContentAlignmentData) => {
    updateCurrentStep((pre) => ({
      ...pre,
      setting: { ...pre.setting, ...value },
    }));
  };

  const handlePositionChange = (value: ContentModalPlacementData) => {
    updateCurrentStep((pre) => ({
      ...pre,
      setting: { ...pre.setting, ...value },
    }));
  };

  const handleSettingsChange = (value: ContentSettingsData) => {
    updateCurrentStep((pre) => ({
      ...pre,
      setting: { ...pre.setting, ...value },
    }));
  };

  const handleThemeChange = (value: string | undefined) => {
    updateCurrentStep((pre) => ({
      ...pre,
      themeId: value,
    }));
  };

  const handleWidthChange = (width: number) => {
    updateCurrentStep((pre) => ({
      ...pre,
      setting: { ...pre.setting, width },
    }));
  };

  const handleContentTypeChange = (type: string) => {
    updateCurrentStep((pre) => ({
      ...pre,
      type,
    }));
  };

  if (!currentStep) {
    return <></>;
  }

  return (
    <CardContent className="bg-background-900 grow p-0 overflow-hidden">
      <ScrollArea className="h-full ">
        <div className="flex-col space-y-6 p-4">
          <>
            <ContentTheme
              themeList={themeList}
              onEdited={handleEditTheme}
              zIndex={zIndex}
              themeId={currentStep.themeId}
              onChange={handleThemeChange}
            />
            <ContentType
              type={currentStep.type}
              zIndex={zIndex}
              onChange={handleContentTypeChange}
            />
            <Separator />
            <ContentWidth
              type={currentStep.type as "tooltip" | "modal"}
              width={currentStep.setting.width}
              onChange={handleWidthChange}
            />
            {currentStep.type == "tooltip" && <FlowPlacement />}
            {currentStep.type == "tooltip" && (
              <ContentAlignment
                initialValue={{
                  side: currentStep.setting.side as Side,
                  align: currentStep.setting.align as Align,
                  alignType: currentStep.setting.alignType as "auto" | "fixed",
                  sideOffset: currentStep.setting.sideOffset,
                  alignOffset: currentStep.setting.alignOffset,
                }}
                onChange={handleAlignmentChange}
              />
            )}
            {currentStep.type == "modal" && (
              <ContentModalPlacement
                data={
                  {
                    position: currentStep.setting.position,
                    positionOffsetX: currentStep.setting.positionOffsetX,
                    positionOffsetY: currentStep.setting.positionOffsetY,
                  } as ContentModalPlacementData
                }
                onChange={handlePositionChange}
              />
            )}
            <Separator />
            <ContentSettings
              data={{
                enabledBackdrop: currentStep.setting.enabledBackdrop,
                skippable: currentStep.setting.skippable,
                enabledBlockTarget: currentStep.setting.enabledBlockTarget,
              }}
              onChange={handleSettingsChange}
              type={currentStep.type}
            />
          </>
        </div>
      </ScrollArea>
    </CardContent>
  );
};

const FlowBuilderDetailFooter = () => {
  const {
    setCurrentMode,
    currentIndex,
    currentStep,
    fetchContentAndVersion,
    currentVersion,
    setIsShowError,
    contentRef,
  } = useBuilderContext();
  const [backupStepData] = useState(currentStep);
  const { upload } = useAws();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addContentStepMutation] = useMutation(addContentStep);
  const [updateContentStepMutation] = useMutation(updateContentStep);
  const { toast } = useToast();
  const uploadScreenshot = async (currentStep: Step, backupStepData: Step) => {
    if (!currentStep.screenshot) {
      return;
    }
    const { mini, full } = currentStep.screenshot;
    if (
      backupStepData.screenshot &&
      backupStepData.screenshot.mini &&
      backupStepData.screenshot.mini == currentStep?.screenshot?.mini &&
      mini.search(/^https/) !== -1
    ) {
      return { mini, full };
    }
    if (mini.search(/^https/) !== -1) {
      return { mini, full };
    }
    const miniFile = dataURLtoFile(mini, "screenshot-mini.png");
    // const fullFile = dataURLtoFile(full, "screenshot-full.png");
    const miniUrl = await upload(miniFile);
    // const fullUrl = await upload(fullFile);
    return { mini: miniUrl, full: "" };
  };

  const handleSave = useCallback(async () => {
    if (!currentStep || !backupStepData) {
      return;
    }
    if (
      currentStep.type == "tooltip" &&
      ((currentStep.target?.type == "auto" && !currentStep.target?.selectors) ||
        (currentStep.target?.type == "manual" &&
          !currentStep.target?.customSelector))
    ) {
      setIsShowError(true);
      return;
    }
    try {
      let height = 0;
      if (contentRef.current) {
        const rect = contentRef.current?.getBoundingClientRect();
        height = rect.height;
      }
      setIsLoading(true);
      // const screenshot =
      //   currentStep.type == "tooltip"
      //     ? await uploadScreenshot(currentStep, backupStepData)
      //     : { mini: "", full: "" };
      const step = {
        ...currentStep,
        screenshot: { mini: "", full: "" },
        setting: { ...currentStep.setting, height },
      };
      if (!step.id) {
        const ret = await addContentStepMutation({
          variables: { data: { ...step, versionId: currentVersion?.id } },
        });
        if (ret.data.addContentStep && currentVersion?.contentId) {
          await fetchContentAndVersion(
            currentVersion?.contentId,
            currentVersion?.id
          );
        } else {
          return toast({
            variant: "destructive",
            title: "Failed to create step!",
          });
        }
      } else {
        const { id, createdAt, updatedAt, cvid, ...updates } = step;
        const ret = await updateContentStepMutation({
          variables: { stepId: step.id, data: updates },
        });
        if (ret.data.updateContentStep && currentVersion?.contentId) {
          await fetchContentAndVersion(
            currentVersion?.contentId,
            currentVersion?.id
          );
        } else {
          return toast({
            variant: "destructive",
            title: "Failed to create step!",
          });
        }
      }
    } catch (error) {
      return toast({
        variant: "destructive",
        title: getErrorMessage(error),
      });
    }
    setIsLoading(false);
    setCurrentMode({ mode: BuilderMode.FLOW });
  }, [currentStep, currentIndex, backupStepData, contentRef]);

  return (
    <CardFooter className="flex-none p-5">
      <Button className="w-full h-10" disabled={isLoading} onClick={handleSave}>
        {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
        Save
      </Button>
    </CardFooter>
  );
};

const FlowBuilderDetailEmbed = () => {
  const {
    zIndex,
    currentStep,
    updateCurrentStep,
    currentVersion,
    isWebBuilder,
    contentRef,
    currentIndex,
    createStep,
    selectorOutput,
    currentContent,
  } = useBuilderContext();
  const { themeList } = useThemeListContext();
  const { contents } = useContentListContext();
  const { attributeList } = useAttributeListContext();
  const [theme, setTheme] = useState<Theme>();
  const triggerRef = useRef<any>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const createNewStep = (currentVersion: ContentVersion, sequence: number) => {
    const step: Step = {
      ...defaultStep,
      type: "tooltip",
      name: "Untitled",
      data: createValue1,
      sequence,
    };
    return createStep(currentVersion, step);
  };

  useEffect(() => {
    if (!themeList) {
      return;
    }
    if (themeList.length > 0) {
      let theme: Theme | undefined;
      if (currentStep && currentStep.themeId) {
        theme = themeList.find((item) => item.id == currentStep.themeId);
      } else if (currentVersion) {
        theme = themeList.find((item) => item.id == currentVersion.themeId);
      }
      if (theme) {
        setTheme(theme);
      }
    }
  }, [currentStep, themeList, currentVersion]);

  const handleContentChange = (value: ContentEditorRoot[]) => {
    updateCurrentStep((pre) => ({ ...pre, data: value }));
  };

  const handleOnMounted = () => {
    setIsMounted(true);
  };

  useEffect(() => {
    if (selectorOutput) {
      const { target, screenshot } = selectorOutput;
      updateCurrentStep((pre) => ({
        ...pre,
        screenshot,
        target: {
          ...pre.target,
          selectors: target.selectors,
          content: target.content,
          selectorsList: target.selectorsList,
        },
      }));
    }
  }, [selectorOutput]);

  if (!currentStep || !theme) {
    return <></>;
  }

  if (currentStep.type == "tooltip") {
    return (
      <>
        {isWebBuilder && (
          <WebElementListener ref={triggerRef} onMounted={handleOnMounted} />
        )}
        {!isWebBuilder && (
          <ExtensionElementListener
            ref={triggerRef}
            selectorTarget={currentStep.target}
            onMounted={handleOnMounted}
          />
        )}
        {isMounted && (
          <ContentPopper
            ref={contentRef as Ref<HTMLDivElement> | undefined}
            theme={theme}
            currentIndex={currentIndex}
            attributeList={attributeList}
            currentContent={currentContent}
            contents={contents}
            triggerRef={triggerRef}
            zIndex={zIndex}
            currentStep={currentStep}
            currentVersion={currentVersion}
            onChange={handleContentChange}
            createStep={createNewStep}
          />
        )}
      </>
    );
  }

  return (
    <>
      <ContentModal
        theme={theme}
        ref={contentRef as Ref<HTMLDivElement> | undefined}
        attributeList={attributeList}
        contents={contents}
        zIndex={zIndex}
        currentIndex={currentIndex}
        currentStep={currentStep}
        currentVersion={currentVersion}
        onChange={handleContentChange}
        createStep={createNewStep}
        currentContent={currentContent}
      />
    </>
  );
};

export const FlowBuilderDetail = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { zIndex, position } = useBuilderContext();

  return (
    <>
      <div
        className={cn(
          "w-80 h-screen p-2 fixed top-0",
          position == "left" ? "left-0" : "right-0"
        )}
        style={{ zIndex: zIndex + EXTENSION_CONTENT_SIDEBAR }}
        ref={ref}
      >
        <SidebarMini container={ref} />
        <Card className="h-full flex flex-col bg-background-800">
          <FlowBuilderDetailHeader />
          <FlowBuilderDetailBody />
          <FlowBuilderDetailFooter />
        </Card>
      </div>
      <FlowBuilderDetailEmbed />
    </>
  );
};

FlowBuilderDetail.displayName = "FlowBuilderDetail";
