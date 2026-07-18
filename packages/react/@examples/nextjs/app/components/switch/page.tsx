'use client';

import * as React from 'react';
import { Label } from '../../../../../components/ui/label';
import { Switch } from '../../../../../components/ui/switch';
import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';

export default function Page() {
  const [airplane, setAirplane] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <ExamplePage title="Switch" description="Switches are binary toggles for settings and persistent preferences.">
      <ExampleSection title="Controlled toggles">
        <ExampleStack>
          <div className="flex items-center gap-3">
            <Switch id="airplane-mode" checked={airplane} onCheckedChange={setAirplane} />
            <Label htmlFor="airplane-mode">Airplane mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            <Label htmlFor="notifications">Email notifications</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="disabled" disabled />
            <Label htmlFor="disabled">Disabled switch</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Airplane mode is {airplane ? 'on' : 'off'} and notifications are {notifications ? 'enabled' : 'disabled'}.
          </p>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
