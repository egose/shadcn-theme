import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="onClick()"
      class="px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2"
      [ngClass]="colorClass"
    >
      {{ label }}
    </button>
  `,
})
export class MyButtonComponent {
  @Input() label: string = 'Click me';
  @Input() color: 'primary' | 'secondary' | 'danger' = 'primary';
  @Output() clicked = new EventEmitter<void>();

  get colorClass() {
    switch (this.color) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    }
  }

  onClick() {
    this.clicked.emit();
  }
}
