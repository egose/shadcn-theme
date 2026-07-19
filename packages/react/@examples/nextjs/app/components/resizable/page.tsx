'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../../../components/ui/resizable';
import { ExamplePage, ExampleSection } from '@/components/showcase-shell';

export default function Page() {
  return (
    <ExamplePage title="Resizable" description="A layout primitive for panels that can be resized via drag handles.">
      <ExampleSection title="Nested Panels" description="Horizontal split with a vertically nested second panel.">
        <ResizablePanelGroup orientation="horizontal" className="max-w-sm rounded-lg border">
          <ResizablePanel defaultSize="50%">
            <div className="flex h-[200px] items-center justify-center p-6">
              <span className="font-semibold">One</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="25%">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Two</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="75%">
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Three</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ExampleSection>
    </ExamplePage>
  );
}
