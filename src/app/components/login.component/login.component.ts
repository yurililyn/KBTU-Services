import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isRegisterMode = false;
  showPass: Record<string, boolean> = {};
  isSubmitting = false;
  submitDone = false;

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  private ctx!: CanvasRenderingContext2D;
  private raf = 0;
  private stars: Star[] = [];

  constructor(private fb: FormBuilder) {}

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.buildForms();
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
  }

  // ─── Forms ───────────────────────────────────────────────────────────────────

  private buildForms(): void {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.registerForm = this.fb.group(
      {
        email:     ['', [Validators.required, Validators.email]],
        password:  ['', [Validators.required, Validators.minLength(8), this.strongPassword]],
        confirm1:  ['', Validators.required],
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName:  ['', [Validators.required, Validators.minLength(2)]],
        phone:     ['', [Validators.pattern(/^\+?[\d\s\-(]{7,16}$/)]],
      },
      { validators: this.matchPasswords }
    );
  }

  private strongPassword(c: AbstractControl): ValidationErrors | null {
    const v = c.value || '';
    if (!v) return null;
    return /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v)
      ? null
      : { weak: true };
  }

  private matchPasswords(g: AbstractControl): ValidationErrors | null {
    const p  = g.get('password')?.value;
    const c1 = g.get('confirm1')?.value;
    if (c1 && p !== c1) return { mismatch1: true };
    return null;
  }

  // ─── Login form helpers ───────────────────────────────────────────────────────

  lInvalid(name: string): boolean {
    const c = this.loginForm.get(name);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  lError(name: string): string {
    return this.fieldError(this.loginForm, name);
  }

  // ─── Register form helpers ────────────────────────────────────────────────────

  rInvalid(name: string): boolean {
    const c = this.registerForm.get(name);
    return !!(c?.invalid && (c.dirty || c.touched));
  }

  rError(name: string): string {
    return this.fieldError(this.registerForm, name);
  }

  rFormErr(key: string): boolean {
    const touched = this.registerForm.get('confirm1')?.touched;
    return !!(this.registerForm.errors?.[key] && touched);
  }

  // ─── Shared ───────────────────────────────────────────────────────────────────

  private fieldError(form: FormGroup, name: string): string {
    const c = form.get(name);
    if (!c?.errors || !(c.dirty || c.touched)) return '';
    if (c.errors['required'])  return 'Обязательное поле';
    if (c.errors['email'])     return 'Некорректный email';
    if (c.errors['minlength']) return `Минимум ${c.errors['minlength'].requiredLength} символов`;
    if (c.errors['weak'])      return 'Добавьте заглавные буквы и цифры';
    if (c.errors['pattern'])   return 'Некорректный формат';
    return '';
  }

  passwordStrength(): 'weak' | 'medium' | 'strong' | null {
    const v: string = this.registerForm.get('password')?.value || '';
    if (!v) return null;
    const score =
      (v.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(v) ? 1 : 0) +
      (/\d/.test(v) ? 1 : 0) +
      (/[^A-Za-z\d]/.test(v) ? 1 : 0);
    if (score <= 1) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.submitDone = false;
    this.loginForm.reset();
    this.registerForm.reset();
    this.showPass = {};
  }

  togglePass(key: string): void {
    this.showPass[key] = !this.showPass[key];
  }

  onSubmit(): void {
    const form = this.isRegisterMode ? this.registerForm : this.loginForm;
    form.markAllAsTouched();
    if (form.invalid) return;

    this.isSubmitting = true;
    this.isRegisterMode ? this.handleRegister() : this.handleLogin();
  }

  private handleLogin(): void {
    const { email, password } = this.loginForm.value;
    console.log('[LOGIN] stub →', { email, password });
    // TODO: inject AuthService and call authService.login(email, password)
    setTimeout(() => { this.isSubmitting = false; this.submitDone = true; }, 1600);
  }

  private handleRegister(): void {
    const { email, password, firstName, lastName, phone } = this.registerForm.value;
    console.log('[REGISTER] stub →', { email, password, firstName, lastName, phone });
    // TODO: inject AuthService and call authService.register({...})
    setTimeout(() => { this.isSubmitting = false; this.submitDone = true; }, 1600);
  }

  // ─── Canvas particles ─────────────────────────────────────────────────────────

  private onResize = () => {
    const c = this.canvasRef?.nativeElement;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    this.spawnStars(c);
  };

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.onResize();
    window.addEventListener('resize', this.onResize);
    this.tick();
  }

  private spawnStars(c: HTMLCanvasElement): void {
    this.stars = Array.from({ length: 90 }, () => ({
      x:     Math.random() * c.width,
      y:     Math.random() * c.height,
      r:     Math.random() * 1.4 + 0.3,
      a:     Math.random() * Math.PI * 2,
      s:     Math.random() * 0.3 + 0.05,
      op:    Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  private tick(): void {
    const c = this.canvasRef?.nativeElement;
    if (!c) return;
    const { width: W, height: H } = c;
    this.ctx.clearRect(0, 0, W, H);

    for (const s of this.stars) {
      s.x += Math.cos(s.a) * s.s;
      s.y += Math.sin(s.a) * s.s;
      s.pulse += 0.025;
      const op = s.op * (0.6 + 0.4 * Math.sin(s.pulse));
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(180,200,255,${op})`;
      this.ctx.fill();
    }

    this.raf = requestAnimationFrame(() => this.tick());
  }
}

interface Star {
  x: number; y: number; r: number;
  a: number; s: number; op: number; pulse: number;
}