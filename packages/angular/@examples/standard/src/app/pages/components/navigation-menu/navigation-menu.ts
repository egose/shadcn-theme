import { Component } from '@angular/core';
import { BrnNavigationMenuImports } from '@spartan-ng/brain/navigation-menu';
import { HlmNavigationMenuImports } from '@egose/shadcn-theme-ng/navigation-menu';

@Component({
  selector: 'app-navigation-menu-page',
  imports: [BrnNavigationMenuImports, HlmNavigationMenuImports],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Navigation Menu</h3>
    <p class="tw:text-gray-500 tw:mb-4">A horizontal menu with dropdown content.</p>

    <nav hlmNavigationMenu>
      <ul hlmNavigationMenuList>
        <li hlmNavigationMenuItem>
          <button hlmNavigationMenuTrigger type="button">Getting Started</button>
        </li>
        <li hlmNavigationMenuItem>
          <a hlmNavigationMenuLink href="#">Documentation</a>
        </li>
      </ul>
    </nav>
  `,
})
export class NavigationMenuPage {}
