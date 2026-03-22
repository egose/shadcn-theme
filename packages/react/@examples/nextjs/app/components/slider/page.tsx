'use client';

import { Slider } from '../../../../../components/ui/slider';

export default function Page() {
  return (
    <div className="pt-2">
      <Slider defaultValue={[75]} max={100} step={1} className="mx-auto w-full max-w-xs" />
    </div>
  );
}
