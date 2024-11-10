import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { PrimarySelectComponent } from "../../components/primary-select/primary-select.component";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

interface SignupForm {
  name: FormControl,
  email: FormControl,
  typeAccount: FormControl,
  password: FormControl,
  passwordConfirm: FormControl
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent,
    PrimarySelectComponent
  ],
  providers: [
    AuthService
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup<SignupForm>;

  accountTypeOptions = [
    { value: 'Aluno', label: 'Aluno' },
    { value: 'Professor', label: 'Professor' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      typeAccount: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  submit() {
    if(this.signupForm.value.password == this.signupForm.value.passwordConfirm) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.typeAccount).subscribe({
        next: () => {
          this.toastService.success("Conta criada com sucesso!");
          //this.router.navigate(["login"]);
        },
        error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde.")
      })
    } else {
      this.toastService.error("Por favor, confirme corretamente sua senha.");
    }
    //console.log('Form Submitted:', this.signupForm.value);
  }

  navigate() {
    this.router.navigate(["login"]);
  }
}
