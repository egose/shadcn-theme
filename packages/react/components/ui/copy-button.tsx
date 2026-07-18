import * as React from 'react';
import _isString from 'lodash-es/isString';
import { useClipboard } from '../../hooks/use-clipboard';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { UnstyledButton } from './unstyled-button';
import { cn } from '../../utils/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';

export interface CopyableButtonProps {
  children?: React.ReactNode;
  value?: string;
  className?: string;
  appearance?: 'inline' | 'icon';
  tooltipCopyText?: React.ReactNode;
  tooltipCopiedText?: React.ReactNode;
}

export function CopyableButton({
  children,
  value,
  className,
  appearance = 'inline',
  tooltipCopyText = 'Copy',
  tooltipCopiedText = 'Copied',
}: CopyableButtonProps) {
  const clipboard = useClipboard({ timeout: 1000 });
  const [open, setOpen] = React.useState(false);

  const isText = _isString(children);
  const copyValue = value ?? (isText ? children : '');
  const tooltipText = clipboard.copied ? tooltipCopiedText : tooltipCopyText;
  const icon = clipboard.copied ? <CheckIcon /> : <CopyIcon />;

  const handleCopy = () => {
    clipboard.copy(String(copyValue));
    setOpen(true);
  };

  const trigger =
    appearance === 'icon' ? (
      <Button
        type="button"
        variant="secondary"
        appearance="outline"
        size="icon-sm"
        onClick={handleCopy}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={className}
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
      >
        {icon}
      </Button>
    ) : (
      <UnstyledButton
        onClick={handleCopy}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={cn('inline-flex cursor-pointer items-center gap-1', className)}
        aria-label="Copy to clipboard"
        title="Copy to clipboard"
      >
        {children && <span className={cn({ 'hover:underline': isText })}>{children}</span>}
        {icon}
      </UnstyledButton>
    );

  return (
    <Tooltip open={open || clipboard.copied}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
