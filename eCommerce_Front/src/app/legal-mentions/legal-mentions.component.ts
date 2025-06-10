import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-legal-mentions',
  standalone: true,
  imports: [],
  templateUrl: './legal-mentions.component.html',
  styleUrl: './legal-mentions.component.scss',
})
export class LegalMentionsComponent {
  constructor(private router: Router) {}

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
}
