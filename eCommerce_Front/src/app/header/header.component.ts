import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule],
})
export class HeaderComponent implements OnInit {
  private appService = inject(AppService);
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.appService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data.user;
      },
    });
  }

  isLoggedIn(): boolean {
    return this.appService.isLoggedIn();
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      location.reload();
    }
  }

  redirectToLoginPage() {
    this.router.navigate(['/login']);
  }
  redirectToProfilPage() {
    if (this.user) {
      this.router.navigate([`/pageProfil/${this.user.id}`]);
    }
  }
}
