import { Component } from '@angular/core';
import { HlmInputGroupImports } from '@egose/shadcn-theme-ng/input-group';

@Component({
  selector: 'app-input-group-page',
  imports: [HlmInputGroupImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Input Group</h3>
    <p class="tw:text-gray-500 tw:mb-4">Inputs with prepended/appended elements.</p>

    <div hlmInputGroup class="tw:flex tw:max-w-sm tw:items-center">
      <span hlmInputGroupText>$</span>
      <input hlmInputGroupInput placeholder="Amount" type="number" />
      <button hlmInputGroupButton type="button">Apply</button>
    </div>
  `,
})
export class InputGroupPage {}
