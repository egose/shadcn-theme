import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-navigation-menu-page',
  imports: [DemoHeaderComponent, BrnNavigationMenuImports, HlmNavigationMenuImports, RouterLink],
  template: `
    <app-demo-header
      title="Navigation Menu"
      description="A horizontal menu with a dropdown panel: the trigger expands with keyboard or pointer, and every link resolves to a real gallery route."
    />

    <nav hlmNavigationMenu aria-label="Component gallery sections">
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <button hlmNavigationMenuTrigger type="button">Getting Started</button>
          <ng-template brnNavigationMenuContent>
            <ul class="tw:grid tw:gap-1 tw:p-2">
              <li>
                <a hlmNavigationMenuLink routerLink="/components/button">Buttons</a>
              </li>
              <li>
                <a hlmNavigationMenuLink routerLink="/components/form-field">Form flows</a>
              </li>
              <li>
                <a hlmNavigationMenuLink routerLink="/components/card">Cards</a>
              </li>
            </ul>
          </ng-template>
        </li>
        <li hlmNavigationMenuItem>
          <a hlmNavigationMenuLink routerLink="/components/table">Documentation</a>
        </li>
      </ul>
    </nav>
  `,
})
export class NavigationMenuPage {}
