import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-coockie-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coockie-popup.component.html',
  styleUrl: './coockie-popup.component.scss',
})
export class CoockiePopupComponent {
  isVisible: boolean = true;

  closePopup(): void {
    this.isVisible = false;
  }
}
