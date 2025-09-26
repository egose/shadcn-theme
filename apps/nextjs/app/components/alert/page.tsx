'use client';

import _startCase from 'lodash-es/startCase';
import { Alert, AlertTitle, AlertDescription } from '../../../../../packages/react/components/ui/alert';
import { BasicAlert } from '../../../../../packages/react/components/ui/basic-alert';
import {
  IconCircleCheck,
  IconInfoCircle,
  IconBatteryExclamation,
  IconCircleDashed,
  IconBell,
  IconStar,
  IconThumbUp,
  IconMapBolt,
  IconLink,
  IconGhost,
} from '@tabler/icons-react';

// All possible values from your alertVariants definition
const variants = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'light',
  'dark',
  'accent',
  'destructive',
  'muted',
  'link',
  'ghost',
] as const;

const appearances = ['solid', 'light'] as const;

export default function Page() {
  return (
    <>
      <h1 className="font-bold text-2xl mt-4 mb-5">Alert Showcase</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        {/* Solid Appearance */}
        <Section title="Solid Appearance">
          <div className="grid gap-2">
            {variants.map((variant) => (
              <Alert key={`${variant}-solid`} variant={variant} appearance="solid">
                {getIcon(variant)}
                <AlertTitle>{_startCase(variant)} Alert Title</AlertTitle>
                <AlertDescription>
                  This is a solid {_startCase(variant)} alert with an icon, title and description.
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Section>

        {/* Basic Solid Appearance */}
        <Section title="Basic Solid Appearance">
          <div className="grid gap-2">
            {variants.map((variant) => (
              <BasicAlert
                key={`${variant}-solid`}
                variant={variant}
                appearance="solid"
                title={`${_startCase(variant)} Alert Title`}
                description={`This is a solid ${_startCase(variant)} alert with an icon, title and description.`}
              />
            ))}
          </div>
        </Section>

        {/* Light Appearance */}
        <Section title="Light Appearance">
          <div className="grid gap-2">
            {variants.map((variant) => (
              <Alert key={`${variant}-light`} variant={variant} appearance="light">
                {getIcon(variant)}
                <AlertTitle>{_startCase(variant)} Alert Title</AlertTitle>
                <AlertDescription>
                  This is a light {_startCase(variant)} alert with an icon, title and description.
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Section>

        {/* Basic Light Appearance */}
        <Section title="Basic Solid Appearance">
          <div className="grid gap-2">
            {variants.map((variant) => (
              <BasicAlert
                key={`${variant}-light`}
                variant={variant}
                appearance="light"
                title={`${_startCase(variant)} Alert Title`}
                description={`This is a light ${_startCase(variant)} alert with an icon, title and description.`}
              />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

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
      return <IconCircleDashed className="size-5 translate-y-0.5 text-current" />;
    case 'muted':
      return <IconBell className="size-5 translate-y-0.5 text-current" />;
    case 'accent':
      return <IconStar className="size-5 translate-y-0.5 text-current" />;
    case 'primary':
      return <IconThumbUp className="size-5 translate-y-0.5 text-current" />;
    case 'secondary':
      return <IconMapBolt className="size-5 translate-y-0.5 text-current" />;
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
