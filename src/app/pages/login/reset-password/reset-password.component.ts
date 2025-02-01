import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { MatToolbar } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormUtilsService } from '../../../services/form/form-utils.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinner,
    ReactiveFormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetForm!: FormGroup;
  loading = false;
  token: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastrService,
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    )
  {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]]
    });
    }

  onSubmit() {
    if (this.resetForm.value.password === this.resetForm.value.confirmPassword) {
      if(this.resetForm.valid) {
        this.loading = true;
        this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe({
          next: () => {
            this.toastService.success('Senha redefinida com sucesso!');
            this.loading = false;
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
            this.loading = false;
          },
          complete: () => {
            this.loading = false;
          }
        });
      } else {
        this.formUtils.validateAllFormFields(this.resetForm);
      }
    } else {
      this.toastService.error("Erro! Senha não confirmada.")
    }
  }

  onCancel() {
    this.router.navigate(['/login'])
  }

  private handleError(error: HttpErrorResponse): void {
      if (error.status === 403 || error.status === 401) {
        const errorMessage = error.error?.error || 'Erro desconhecido'; // Ajuste conforme o formato da resposta
        this.showToastrError(errorMessage);
      } else {
        this.showToastrError('Erro ao processar sua solicitação.');
      }
    }

    private showToastrError(message: string): void {
      // Chama o toastr para mostrar a mensagem de erro
      this.toastService.error(message, 'Erro');
    }
}
