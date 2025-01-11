import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Class } from '../../../interfaces/class.interface';
import { catchError, filter, first, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ClassService } from '../../../services/class/class.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmationComponent } from '../../../components/dialog-confirmation/dialog-confirmation.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  classList: Class[] | null = null;

  private destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refresh() {
    this.authService.user$.pipe(
      first(), // Garante que a lógica seja executada apenas uma vez
      takeUntil(this.destroy$),
      switchMap((user) => {
        if (user) {
          return this.classService.getClassesUser(user.id).pipe(
            tap((userClasses) => (this.classList = userClasses)),
            catchError((error: HttpErrorResponse) => {
              this.handleError(error);
              return of([]);
            })
          );
        } else {
          this.router.navigate(['/login']); // Redireciona se o usuário não estiver logado
          return of([]); // Retorna um Observable vazio
        }
      })
    ).subscribe();
  }

  getUserLogged() {
    return this.authService.getLoggedInUserId();
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
        this.classService.remove(classes.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Turma removida com sucesso");
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        });
      }
    });
  }

  onUnSubscribe(classes: Class) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja cancelar a inscrição?',
    });

    dialogRef.afterClosed().pipe(
      first(),
      filter((result) => result),
      switchMap(() =>
        this.authService.user$.pipe(
          first(),
          switchMap((user) =>
            user
              ? this.classService.cancelSubscribe(classes.id, user.id).pipe(
                  tap(() => {
                    this.refresh();
                    this.toastService.success('Inscrição cancelada com sucesso');
                  }),
                  catchError((error: HttpErrorResponse) => {
                    this.handleError(error);
                    return of();
                  })
                )
              : of()
          )
        )
      )
    ).subscribe();
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
