'use client';

import type { TeamMember } from '@/types/theme-settings';
import { Button } from '@usertour-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@usertour-ui/dialog';
import { SpinnerIcon } from '@usertour-ui/icons';
import { useCancelInviteMutation } from '@usertour-ui/shared-hooks';
import { getErrorMessage } from '@usertour-ui/shared-utils';
import { useToast } from '@usertour-ui/use-toast';
import * as React from 'react';

interface EditFormProps {
  projectId: string;
  isOpen: boolean;
  data: TeamMember;
  onClose: () => void;
}

export const CancelInviteDialog = (props: EditFormProps) => {
  const { onClose, isOpen, data, projectId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { invoke } = useCancelInviteMutation();

  const showError = (title: string) => {
    toast({
      variant: 'destructive',
      title,
    });
  };

  async function handleOnSubmit() {
    setIsLoading(true);
    try {
      if (!data.inviteId) {
        return;
      }
      const response = await invoke(projectId, data.inviteId);
      if (response) {
        onClose();
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(op) => !op && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm </DialogTitle>
        </DialogHeader>
        <DialogDescription>Confirm canceling invite to {data.email}?</DialogDescription>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onClose()}>
            No, do nothing
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleOnSubmit}>
            {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
            Yes, cancel invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

CancelInviteDialog.displayName = 'CancelInviteDialog';
