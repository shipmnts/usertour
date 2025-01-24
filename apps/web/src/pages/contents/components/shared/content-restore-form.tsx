"use client";
import * as React from "react";
import { Icons } from "@/components/atoms/icons";
import { Button } from "@usertour-ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@usertour-ui/dialog";
import { restoreContentVersion } from "@usertour-ui/gql";
import { useMutation } from "@apollo/client";
import { useToast } from "@usertour-ui/use-toast";
import { ContentVersion } from "@usertour-ui/types";
import { getErrorMessage } from "@usertour-ui/shared-utils";

interface ContentRestoreFormProps {
  version: ContentVersion;
  onSubmit: (success: boolean) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContentRestoreForm = (props: ContentRestoreFormProps) => {
  const { version, onSubmit, open, onOpenChange } = props;
  const [mutation] = useMutation(restoreContentVersion);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  async function handleOnSubmit() {
    try {
      setIsLoading(true);
      const { data } = await mutation({
        variables: { versionId: version.id },
      });
      setIsLoading(false);
      if (data.restoreContentVersion.id) {
        toast({
          variant: "success",
          title: "The version retored successfully.",
        });
        onSubmit(true);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: getErrorMessage(error),
      });
      onSubmit(false);
      setIsLoading(false);
    }
  }

  return (
    <Dialog defaultOpen={true} open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restore version </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            This will load all of the original flow of v{version.sequence} into
            the Builder.
          </p>
          <p>Restore Builder to v{version.sequence}?</p>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="flex-none"
            type="submit"
            disabled={isLoading}
            onClick={handleOnSubmit}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Yes, restore
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
