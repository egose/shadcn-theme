'use client';

import * as React from 'react';
import { Upload } from 'lucide-react';

import { ExamplePage, ExampleSection, ExampleStack } from '@/components/showcase-shell';
import { FileInputAsButton } from '@egose/shadcn-theme/components/ui/extension/file-input';

export default function FileInputShowcase() {
  const [files, setFiles] = React.useState<string[]>([]);

  return (
    <ExamplePage
      title="File Input"
      description="This extension hides the native file picker behind a themed button trigger."
    >
      <ExampleSection
        title="Upload trigger"
        description="Use the selected file list below to confirm user feedback after a pick action."
      >
        <ExampleStack>
          <FileInputAsButton
            multiple
            onChange={(event) => setFiles(Array.from(event.target.files ?? []).map((file) => file.name))}
          >
            <span className="inline-flex items-center gap-2">
              <Upload className="size-4" />
              Select assets
            </span>
          </FileInputAsButton>
          <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
            {files.length ? files.join(', ') : 'No files selected yet.'}
          </div>
        </ExampleStack>
      </ExampleSection>
    </ExamplePage>
  );
}
