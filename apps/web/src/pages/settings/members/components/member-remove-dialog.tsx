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
import { useRemoveTeamMemberMutation } from '@usertour-ui/shared-hooks';
import { getErrorMessage } from '@usertour-ui/shared-utils';
import { useToast } from '@usertour-ui/use-toast';
import * as React from 'react';

interface MemberRemoveDialogProps {
  projectId: string;
  isOpen: boolean;
  data: TeamMember;
  onClose: () => void;
}

export const MemberRemoveDialog = (props: MemberRemoveDialogProps) => {
  const { onClose, isOpen, data, projectId } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { invoke } = useRemoveTeamMemberMutation();

  const showError = (title: string) => {
    toast({
      variant: 'destructive',
      title,
    });
  };

  async function handleOnSubmit() {
    setIsLoading(true);
    try {
      if (!data.userId) {
        return;
      }
      const response = await invoke(projectId, data.userId);
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
        <DialogDescription>Confirm removing member, {data.email}?</DialogDescription>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onClose()}>
            Canel
          </Button>
          <Button type="submit" disabled={isLoading} onClick={handleOnSubmit}>
            {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
            Remove member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

MemberRemoveDialog.displayName = 'MemberRemoveDialog';
