import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <div class="">
      <h3 class="text-xl font-bold underline">Components</h3>
      <router-outlet />
    </div>
  `,
})
export class ComponentsLayout {}
