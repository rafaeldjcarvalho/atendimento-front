import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { AttendanceService } from '../../services/order/attendance.service';
import { CustomerService } from '../../interfaces/orderService.interface';
import { CustomerServiceService } from '../../services/order/customer-service.service';
import { first, Observable, tap } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './service-dialog.component.html',
  styleUrl: './service-dialog.component.scss'
})
export class ServiceDialogComponent implements OnInit {

  attendances: any[] = [];
  userAttendance: any = null;
  isLoading: boolean = true;

  service$: Observable<CustomerService> | null = null;

  ownerId: string | null = null;
  ownerName!: string;
  studentId: string | null = null;
  studentName!: string;

  constructor(
    public dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attendanceService: AttendanceService,
    private customerService: CustomerServiceService,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.service$ = this.customerService.getById(this.data.service.id).pipe(
      tap((service) => {
        this.addUsers(service.userId, service.studentId);
      }),
    );
  }

  loadAttendances(userId: string): void {
    this.attendanceService.getAttendancesByService(this.data.service.id).subscribe({
      next: (result) => {
        this.attendances = result;
        this.isLoading = false;
        this.userAttendance = this.attendances.find((a) => a.userId === userId);
      },
      error: () => {
        this.attendances = [];
        this.userAttendance = null;
        this.isLoading = false;
      },
    });
  }

  addUsers(ownerId: string, studentId: string): void {
    let ownerLoaded = false;
    let studentLoaded = false;

    this.userService.loadById(ownerId).subscribe({
      next: (user) => {
        this.ownerId = ownerId;
        this.ownerName = user.name;
        ownerLoaded = true;
        this.checkLoggedUser(ownerLoaded, studentLoaded);
      },
      error: () => this.onError("Erro ao carregar o proprietário do atendimento."),
    });

    this.userService.loadById(studentId).subscribe({
      next: (user) => {
        this.studentId = studentId;
        this.studentName = user.name;
        studentLoaded = true;
        this.checkLoggedUser(ownerLoaded, studentLoaded);
      },
      error: () => this.onError("Erro ao carregar o aluno do atendimento."),
    });
  }

  checkLoggedUser(ownerLoaded: boolean, studentLoaded: boolean): void {
    if (ownerLoaded && studentLoaded) {
      const user = this.authService.getLoggedInUserId();
      if (user != null && (user === this.ownerId || user === this.studentId)) {
        this.userAttendance = user; // Identifica o usuário logado
        this.loadAttendances(user); // Carrega as presenças associadas
      }
    }
  }

  registerAttendance(status: 'PRESENTE' | 'AUSENTE'): void {
    const userId = this.authService.getLoggedInUserId();
    if(userId != null) {
      this.attendanceService.registerAttendance(this.data.service.id, userId, status).subscribe({
        next: () => {
          this.dialogRef.close(status);
          this.onSuccess("Presença alterada com suscesso.");
        },
        error: () => this.onError("Erro ao alterar presença.")
      });
    }
  }

  onError(errorMsg: string) {
    this.toastService.error(errorMsg);
  }

  onSuccess(msg: string) {
    this.toastService.success(msg);
  }

  respondPresence(status: "PRESENTE" | "AUSENTE"): void {
    if (this.userAttendance) {
      // Atualizar presença existente
      this.attendanceService.updateAttendance(this.userAttendance.id, status).subscribe({
        next: () => {
          this.onSuccess('Presença atualizada com sucesso!');
          this.dialogRef.close();
        },
        error: () => this.onError('Erro ao atualizar presença.')
      });
    } else {
      // Criar nova presença
      const userId = this.authService.getLoggedInUserId();
      if(userId != null) {
        this.attendanceService.registerAttendance(this.data.service.id, userId, status).subscribe({
          next: () => {
            this.onSuccess('Presença registrada com sucesso!');
            this.dialogRef.close();
          },
          error: () => this.onError('Erro ao registrar presença.')
        });
      }
    }
  }

}
