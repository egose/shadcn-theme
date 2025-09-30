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

type Country = { name: string; code: string; flag: string };

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
    { label: 'Button', link: '/components/button', class: 'tw:font-bold' },
    { label: 'Badge', link: '/components/badge', class: 'tw:font-bold' },
    { label: 'Alert', link: '/components/alert', class: 'tw:font-bold' },
    { label: 'Accordion', link: '/components/accordion', class: 'tw:font-bold' },
    { label: 'Spinner', link: '/components/spinner', class: 'tw:font-bold' },
    { label: 'Form Field', link: '/components/form-field', class: 'tw:font-bold' },
  ];

  rightMenus = [{ label: 'Sign Out', action: () => alert('Signed out'), class: 'tw:bg-yellow-200' }];

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

  footerMenus = [
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' },
    { label: 'Contact', action: () => {} },
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

  private readonly _countries: Country[] = [
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'India', code: 'IN', flag: '🇮🇳' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
    { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
    { name: 'Norway', code: 'NO', flag: '🇳🇴' },
    { name: 'Russia', code: 'RU', flag: '🇷🇺' },
    { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
    { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
    { name: 'Spain', code: 'ES', flag: '🇪🇸' },
    { name: 'Sweden', code: 'SE', flag: '🇸🇪' },
    { name: 'Switzerland', code: 'CH', flag: '🇨🇭' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
    { name: 'United States', code: 'US', flag: '🇺🇸' },
  ];

  countryToSearch = (value: Country) => `${value.flag} ${value.name}`;

  loadCountries = async ({ search }: { search: string }): Promise<Country[]> => {
    if (!search) return [];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this._countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())));
      }, 500);
    });
  };

  onSearchOptionChange(value: Country) {
    console.log('Selected country:', value);
  }
}
