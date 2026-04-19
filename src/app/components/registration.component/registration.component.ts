import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router , RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule , FormsModule , ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  authError: boolean = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Za-zА-Яа-яёЁ\-]+$/)  // буквы и дефис
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[A-Za-zА-Яа-яёЁ\-]+$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ], ],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      email: ['', [
        Validators.email
      ], ],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Геттеры для удобства
  get firstName() { return this.registerForm.get('firstName')!; }
  get lastName() { return this.registerForm.get('lastName')!; }
  get username() { return this.registerForm.get('username')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }

  // Валидатор совпадения паролей
  private passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    
    if (password && confirm && password !== confirm) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Если ошибка была только в mismatch, убираем её
    const confirmErrors = group.get('confirmPassword')?.errors;
    if (confirmErrors) {
      delete confirmErrors['passwordMismatch'];
      if (Object.keys(confirmErrors).length === 0) {
        group.get('confirmPassword')?.setErrors(null);
      } else {
        group.get('confirmPassword')?.setErrors(confirmErrors);
      }
    }
    return null;
  };


  onSubmit(): void {
    this.authError = false;
    this.cdr.detectChanges();

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      // Дополнительно подсвечиваем confirmPassword если пароли не совпадают
      if (this.registerForm.errors?.['passwordMismatch']) {
        this.confirmPassword.markAsTouched();
      }
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    const formValue = this.registerForm.value;
    const registrationData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      username: formValue.username,
      email: formValue.email || "",
      password: formValue.password
    };

    this.auth.register(registrationData.username , registrationData.firstName , registrationData.lastName , registrationData.email , registrationData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
        this.cdr.detectChanges();
        
      },
      error: () => {
        this.isLoading = false;
        this.authError = true;  
        this.cdr.detectChanges();
      }
    });
  }
}