// import { Component, EventEmitter, Output } from '@angular/core';
import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { ManagerService } from '../manager.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // name? : string
  // pwd? : string

  // constructor(private usersService: UsersService, private manager : ManagerService){}

  // login() {
  //   if (!this.name || !this.pwd) 
  //     return
  //   this.usersService.login(this.name, this.pwd).subscribe(
  //     (token) => {
  //       //sessionStorage.setItem("token", token)
  //       this.manager.token = token
  //     },
  //     (error) => {
  //       alert(error)
  //     }
  //   )
  // }



  loginForm: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private api: ApiService, // Asegúrate de que ApiService esté importado correctamente
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      // Sanitizar los datos de entrada
      const sanitizedData = this.sanitizeLoginData(this.loginForm.value);
      
      this.api.login(sanitizedData).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);  // ajustar campo según respuesta real
          this.router.navigate(['/calculator']);
        },
        error: () => {
          this.errorMessage = 'Email o contraseña incorrectos. Asegúrese que ha validado su email.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Método para sanitizar los datos de entrada y prevenir inyección SQL
  private sanitizeLoginData(data: any): any {
    return {
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
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Métodos auxiliares para mostrar errores específicos en el template
  get emailErrors(): string | null {
    const emailControl = this.loginForm.get('email');
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
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.invalid && passwordControl?.touched) {
      if (passwordControl.errors?.['required']) {
        return 'La contraseña es obligatoria.';
      }
      if (passwordControl.errors?.['minlength']) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
    }
    return null;
  }


}
