import React, { useState } from 'react';
import _isString from 'lodash-es/isString';
import { useClipboard } from '../../hooks/use-clipboard';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip';
import { UnstyledButton } from './unstyled-button';
import { cn } from '../../lib/utils';

// See https://tabler.io/icons/icon/clipboard-copy
function CopyClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard-copy"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h3m9 -9v-5a2 2 0 0 0 -2 -2h-2" />
      <path d="M13 17v-1a1 1 0 0 1 1 -1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1 -1 1h-1m-3 0h-1a1 1 0 0 1 -1 -1v-1" />
      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
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
          {isText && <CopyClipboardIcon />}
        </UnstyledButton>
      </TooltipTrigger>
      <TooltipContent>{clipboard.copied ? 'Copied' : 'Copy'}</TooltipContent>
    </Tooltip>
  );
}
