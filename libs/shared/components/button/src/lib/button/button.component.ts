import { Component } from '@angular/core';

@Component({
  selector: 'apps-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  onButtonClick() {
    window.alert('button was clicked');
  }
}
