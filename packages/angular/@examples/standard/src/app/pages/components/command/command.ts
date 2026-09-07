import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-command-page',
  imports: [DemoHeaderComponent, BrnCommandImports, HlmCommandImports],
  template: `
    <app-demo-header
      title="Command"
      description="A search/quick-action palette with its search field labelled for assistive technology."
    />

    <div hlmCommand class="tw:w-full tw:max-w-md tw:rounded-md tw:border tw:shadow-md">
      <label for="command-search" class="tw:sr-only">Search commands</label>
      <hlm-command-input inputId="command-search" placeholder="Type a command or search..." />
      <div hlmCommandList class="tw:max-h-[300px]">
        <div hlmCommandEmpty>No results found.</div>
        <div hlmCommandGroup>
          <div hlmCommandGroupLabel>Suggestions</div>
          <button hlmCommandItem type="button" value="calendar">Calendar</button>
          <button hlmCommandItem type="button" value="search">Search</button>
          <button hlmCommandItem type="button" value="settings">Settings</button>
        </div>
      </div>
    </div>
  `,
})
export class CommandPage {}
