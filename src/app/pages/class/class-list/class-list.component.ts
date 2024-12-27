import { AuthService } from './../../../services/auth.service';
import { DialogConfirmationComponent } from './../../../components/dialog-confirmation/dialog-confirmation.component';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Class } from '../../../interfaces/class.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClassService } from '../../../services/class/class.service';
import { catchError, first, map, Observable, of, tap } from 'rxjs';
import { ClassPage } from '../../../interfaces/class-page.interface';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RouterLink,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss'
})
export class ClassListComponent {

  classList$: Observable<ClassPage> | null = null;

  userClassIds: Set<string> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 10;

  constructor(
    private classService: ClassService,
    private authService: AuthService,
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
    this.authService.user$.pipe(first()).subscribe(user => {
      if (user) {
        this.classService.getClassesUser(user.id).pipe(
          first(), // Garante que a chamada HTTP seja feita apenas uma vez
          tap(userClasses => {
            this.userClassIds = new Set(userClasses.map(userClass => userClass.id));
          }),
          catchError(error => {
            this.onError('Erro ao carregar turmas do usuário.');
            return of([]);
          })
        ).subscribe();
      }
    });
  }

  isClassInUserClasses(classItem: Class): boolean {
    return this.userClassIds.has(classItem.id);
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

  onSubscribe(classes: Class) {
    //console.log("apertou o botão");
    this.authService.user$.pipe(
      first(),
      map((user) => {
        const userId = user?.id;
        //console.log("Colocou o id do usuário");
        if (userId) {
          this.classService.subscribeUser(classes.id, userId).subscribe({
            next: () => {
              this.refresh();
              this.toastService.success("Inscrição realizada com sucesso");
            },
            error: () => this.toastService.error("Inscrição não foi realizada."),
          });
        }
      })
    ).subscribe();
  }

  onUnSubscribe(classes: Class) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja cancelar a inscrição?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.authService.user$.subscribe(user => {
          if(user) {
            this.classService.cancelSubscribe(classes.id, user.id).subscribe({
              next: () => {
                this.refresh();
                this.toastService.success("Inscrição cancelada com sucesso");
              },
              error: () => this.toastService.error("Erro! Inscrição não removida."),
            })
          }
        })
      }
    });
  }
  

  getUserLogged() {
    return this.authService.getLoggedInUserId();
  }

}
