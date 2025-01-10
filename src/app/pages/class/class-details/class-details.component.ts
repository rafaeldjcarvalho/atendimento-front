import { Class } from './../../../interfaces/class.interface';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { MatInputModule } from '@angular/material/input';
import { ClassService } from '../../../services/class/class.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {

  classForm!: FormGroup;

  constructor(
    public formUtils: FormUtilsService,
    private service: ClassService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private formBuilder: NonNullableFormBuilder,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    const classes: Class = this.route.snapshot.data['classes'];
    this.classForm = this.formBuilder.group({
      id: [classes.id],
      name: [classes.name, [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      date: [classes.date, [Validators.required, Validators.maxLength(10)]],
      owner: [classes.owner]
    });
  }

  onSubmit() {
    if (this.classForm.valid) {
      this.service.save(this.classForm.value)
        .subscribe({
          next: (result) => this.onSuccess(),
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        });
    } else {
      this.formUtils.validateAllFormFields(this.classForm);
    }
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.toastService.success("Turma salva com sucesso!");
    this.onCancel();
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
