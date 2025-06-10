import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confidential-polity',
  standalone: true,
  imports: [],
  templateUrl: './confidential-polity.component.html',
  styleUrl: './confidential-polity.component.scss',
})
export class ConfidentialPolityComponent {
  constructor(private router: Router) {}

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
}
