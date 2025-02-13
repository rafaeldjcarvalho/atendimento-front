import { CustomerPage } from './../../../interfaces/customer-page.interface';
import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ServiceListComponent } from '../../../components/service-list/service-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { catchError, first, map, Observable, of, tap } from 'rxjs';
import { CustomerServiceService } from '../../../services/order/customer-service.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../../../interfaces/orderService.interface';
import { DialogConfirmationComponent } from '../../../components/dialog-confirmation/dialog-confirmation.component';
import { ServiceDialogComponent } from '../../../components/service-dialog/service-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-service-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ServiceListComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    FormsModule,
    MatSelectModule
  ],
  templateUrl: './customer-service-list.component.html',
  styleUrl: './customer-service-list.component.scss'
})
export class CustomerServiceListComponent implements AfterViewInit {

  customerServices$: Observable<CustomerPage> | null = null;

  //serviceSelectedId: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() idClass!: string;
  filter: number = 0;

  pageIndex = 0;
  pageSize = 12;

  constructor(
    private customerServiceService: CustomerServiceService,
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
      this.customerServices$ = this.customerServiceService.listByClass(this.idClass, pageEvent.pageIndex, pageEvent.pageSize)
        .pipe(
          tap(() => {
            this.pageIndex = pageEvent.pageIndex;
            this.pageSize = pageEvent.pageSize;
          }),
          catchError((error: HttpErrorResponse) => {
            this.handleError(error);
            return of({ services: [], totalElements: 0, totalPages: 0 })
          })
        );
    } else {
      this.authService.user$.subscribe({
        next: (user) => {
          if(user?.id && user.access == "Aluno") {
            this.customerServices$ = this.customerServiceService.listByStudent(user.id, pageEvent.pageIndex, pageEvent.pageSize).pipe(
              tap(() => {
                this.pageIndex = pageEvent.pageIndex;
                this.pageSize = pageEvent.pageSize;
              }),
              catchError((error: HttpErrorResponse) => {
                this.handleError(error);
                return of({ services: [], totalElements: 0, totalPages: 0 })
              })
            );
          } else if (user?.id != undefined) {
            this.customerServices$ = this.customerServiceService.listByOwner(user.id, pageEvent.pageIndex, pageEvent.pageSize).pipe(
              tap(() => {
                this.pageIndex = pageEvent.pageIndex;
                this.pageSize = pageEvent.pageSize;
              }),
              catchError((error: HttpErrorResponse) => {
                this.handleError(error);
                return of({ services: [], totalElements: 0, totalPages: 0 })
              })
            );
          }
        }
      })
    }
  }

  onAdd() {
    this.router.navigate(['/user/class/', this.idClass, 'newService']);
  }

  onEdit(service: CustomerService) {
    this.router.navigate(['/user/class/', service.classId, 'editService', service.id]);
  }

  onRemove(service: CustomerService) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover esse Atendimento?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.customerServiceService.remove(service.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Atendimento removido com sucesso.");
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

  onOpenDialog(service: CustomerService) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: { service }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //console.log('Presença registrada:', result);
      }
    });
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
