import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowForAccessDirective } from '../../../guards/directives/show-for-access.directive';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Class } from '../../../interfaces/class.interface';
import { catchError, first, Observable, of, tap } from 'rxjs';
import { ClassService } from '../../../services/class/class.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmationComponent } from '../../../components/dialog-confirmation/dialog-confirmation.component';

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

  refresh() {
    this.authService.user$.pipe(first()).subscribe(user => {
      if (user) {
        this.classService.getClassesUser(user.id).pipe(
          first(), // Garante que a chamada HTTP seja feita apenas uma vez
          tap(userClasses => {
            this.classList = userClasses;
          }),
          catchError(error => {
            this.onError('Erro ao carregar turmas do usuário.');
            return of([]);
          })
        ).subscribe();
      }
    });
  }

  onError(errorMsg: string) {
    this.toastService.error(errorMsg);
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
}
