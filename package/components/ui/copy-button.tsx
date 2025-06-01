import React, { useState } from 'react';
import _isString from 'lodash-es/isString';
import { useClipboard } from '../../hooks/use-clipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UnstyledButton } from './unstyled-button';
import { cn } from '../../lib/utils';

function CopyClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-4 4h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"
      />
    </svg>
  );
}

export function CopyableButton({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value?: string;
  className?: string;
}) {
  const clipboard = useClipboard({ timeout: 1000 });
  const [showCopied, setShowCopied] = useState(false);

  const isText = _isString(children);
  const copyValue = value ?? (isText ? children : '');

  return (
    <Tooltip open={showCopied}>
      <TooltipTrigger asChild>
        <UnstyledButton
          onClick={() => clipboard.copy(String(copyValue))}
          onMouseEnter={() => setShowCopied(true)}
          onMouseLeave={() => setShowCopied(false)}
          className={cn('inline-flex items-center gap-1 cursor-pointer', className)}
          aria-label="Copy to clipboard"
          title="Copy to clipboard"
        >
          <span className={cn({ 'hover:underline': isText })}>{children}</span>
          {isText && <CopyClipboardIcon className="text-muted" />}
        </UnstyledButton>
      </TooltipTrigger>
      <TooltipContent>{clipboard.copied ? 'Copied' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
}
