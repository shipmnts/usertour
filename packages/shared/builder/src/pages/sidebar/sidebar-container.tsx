import { SidebarMini } from './sidebar-mini';

import { Card } from '@usertour-ui/card';
import { EXTENSION_SIDEBAR_MAIN } from '@usertour-ui/constants';
import { cn } from '@usertour-ui/ui-utils';
import { useRef } from 'react';
import { useBuilderContext } from '../../contexts';

interface SidebarContainerProps {
  children: React.ReactNode;
  className?: string;
}
export const SidebarContainer = ({ children, className }: SidebarContainerProps) => {
  const { position, zIndex } = useBuilderContext();
  const sidbarRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      style={{ zIndex: zIndex + EXTENSION_SIDEBAR_MAIN }}
      className={cn(
        'w-80 h-screen p-2 fixed top-0',
        position === 'left' ? 'left-0' : 'right-0',
        className,
      )}
      ref={sidbarRef}
    >
      <SidebarMini container={sidbarRef} />
      <Card className="h-full flex flex-col bg-background-800">{children}</Card>
    </div>
  );
};

SidebarContainer.displayName = 'SidebarContainer';
