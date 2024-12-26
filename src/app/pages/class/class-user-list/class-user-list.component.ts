import { error } from 'console';
import { AfterViewInit, Component, Input } from '@angular/core';
import { UserListComponent } from "../../../components/user-list/user-list.component";
import { UserService } from '../../../services/user/user.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../../../interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

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

}
