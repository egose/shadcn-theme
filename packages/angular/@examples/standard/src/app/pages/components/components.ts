import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <div class="">
      <h2 class="tw:text-xl tw:font-bold tw:underline tw:mb-3">Components</h2>
      <router-outlet />
    </div>
  `,
})
export class ComponentsLayout {}
