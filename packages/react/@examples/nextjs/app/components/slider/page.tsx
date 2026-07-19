'use client';

import * as React from 'react';
import { Slider } from '../../../../../components/ui/slider';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  const [value, setValue] = React.useState<number[]>([75]);
  const [range, setRange] = React.useState<number[]>([25, 75]);

  return (
    <ExamplePage
      title="Slider"
      description="Sliders capture numeric input with drag handles and support single values or ranges."
    >
      <ExampleSection title="Single value" description="Use a single slider for thresholds and simple numeric input.">
        <ExampleStack>
          <Slider value={value} onValueChange={setValue} max={100} step={1} className="w-full max-w-sm" />
          <p className="text-sm text-muted-foreground">Current value: {value[0]}</p>
        </ExampleStack>
      </ExampleSection>
      <ExampleSection title="Range" description="Pass an array to capture a min and max value range.">
        <ExampleStack>
          <Slider value={range} onValueChange={setRange} max={100} step={5} className="w-full max-w-sm" />
          <p className="text-sm text-muted-foreground">
            Range: {range[0]} – {range[1]}
          </p>
        </ExampleStack>
      </ExampleSection>
      <ExampleSection title="Disabled">
        <Slider defaultValue={[60]} max={100} step={1} disabled className="w-full max-w-sm" />
      </ExampleSection>
    </ExamplePage>
  );
}
