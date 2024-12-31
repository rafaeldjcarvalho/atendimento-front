import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CustomerService, OrderService } from '../../interfaces/orderService.interface';
import { DatePipe } from '@angular/common';
import { ShowForAccessDirective } from '../../guards/directives/show-for-access.directive';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    ShowForAccessDirective,
    DatePipe
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {

  @Input() userLogged: string | null = null;
  @Input() topico: string = '';
  @Input() itensList: CustomerService[] = [];
  @Input() actionButtons: boolean = true;

  @Output() add = new EventEmitter();
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() accept = new EventEmitter();
  @Output() reject = new EventEmitter();
  @Output() openDialog = new EventEmitter();

  onAdd() {
    this.add.emit();
  }

  onEdit(order: OrderService) {
    this.edit.emit(order);
  }

  onDelete(order: OrderService) {
    this.remove.emit(order);
  }

  onAccept(order: OrderService) {
    this.accept.emit(order);
  }

  onReject(order: OrderService) {
    this.reject.emit(order);
  }

  onOpenDialog(order: OrderService) {
    this.openDialog.emit(order);
  }
}
