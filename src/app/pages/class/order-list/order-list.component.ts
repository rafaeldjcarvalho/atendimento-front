import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceService } from '../../../services/order/order-service.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { OrderPage } from '../../../interfaces/order-page.interface';
import { OrderService } from '../../../interfaces/orderService.interface';
import { DialogConfirmationComponent } from '../../../components/dialog-confirmation/dialog-confirmation.component';
import { AsyncPipe } from '@angular/common';
import { ServiceListComponent } from "../../../components/service-list/service-list.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ServiceListComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule
],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements AfterViewInit {

  orders$: Observable<OrderPage> | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() idClass!: string;

  pageIndex = 0;
  pageSize = 12;

  constructor(
    private orderServiceService: OrderServiceService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {
    //this.refresh();
  }

  ngAfterViewInit(): void {
    this.refresh();
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 12 }) {
    this.orders$ = this.orderServiceService.listByClass(this.idClass, pageEvent.pageIndex, pageEvent.pageSize)
    .pipe(
      tap(() => {
        this.pageIndex = pageEvent.pageIndex;
        this.pageSize = pageEvent.pageSize;
      }),
      catchError(error => {
        this.onError('Erro ao carregar pedidos.');
        return of({ orders: [], totalElements: 0, totalPages: 0 })
      })
    );
  }

  onError(errorMsg: string) {
    this.toastService.error(errorMsg);
  }

  onAdd() {
    this.router.navigate(['/user/class/', this.idClass, 'newOrder']);
  }

  onEdit(order: OrderService) {
    this.router.navigate(['/user/class/', order.classId, 'editOrder', order.id]);
  }

  onRemove(order: OrderService) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover esse Pedido?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.orderServiceService.remove(order.id).subscribe(
          () => {
            this.refresh();
            this.toastService.success("Pedido removido com sucesso");
          },
          () => this.onError('Erro ao tentar remover o pedido.')
        );
      }
    });
  }

  getUserLogado() {
    return this.authService.getLoggedInUserId();
  }

}
