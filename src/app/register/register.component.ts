import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para la fortaleza de la contraseña
  passwordStrengthValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    
    if (!value) {
      return null; // Let required validator handle empty values
    }

    const hasMinLength = value.length >= 7;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);

    const valid = hasMinLength && hasUppercase && hasLowercase && hasNumber;

    if (!valid) {
      return {
        passwordStrength: {
          hasMinLength,
          hasUppercase,
          hasLowercase,
          hasNumber
        }
      };
    }

    return null;
  }

  // Validador personalizado para confirmar contraseñas
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Sanitizar los datos de entrada
      const sanitizedData = this.sanitizeRegisterData(this.registerForm.value);
      
      this.api.register(sanitizedData).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => {
          this.errorMessage = 'No se pudo registrar el usuario. Intente nuevamente.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Método para sanitizar los datos de entrada y prevenir inyección SQL
  private sanitizeRegisterData(data: any): any {
    return {
      name: this.sanitizeString(data.name),
      surname: this.sanitizeString(data.surname),
      email: this.sanitizeString(data.email),
      password: this.sanitizeString(data.password)
    };
  }

  // Método para sanitizar strings y prevenir inyección SQL
  private sanitizeString(input: string): string {
    if (!input) return '';
    
    // Eliminar caracteres peligrosos para SQL
    return input
      .replace(/['";\\]/g, '') // Eliminar comillas simples, dobles, punto y coma, y barras invertidas
      .replace(/--/g, '') // Eliminar comentarios SQL
      .replace(/\/\*/g, '') // Eliminar inicio de comentarios de bloque
      .replace(/\*\//g, '') // Eliminar fin de comentarios de bloque
      .replace(/xp_/gi, '') // Eliminar procedimientos extendidos
      .replace(/sp_/gi, '') // Eliminar procedimientos del sistema
      .trim(); // Eliminar espacios al inicio y final
  }

  // Método para marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos auxiliares para mostrar errores específicos en el template
  get nameErrors(): string | null {
    const nameControl = this.registerForm.get('name');
    if (nameControl?.invalid && nameControl?.touched) {
      if (nameControl.errors?.['required']) {
        return 'El nombre es obligatorio.';
      }
      if (nameControl.errors?.['minlength']) {
        return 'El nombre debe tener al menos 2 caracteres.';
      }
    }
    return null;
  }

  get surnameErrors(): string | null {
    const surnameControl = this.registerForm.get('surname');
    if (surnameControl?.invalid && surnameControl?.touched) {
      if (surnameControl.errors?.['required']) {
        return 'El apellido es obligatorio.';
      }
      if (surnameControl.errors?.['minlength']) {
        return 'El apellido debe tener al menos 2 caracteres.';
      }
    }
    return null;
  }

  get emailErrors(): string | null {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.invalid && emailControl?.touched) {
      if (emailControl.errors?.['required']) {
        return 'El email es obligatorio.';
      }
      if (emailControl.errors?.['email']) {
        return 'Por favor, introduce un email válido.';
      }
    }
    return null;
  }

  get passwordErrors(): string | null {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.invalid && passwordControl?.touched) {
      if (passwordControl.errors?.['required']) {
        return 'La contraseña es obligatoria.';
      }
      if (passwordControl.errors?.['passwordStrength']) {
        const errors = passwordControl.errors['passwordStrength'];
        const messages = [];
        
        if (!errors.hasMinLength) {
          messages.push('mínimo 6 caracteres');
        }
        if (!errors.hasUppercase) {
          messages.push('una letra mayúscula');
        }
        if (!errors.hasLowercase) {
          messages.push('una letra minúscula');
        }
        if (!errors.hasNumber) {
          messages.push('un número');
        }
        
        return `La contraseña debe contener: ${messages.join(', ')}.`;
      }
    }
    return null;
  }

  get confirmPasswordErrors(): string | null {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl?.invalid && confirmPasswordControl?.touched) {
      if (confirmPasswordControl.errors?.['required']) {
        return 'Confirme su contraseña.';
      }
    }
    
    // Error de coincidencia de contraseñas
    if (this.registerForm.errors?.['passwordMismatch'] && confirmPasswordControl?.touched) {
      return 'Las contraseñas no coinciden.';
    }
    
    return null;
  }
}