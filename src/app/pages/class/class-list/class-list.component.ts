import { DialogConfirmationComponent } from './../../../components/dialog-confirmation/dialog-confirmation.component';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Class } from '../../../interfaces/class.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassService } from '../../../services/class/class.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { ClassPage } from '../../../interfaces/class-page.interface';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss'
})
export class ClassListComponent {

  classList$: Observable<ClassPage> | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

  constructor(
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toastService: ToastrService
  ) {
    this.refresh();
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.classList$ = this.classService.list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap(() => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        }),
        catchError(error => {
          this.onError('Erro ao carregar turmas.');
          return of({ classes: [], totalElements: 0, totalPages: 0 })
        })
      );
  }

  onError(errorMsg: string) {
    this.toastService.error(errorMsg);
  }

  onAdd() {
    this.router.navigate(['/user/class/new']);
  }

  onEdit(classes: Class) {
    this.router.navigate(['/user/class/edit', classes.id]);
  }

  onRemove(classes: Class) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover essa turma?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.classService.remove(classes.id).subscribe(
          () => {
            this.refresh();
            this.toastService.success("Turma removida com sucesso");
          },
          () => this.onError('Erro ao tentar remover turma.')
        );
      }
    });
  }

}
