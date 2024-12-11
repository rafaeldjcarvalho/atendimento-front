import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { CustomerServiceService } from '../../../services/order/customer-service.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../interfaces/orderService.interface';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.scss'
})
export class ServiceFormComponent implements OnInit {

  serviceForm!: FormGroup;
  classId!: string;

  constructor(
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    private customerService: CustomerServiceService,
    //private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    const service: CustomerService = this.route.snapshot.data['service'];
    this.serviceForm = this.formBuilder.group({
      id: [service.id],
      title: [service.title, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [service.description, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      date: [service.date, [Validators.required, Validators.maxLength(10)]],
      time_start: [service.time_start, [Validators.required, Validators.maxLength(6)]],
      time_end: [service.time_end, [Validators.required, Validators.maxLength(6)]],
      status: [service.status, [Validators.required, Validators.maxLength(12)]],
      classId: [service.classId, [Validators.required]],
      userId: [service.userId, [Validators.required]],
      studentId: [service.studentId, [Validators.required]]
    });
  }

  onSubmit() {
    //console.log("Clicando");
    if (this.serviceForm.valid) {
      this.customerService.save(this.serviceForm.value).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError()
      });
    } else {
      this.formUtils.validateAllFormFields(this.serviceForm);
    }
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.toastService.success('Atendimento adicionado com sucesso!');
    this.onCancel();
  }

  private onError() {
    this.toastService.success('ERRO ao criar atendimento.');
  }

}
