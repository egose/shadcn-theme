import { Component } from '@angular/core';
import { MyButtonComponent } from '../../../../../../../packages/my-workspace/projects/button/src/public-api';

@Component({
  selector: 'app-button',
  imports: [MyButtonComponent],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class ButtonPage {
  sayHello() {
    alert('Hello from the button!');
  }
  deleteItem() {
    alert('Item deleted!');
  }
}
