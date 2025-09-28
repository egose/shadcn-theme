import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  lucideCircleHelp,
  lucideCirclePlus,
  lucideCircleUser,
  lucideCode,
  lucideCog,
  lucideGithub,
  lucideKeyboard,
  lucideLayers,
  lucideLogOut,
  lucideMail,
  lucideMessageSquare,
  lucidePlus,
  lucideSmile,
  lucideUser,
} from '@ng-icons/lucide';
import { EgLayoutSimple, MenuItem } from '@egose/shadcn-theme-ng/layout-simple';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EgLayoutSimple],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'angular';

  iconPath = 'assets/logo.png';

  leftMenus = [
    { label: 'Home', link: '/', class: 'tw:font-bold' },
    { label: 'Reload', action: () => location.reload(), class: 'tw:text-red-600' },
  ];

  rightMenus = [
    { label: 'About', link: '/about', class: 'tw:text-blue-500' },
    { label: 'Sign Out', action: () => alert('Signed out'), class: 'tw:bg-yellow-200' },
  ];

  menus = [
    {
      label: 'My Account',
      items: [
        { label: 'Profile', icon: lucideCircleUser, link: '/profile' },
        { label: 'Billing', icon: lucideLayers, action: () => this.onBilling() },
        { label: 'Settings', icon: lucideCog, class: 'tw:text-blue-500' },
        { label: 'Keyboard shortcuts', icon: lucideKeyboard },
      ],
      separator: true,
    },
    {
      label: 'Team',
      items: [
        { label: 'Team', icon: lucideUser, link: '/team' },
        { label: 'New Team', icon: lucidePlus },
      ],
      separator: true,
    },
    {
      label: 'Links',
      items: [
        { label: 'GitHub', icon: lucideGithub, link: '/github' },
        { label: 'Support', icon: lucideCircleHelp, action: () => this.onSupport() },
      ],
      separator: true,
    },
    {
      items: [{ label: 'Log out', icon: lucideLogOut, action: () => this.logout() }],
    },
  ];

  onBilling() {
    console.log('Billing clicked');
  }

  onSupport() {
    console.log('Support clicked');
  }

  logout() {
    console.log('Logged out');
  }
}
