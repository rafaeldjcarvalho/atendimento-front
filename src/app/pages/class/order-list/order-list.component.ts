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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { OrderListingComponent } from "../../../components/order-listing/order-listing.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormsModule,
    MatSelectModule,
    OrderListingComponent
],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements AfterViewInit {

  orders$: Observable<OrderPage> | null = null;

  //serviceSelectedId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() idClass!: string;
  filter: number = 0;

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

  onFilterChange(newFilter: number): void {
    this.filter = newFilter;
    this.refresh();
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 12 }) {
    if(this.filter == 0) {
      this.orders$ = this.orderServiceService.listByClass(this.idClass, pageEvent.pageIndex, pageEvent.pageSize)
        .pipe(
          tap(() => {
            this.pageIndex = pageEvent.pageIndex;
            this.pageSize = pageEvent.pageSize;
          }),
          catchError( (error: HttpErrorResponse) => {
            this.handleError(error);
            return of({ orders: [], totalElements: 0, totalPages: 0 })
          })
        );
    } else {
      const userId = this.getUserLogado();
      if(userId != null) {
        this.orders$ = this.orderServiceService.listByUser(userId, pageEvent.pageIndex, pageEvent.pageSize)
          .pipe(
            tap(() => {
              this.pageIndex = pageEvent.pageIndex;
              this.pageSize = pageEvent.pageSize;
            }),
            catchError( (error: HttpErrorResponse) => {
              this.handleError(error);
              return of({ orders: [], totalElements: 0, totalPages: 0 })
            })
          );
      }
    }
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
        this.orderServiceService.remove(order.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Pedido removido com sucesso");
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  getUserLogado() {
    return this.authService.getLoggedInUserId();
  }

  onAccept(order: OrderService){
    const user = this.getUserLogado();
    if(user != null) {
      //let customerService: CustomerService = { id: '', title: order.title, description: order.description, date: order.date, time_start: order.time_start, time_end: order.time_end, status: order.status, classId: order.classId, studentId: order.userId, userId: user};
      this.router.navigate(['/user/class/', order.classId, 'newService', order.id]);
    } else {
      this.showToastrError("Usuário não está logado.");
    }
  }

  onReject(order: OrderService) {
    //console.log("Rejeitado: " + order.id);
    this.onRemove(order);
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
