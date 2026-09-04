'use client';

import { Badge } from '@egose/shadcn-theme/components/ui/badge';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@egose/shadcn-theme/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@egose/shadcn-theme/components/ui/tooltip';

import type { BillingPeriod, Plan } from '../types';

type PlanCardProps = {
  plan: Plan;
  billing: BillingPeriod;
  isCurrent: boolean;
  /** True while any plan-change request is in flight. */
  busy: boolean;
  /** Receives the plan and the clicked button so the caller can restore focus to it. */
  onSelect: (plan: Plan, trigger: HTMLButtonElement) => void;
};

export function PlanCard({ plan, billing, isCurrent, busy, onSelect }: PlanCardProps) {
  const price = billing === 'monthly' ? plan.monthlyPrice : plan.annualMonthlyPrice;

  return (
    <Card aria-label={`${plan.name} plan`} className="flex flex-col">
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.tagline}</CardDescription>
        {(isCurrent || plan.recommended) && (
          <CardAction className="flex flex-col items-end gap-1">
            {isCurrent && <Badge variant="secondary">Current plan</Badge>}
            {plan.recommended && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="primary">Recommended</Badge>
                  </TooltipTrigger>
                  <TooltipContent>Suggested for most growing teams.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p aria-live="polite">
          <span className="text-2xl font-semibold">${price}</span>
          <span className="text-muted-foreground"> per month</span>
          {billing === 'annual' && (
            <span className="text-muted-foreground mt-1 block text-xs">Billed annually — {plan.annualSavings}.</span>
          )}
        </p>
        <ul aria-label={`${plan.name} plan includes`} className="text-muted-foreground list-disc space-y-1 pl-4">
          {plan.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrent ? (
          <Button type="button" variant="secondary" disabled className="w-full">
            Current plan
          </Button>
        ) : (
          <Button
            type="button"
            variant={plan.recommended ? 'primary' : 'secondary'}
            className="w-full"
            disabled={busy}
            onClick={(event) => onSelect(plan, event.currentTarget)}
          >
            Choose {plan.name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
