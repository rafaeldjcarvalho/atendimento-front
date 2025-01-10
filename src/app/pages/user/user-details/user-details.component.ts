import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { Observable } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../../../types/login-response.type';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {

  userId!: string;

  userForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id') || ''; // 'id' é o nome do parâmetro na rota
    });

    this.loadUser();
  }

  private loadUser(): void {
    this.userService.loadById(this.userId).subscribe((user: User) => {
      // Inicializar o FormGroup com os dados do usuário
      this.userForm = this.formBuilder.group({
        id: [user.id],
        name: [user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: [user.email, [Validators.required, Validators.email]],
        typeAccess: [user.access, [Validators.required, Validators.maxLength(15)]],
        status: [user.status, [Validators.required, Validators.maxLength(15)]],
        newPassword: ['', [Validators.minLength(6)]],
        confirmNewPassword: ['', [Validators.minLength(6)]]
      });
    });
  }

  onSubmit() {
    //console.log(this.userForm.value);
    if (this.userForm.valid) {
      if(this.userForm.value.newPassword === this.userForm.value.confirmNewPassword) {
        this.userService.updateUser(this.userForm.value.id, {name: this.userForm.value.name, email: this.userForm.value.email, password: this.userForm.value.confirmNewPassword, typeAccess: this.userForm.value.typeAccess, status: this.userForm.value.status}).subscribe({
          next: (response: LoginResponse) => {
            this.onSuccess();
            this.authService.saveTokenToSessionStore(response.token);
            this.authService.pushNewUser(response.token);
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        });
      } else {
        this.showToastrError("Senha não confirmada.");
      }
    } else {
      this.formUtils.validateAllFormFields(this.userForm);
    }
  }

  private onSuccess() {
    this.toastService.success('Conta Atualizada com sucesso!');
    this.onCancel();
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
