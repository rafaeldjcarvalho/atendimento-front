import { MatCardModule } from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { OrderServiceService } from '../../../services/order/order-service.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../interfaces/orderService.interface';
import { Location } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent implements OnInit {

  orderForm!: FormGroup;
  classId!: string;

  constructor(
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    private service: OrderServiceService,
    //private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    //this.route.paramMap.subscribe((params) => {
    //  this.classId = params.get('id') || ''; // 'id' é o nome do parâmetro na rota
    //});

    const order: OrderService = this.route.snapshot.data['order'];
    this.orderForm = this.formBuilder.group({
      id: [order.id],
      title: [order.title, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [order.description, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      date: [order.date, [Validators.required, Validators.maxLength(10)]],
      time_start: [order.time_start, [Validators.required, Validators.maxLength(6)]],
      time_end: [order.time_end, [Validators.required, Validators.maxLength(6)]],
      status: [order.status, [Validators.required, Validators.maxLength(12)]],
      classId: [order.classId, [Validators.required]],
      userId: [order.userId, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.service.save(this.orderForm.value).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError()
      });
    } else {
      this.formUtils.validateAllFormFields(this.orderForm);
    }
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.toastService.success('Pedido adicionado com sucesso!');
    this.onCancel();
  }

  private onError() {
    this.toastService.success('ERRO ao criar pedido.');
  }

}
