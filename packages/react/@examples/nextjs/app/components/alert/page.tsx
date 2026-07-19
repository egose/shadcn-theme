'use client';

import _startCase from 'lodash-es/startCase';
import { Alert, AlertTitle, AlertDescription } from '../../../../../components/ui/alert';
import { BasicAlert } from '../../../../../components/ui/basic-alert';
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
import { ExamplePage, ExampleSection, ExampleStack, ExampleGrid } from '@/components/showcase-shell';

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
    <ExamplePage
      title="Alert"
      description="A feedback surface for surfacing important contextual messages to the user."
    >
      <ExampleGrid>
        <ExampleSection title="Solid Appearance">
          <ExampleStack>
            {variants.map((variant) => (
              <Alert key={`${variant}-solid`} variant={variant} appearance="solid">
                {getIcon(variant)}
                <AlertTitle>{_startCase(variant)} Alert Title</AlertTitle>
                <AlertDescription>
                  This is a solid {_startCase(variant)} alert with an icon, title and description.
                </AlertDescription>
              </Alert>
            ))}
          </ExampleStack>
        </ExampleSection>

        <ExampleSection title="Basic Solid Appearance">
          <ExampleStack>
            {variants.map((variant) => (
              <BasicAlert
                key={`${variant}-solid`}
                variant={variant}
                appearance="solid"
                title={`${_startCase(variant)} Alert Title`}
                description={`This is a solid ${_startCase(variant)} alert with an icon, title and description.`}
              />
            ))}
          </ExampleStack>
        </ExampleSection>

        <ExampleSection title="Light Appearance">
          <ExampleStack>
            {variants.map((variant) => (
              <Alert key={`${variant}-light`} variant={variant} appearance="light">
                {getIcon(variant)}
                <AlertTitle>{_startCase(variant)} Alert Title</AlertTitle>
                <AlertDescription>
                  This is a light {_startCase(variant)} alert with an icon, title and description.
                </AlertDescription>
              </Alert>
            ))}
          </ExampleStack>
        </ExampleSection>

        <ExampleSection title="Basic Light Appearance">
          <ExampleStack>
            {variants.map((variant) => (
              <BasicAlert
                key={`${variant}-light`}
                variant={variant}
                appearance="light"
                title={`${_startCase(variant)} Alert Title`}
                description={`This is a light ${_startCase(variant)} alert with an icon, title and description.`}
              />
            ))}
          </ExampleStack>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
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
