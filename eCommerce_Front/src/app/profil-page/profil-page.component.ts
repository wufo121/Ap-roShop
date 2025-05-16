import { Component, inject, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-page.component.html',
  styleUrl: './profil-page.component.scss',
})
export class ProfilPageComponent implements OnInit {
  private appService = inject(AppService);

  user: any;
  isEditingUsername = false;
  isEditingEmail = false;
  isEditingAddress = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.appService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data.user;
        console.log(this.user);
      },
    });
  }

  enableEdit(field: string) {
    if (this.isSingleFieldEditing()) {
      if (field === 'username') this.isEditingUsername = true;
      if (field === 'email') this.isEditingEmail = true;
      if (field === 'address') this.isEditingAddress = true;
    }
    return;
  }

  validateModification(field: string) {
    if (field === 'username') this.isEditingUsername = false;
    if (field === 'email') this.isEditingEmail = false;
    if (field === 'address') this.isEditingAddress = false;
  }

  isSingleFieldEditing() {
    if (
      this.isEditingUsername === true ||
      this.isEditingEmail === true ||
      this.isEditingAddress === true
    ) {
      return false;
    }
    return true;
  }

  redirectToHomePage() {
    this.router.navigate(['/home']);
  }
}
