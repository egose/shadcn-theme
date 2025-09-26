import * as React from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import {
  IconCircleCheck,
  IconInfoCircle,
  IconBatteryExclamation,
  IconExclamationCircle,
  IconBell,
  IconStar,
  IconThumbUp,
  IconBolt,
  IconLink,
  IconGhost,
} from '@tabler/icons-react';
import type { AlertProps, VariantType } from './alert';

export interface BasicAlertProps extends Omit<AlertProps, 'children'> {
  variant?: VariantType;
  title: string;
  description?: string;
}

export const BasicAlert: React.FC<BasicAlertProps> = ({
  variant = 'primary',
  appearance = 'solid',
  title,
  description,
  ...props
}) => {
  return (
    <Alert variant={variant} appearance={appearance} {...props}>
      {getIcon(variant)}
      <AlertTitle className="capitalize">{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
};

function getIcon(variant: string) {
  switch (variant) {
    case 'success':
      return <IconCircleCheck className="size-5 translate-y-0.5 text-current" />;
    case 'info':
      return <IconInfoCircle className="size-5 translate-y-0.5 text-current" />;
    case 'warning':
      return <IconBatteryExclamation className="size-5 translate-y-0.5 text-current" />;
    case 'danger':
    case 'destructive':
      return <IconExclamationCircle className="size-5 translate-y-0.5 text-current" />;
    case 'muted':
      return <IconBell className="size-5 translate-y-0.5 text-current" />;
    case 'accent':
      return <IconStar className="size-5 translate-y-0.5 text-current" />;
    case 'primary':
      return <IconThumbUp className="size-5 translate-y-0.5 text-current" />;
    case 'secondary':
      return <IconBolt className="size-5 translate-y-0.5 text-current" />;
    case 'link':
      return <IconLink className="size-5 translate-y-0.5 text-current" />;
    case 'ghost':
      return <IconGhost className="size-5 translate-y-0.5 text-current" />;
    case 'light':
    case 'dark':
    default:
      return <IconInfoCircle className="size-5 translate-y-0.5 text-current" />;
  }
}
