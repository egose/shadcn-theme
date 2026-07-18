import * as React from 'react';

import { cn } from '../../utils/ui';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  classNames?: {
    root?: string;
    content?: string;
    title?: string;
    description?: string;
    actions?: string;
  };
}

export function PageHeader({ title, description, actions, classNames }: PageHeaderProps) {
  return (
    <div className={cn('mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', classNames?.root)}>
      <div className={cn('min-w-0', classNames?.content)}>
        <h1 className={cn('text-3xl font-bold tracking-tight', classNames?.title)}>{title}</h1>
        {description ? (
          <p className={cn('text-sm text-muted-foreground', classNames?.description)}>{description}</p>
        ) : null}
      </div>

      {actions ? <div className={cn('flex shrink-0 items-center gap-2', classNames?.actions)}>{actions}</div> : null}
    </div>
  );
}
