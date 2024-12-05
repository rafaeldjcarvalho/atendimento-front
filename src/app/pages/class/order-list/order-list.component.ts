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
    console.log("novo");
    //this.router.navigate(['/user/class/new']);
  }

  onEdit(order: OrderService) {
    console.log("editar");
    //this.router.navigate(['/user/class/edit', order.id]);
  }

  onRemove(order: OrderService) {
    console.log("reomver");
    /*
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover essa turma?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.orderServiceService.remove(order.id).subscribe(
          () => {
            this.refresh();
            this.toastService.success("Turma removida com sucesso");
          },
          () => this.onError('Erro ao tentar remover turma.')
        );
      }
    });
    */
  }

}
