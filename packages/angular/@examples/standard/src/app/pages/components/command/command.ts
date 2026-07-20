import { Component } from '@angular/core';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@egose/shadcn-theme-ng/command';

@Component({
  selector: 'app-command-page',
  imports: [BrnCommandImports, HlmCommandImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Command</h3>
    <p class="tw:text-gray-500 tw:mb-4">A search/quick-action palette.</p>

    <div hlmCommand class="tw:w-[400px] tw:rounded-md tw:border tw:shadow-md">
      <hlm-command-input placeholder="Type a command or search..." />
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
