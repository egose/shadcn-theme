'use client';

import { Label } from '../../../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../../../components/ui/radio-group';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Radio Group"
      description="Radio groups let users pick exactly one option from a visible set of choices."
    >
      <ExampleSection title="Display density" description="Group related options with matching labels and helper text.">
        <ExampleStack>
          <RadioGroup defaultValue="comfortable" className="w-fit">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Default</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Comfortable</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Compact</Label>
            </div>
          </RadioGroup>
          <RadioGroup defaultValue="public" className="w-fit" disabled>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="internal" id="r-disabled-1" />
              <Label htmlFor="r-disabled-1">Internal only</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="beta" id="r-disabled-2" />
              <Label htmlFor="r-disabled-2">Private beta</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="public" id="r-disabled-3" />
              <Label htmlFor="r-disabled-3">Public launch</Label>
            </div>
          </RadioGroup>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
