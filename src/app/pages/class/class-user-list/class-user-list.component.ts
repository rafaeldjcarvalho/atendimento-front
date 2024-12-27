import { error } from 'console';
import { AfterViewInit, Component, Input } from '@angular/core';
import { UserListComponent } from "../../../components/user-list/user-list.component";
import { UserService } from '../../../services/user/user.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../../../components/dialog-confirmation/dialog-confirmation.component';
import { ClassService } from '../../../services/class/class.service';

@Component({
  selector: 'app-class-user-list',
  standalone: true,
  imports: [UserListComponent, AsyncPipe],
  templateUrl: './class-user-list.component.html',
  styleUrl: './class-user-list.component.scss'
})
export class ClassUserListComponent implements AfterViewInit {

  @Input() classId!: string;
  students$: Observable<User[]> | null = null;
  teachers$: Observable<User[]> | null = null;
  monitors$: Observable<User[]> | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private classService: ClassService,
    public dialog: MatDialog,
    private toastService: ToastrService
  ){}

  ngAfterViewInit(): void {
    this.refresh();
  }

  refresh() {
    try{
      this.teachers$ = this.userService.teacherListByClassId(this.classId);
      this.monitors$ = this.userService.monitorListByClassId(this.classId);
      this.students$ = this.userService.listByClassId(this.classId);

      this.students$.subscribe((students) => {
        const adjustedStudents = students.map((student) => {
          // Ajusta o tipo de acesso para aluno, caso seja monitor em outras turmas
          return {
            ...student,
            access: student.access === 'Monitor' ? 'Aluno' : student.access,
          };
        });

        // Atualiza a lista de alunos com os ajustes
        this.students$ = of(adjustedStudents);
      });
    } catch (error) {
      this.onError("Erro ao carregar usuários da turma.");
      console.log(error)
    }
  }

  onError(errorMsg: string) {
    this.toastService.error(errorMsg);
  }

  getUserLogged() : string {
    const id = this.authService.getLoggedInUserId();
    return id? id : '';
  }

  onRemove(user: User) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover este usuário?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.classService.cancelSubscribe(this.classId, user.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Usuário removido da turma com sucesso.");
          },
          error: () => this.toastService.error("Erro! Usuário não removido da turma."),
        })
      }
    });
  }

  onAddMonitor(user: User) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja transformar este usuário em Monitor?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.classService.promoteToMonitor(this.classId, user.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Monitor adicionado a turma com sucesso.");
          },
          error: () => {
            this.toastService.warning('O aluno já é monitor de outra turma.');
          },
        })
      }
    });
  }

  onRemoveMonitor(user: User) {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja transformar este usuário em Aluno?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.classService.demoteToStudent(this.classId, user.id).subscribe({
          next: () => {
            this.refresh();
            this.toastService.success("Monitor removido da turma com sucesso.");
          },
          error: () => this.toastService.error("Erro! Monitor não removido da turma."),
        })
      }
    });
  }

}
