import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-components',
  imports: [RouterOutlet],
  template: `
    <div class="tw:w-full">
      <router-outlet />
    </div>
  `,
})
export class ComponentsLayout {}
