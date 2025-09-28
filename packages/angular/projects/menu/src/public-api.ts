/*
 * Public API Surface of menu
 */

import { NgModule } from '@angular/core';

import { HlmMenu } from './lib/menu';
import { HlmMenuBar } from './lib/menu-bar';
import { HlmMenuBarItem } from './lib/menu-bar-item';
import { HlmMenuGroup } from './lib/menu-group';
import { HlmMenuItem } from './lib/menu-item';
import { HlmMenuItemCheck } from './lib/menu-item-check';
import { HlmMenuItemCheckbox } from './lib/menu-item-checkbox';
import { HlmMenuItemIcon } from './lib/menu-item-icon';
import { HlmMenuItemRadio } from './lib/menu-item-radio';
import { HlmMenuItemRadioIndicator } from './lib/menu-item-radio-indicator';
import { HlmMenuItemSubIndicator } from './lib/menu-item-sub-indicator';
import { HlmMenuLabel } from './lib/menu-label';
import { HlmMenuSeparator } from './lib/menu-separator';
import { HlmMenuShortcut } from './lib/menu-shortcut';
import { HlmSubMenu } from './lib/sub-menu';

export * from './lib/menu';
export * from './lib/menu-bar';
export * from './lib/menu-bar-item';
export * from './lib/menu-group';
export * from './lib/menu-item';
export * from './lib/menu-item-check';
export * from './lib/menu-item-checkbox';
export * from './lib/menu-item-icon';
export * from './lib/menu-item-radio';
export * from './lib/menu-item-radio-indicator';
export * from './lib/menu-item-sub-indicator';
export * from './lib/menu-label';
export * from './lib/menu-separator';
export * from './lib/menu-shortcut';
export * from './lib/sub-menu';

export const HlmMenuItemImports = [
  HlmMenuItem,
  HlmMenuItemIcon,
  HlmMenuGroup,
  HlmMenuItemSubIndicator,
  HlmMenuItemRadioIndicator,
  HlmMenuItemCheck,
  HlmMenuShortcut,
  HlmMenuItemCheckbox,
  HlmMenuItemRadio,
];
export const HlmMenuStructureImports = [HlmMenuLabel, HlmMenuSeparator] as const;
export const HlmMenuImports = [...HlmMenuItemImports, ...HlmMenuStructureImports, HlmMenu, HlmSubMenu] as const;
export const HlmMenuBarImports = [...HlmMenuImports, HlmMenuBar, HlmMenuBarItem] as const;

@NgModule({
  imports: [...HlmMenuItemImports],
  exports: [...HlmMenuItemImports],
})
export class HlmMenuItemModule {}

@NgModule({
  imports: [...HlmMenuImports],
  exports: [...HlmMenuImports],
})
export class HlmMenuModule {}

@NgModule({
  imports: [...HlmMenuBarImports],
  exports: [...HlmMenuBarImports],
})
export class HlmMenuBarModule {}
