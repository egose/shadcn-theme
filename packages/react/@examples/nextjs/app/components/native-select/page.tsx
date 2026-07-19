'use client';

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '../../../../../components/ui/native-select';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage
      title="Native Select"
      description="Styled native select elements keep familiar platform behavior while matching the theme."
    >
      <ExampleSection title="Status options" description="Use native optgroups to keep related options together.">
        <ExampleStack>
          <NativeSelect defaultValue="todo">
            <NativeSelectOption value="">Select status</NativeSelectOption>
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
            <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
          </NativeSelect>
          <NativeSelect disabled defaultValue="done">
            <NativeSelectOption value="todo">Todo</NativeSelectOption>
            <NativeSelectOption value="done">Done</NativeSelectOption>
          </NativeSelect>
          <NativeSelect defaultValue=" Lisbon">
            <NativeSelectOptGroup label="Europe">
              <NativeSelectOption value="lisbon">Lisbon</NativeSelectOption>
              <NativeSelectOption value="berlin">Berlin</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="Americas">
              <NativeSelectOption value="toronto">Toronto</NativeSelectOption>
              <NativeSelectOption value="saopaulo">São Paulo</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
