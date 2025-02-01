import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatToolbar } from '@angular/material/toolbar';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {

  forgotEmailForm!: FormGroup;
  loading = false;


  constructor(
    public formUtils: FormUtilsService,
    private authService: AuthService,
    private toastService: ToastrService,
    private formBuilder: FormBuilder,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.forgotEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    if(this.forgotEmailForm.valid) {
      this.loading = true;
      //console.log(this.forgotEmailForm.value.email);
      this.authService.forgotPassword(this.forgotEmailForm.value.email).subscribe({
        next: () => {
          this.toastService.success('E-mail enviado! Verifique sua caixa de entrada.');
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          this.onCancel();
        }
      });
    } else {
      this.formUtils.validateAllFormFields(this.forgotEmailForm);
    }
  }

  onCancel() {
    this.location.back();
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
