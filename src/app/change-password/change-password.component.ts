import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})

export class ChangePasswordComponent {
  changePasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    newPassword: new FormControl('', [Validators.required])
  });

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const email = this.changePasswordForm.value.email!;
      const newPassword = this.changePasswordForm.value.newPassword!;
      
      this.usersService.changePassword(email, newPassword).subscribe({
        next: (response) => {
          this.successMessage = 'Contraseña cambiada exitosamente. Redirigiendo al login...';
          this.errorMessage = '';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = 'Error al cambiar la contraseña. Verifique sus datos.';
          this.successMessage = '';
        }
      });
    }
  }
}
