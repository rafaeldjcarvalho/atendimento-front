import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OrderService } from '../../interfaces/orderService.interface';

@Component({
  selector: 'app-order-listing',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DatePipe
  ],
  templateUrl: './order-listing.component.html',
  styleUrl: './order-listing.component.scss'
})
export class OrderListingComponent {

  @Input() userLogged: string | null = null;
  @Input() topico: string = '';
  @Input() itensList: OrderService[] = [];
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

}
