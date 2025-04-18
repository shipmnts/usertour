'use client';

import { useAppContext } from '@/contexts/app-context';
import { useContentDetailContext } from '@/contexts/content-detail-context';
import { useContentVersionContext } from '@/contexts/content-version-context';
import { useEventListContext } from '@/contexts/event-list-context';
import { ColumnDef, Row } from '@tanstack/react-table';
import { CancelIcon, PlayIcon } from '@usertour-ui/icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@usertour-ui/tooltip';
import { TooltipProvider } from '@usertour-ui/tooltip';
import { BizEvents, BizSessionObject, ChecklistData, ContentDataType } from '@usertour-ui/types';
import { formatDistanceStrict, formatDistanceToNow } from 'date-fns';
import { DataTableColumnHeader } from './data-table-column-header';

const LauncherProgressColumn = ({ original }: Row<BizSessionObject>) => {
  const { bizEvent } = original;
  const { eventList } = useEventListContext();
  if (!eventList || !bizEvent || bizEvent.length === 0) {
    return <></>;
  }

  const activatedEvent = eventList?.find((e) => e.codeName === BizEvents.LAUNCHER_ACTIVATED);
  const dismissedEvent = eventList.find((e) => e.codeName === BizEvents.LAUNCHER_DISMISSED);

  if (!activatedEvent || !dismissedEvent) {
    return <></>;
  }

  const isActivated = !!bizEvent.find((e) => e.eventId === activatedEvent.id);
  const isDismissed = !!bizEvent.find((e) => e.eventId === dismissedEvent.id);

  return (
    <div className="flex flex-row items-center space-x-3">
      {!isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <PlayIcon className="text-success h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Active</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <CancelIcon className="text-foreground/60 h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Dismissed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex flex-col">
        {!isActivated && <div className="text-muted-foreground">Seen</div>}
        {isActivated && <div className="text-success">Activated</div>}
      </div>
    </div>
  );
};

const ChecklistProgressColumn = ({ original }: Row<BizSessionObject>) => {
  const { bizEvent } = original;
  const { eventList } = useEventListContext();
  const { version } = useContentVersionContext();
  const data = version?.data as ChecklistData;

  if (!eventList || !bizEvent || bizEvent.length === 0 || !data) {
    return <></>;
  }

  const completeEvent = eventList?.find((e) => e.codeName === BizEvents.CHECKLIST_COMPLETED);
  const dismissedEvent = eventList.find((e) => e.codeName === BizEvents.CHECKLIST_DISMISSED);

  const taskCompletedEvent = eventList.find(
    (e) => e.codeName === BizEvents.CHECKLIST_TASK_COMPLETED,
  );

  if (!completeEvent || !dismissedEvent) {
    return <></>;
  }

  const completeBizEvent = bizEvent.find((e) => e.eventId === completeEvent.id);
  const dismissedBizEvent = bizEvent.find((e) => e.eventId === dismissedEvent.id);

  // Sort events by creation time
  const firstEvent = bizEvent.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0];

  const checklistItemIds = bizEvent
    .filter((e) => e.eventId === taskCompletedEvent?.id)
    .map((e) => e.data?.checklist_task_id);

  const completedItemIds = data.items.filter((item) => checklistItemIds.includes(item.id));

  const progress = Math.floor((completedItemIds.length / data.items.length) * 100);

  const completeDate =
    completeBizEvent && firstEvent
      ? formatDistanceStrict(new Date(completeBizEvent.createdAt), new Date(firstEvent.createdAt))
      : null;
  const isComplete = !!completeBizEvent;
  const isDismissed = !!dismissedBizEvent;

  return (
    <div className="flex flex-row items-center space-x-3">
      {!isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <PlayIcon className="text-success h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Active</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <CancelIcon className="text-foreground/60 h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Dismissed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex flex-col">
        {!isComplete && <span>{progress}%</span>}
        {isComplete && (
          <div className="text-success font-bold text-left">{`Completed in ${completeDate}`}</div>
        )}
      </div>
    </div>
  );
};

const FlowProgressColumn = ({ original }: Row<BizSessionObject>) => {
  const { bizEvent } = original;
  const { eventList } = useEventListContext();
  if (!eventList || !bizEvent || bizEvent.length === 0) {
    return <></>;
  }

  const completeEvent = eventList?.find((e) => e.codeName === BizEvents.FLOW_COMPLETED);
  const itemSeenEvent = eventList.find((e) => e.codeName === BizEvents.FLOW_STEP_SEEN);

  const endedEvent = eventList.find((e) => e.codeName === BizEvents.FLOW_ENDED);

  if (!completeEvent || !itemSeenEvent || !endedEvent) {
    return <></>;
  }

  const completeBizEvent = bizEvent.find((e) => e.eventId === completeEvent.id);
  const lastSeenBizEvent = bizEvent
    .filter((e) => e.eventId === itemSeenEvent.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  // Sort events by creation time
  const firstEvent = bizEvent.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0];

  const endedBizEvent = bizEvent.find((e) => e.eventId === endedEvent.id);

  const completeDate =
    completeBizEvent && firstEvent
      ? formatDistanceStrict(new Date(completeBizEvent.createdAt), new Date(firstEvent.createdAt))
      : null;
  const isComplete = !!completeBizEvent;
  const isDismissed = !!endedBizEvent;

  return (
    <div className="flex flex-row items-center space-x-3">
      {!isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <PlayIcon className="text-success h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Active</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {isDismissed && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <CancelIcon className="text-foreground/60 h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Dismissed</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex flex-col">
        {!isComplete && <span>{lastSeenBizEvent?.data?.flow_step_progress ?? 0}%</span>}
        {isComplete && (
          <div className="text-success font-bold text-left">{`Completed in ${completeDate}`}</div>
        )}
        <div className="text-left text-muted-foreground">
          <div className="text-muted-foreground">
            {lastSeenBizEvent &&
              `Step ${lastSeenBizEvent?.data?.flow_step_number + 1}.
      ${lastSeenBizEvent?.data?.flow_step_name}`}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressColumn = (props: Row<BizSessionObject>) => {
  const { content } = useContentDetailContext();
  const contentType = content?.type;

  if (contentType === ContentDataType.CHECKLIST) {
    return <ChecklistProgressColumn {...props} />;
  }

  if (contentType === ContentDataType.FLOW) {
    return <FlowProgressColumn {...props} />;
  }
  if (contentType === ContentDataType.LAUNCHER) {
    return <LauncherProgressColumn {...props} />;
  }

  return <></>;
};

const CreateAtColumn = ({ original }: Row<BizSessionObject>) => {
  const { bizEvent, createdAt } = original;

  // If no events, show creation time
  if (!bizEvent?.length) {
    return (
      <div className="flex space-x-2">
        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
      </div>
    );
  }

  // Get the most recent event time using Math.max
  const lastEventTime = Math.max(...bizEvent.map((event) => new Date(event.createdAt).getTime()));

  return (
    <div className="flex space-x-2">
      {formatDistanceToNow(new Date(lastEventTime), { addSuffix: true })}
    </div>
  );
};

export const columns: ColumnDef<BizSessionObject>[] = [
  {
    accessorKey: 'bizUserId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => {
      const { environment } = useAppContext();
      const href = `/env/${environment?.id}/user/${row.getValue('bizUserId')}`;
      return (
        <a
          href={href}
          className="text-muted-foreground hover:text-primary hover:underline underline-offset-4 "
        >
          {row.original.bizUser.externalId}
        </a>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Progress" />,
    cell: ({ row }) => <ProgressColumn {...row} />,
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last activity" />,
    cell: ({ row }) => <CreateAtColumn {...row} />,
    enableSorting: false,
  },
];
