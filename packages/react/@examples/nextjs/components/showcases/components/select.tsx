'use client';

import * as React from 'react';

import { ExampleGrid, ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@egose/shadcn-theme/components/ui/select';

export default function SelectShowcase() {
  const [plan, setPlan] = React.useState('growth');

  return (
    <ExamplePage
      title="Select"
      description="Use the custom select when you need richer floating content than a native select can provide."
    >
      <ExampleGrid>
        <ExampleSection title="Grouped options">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="plan-select">Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger id="plan-select">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Plans</SelectLabel>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </ExampleSection>
      </ExampleGrid>
    </ExamplePage>
  );
}
