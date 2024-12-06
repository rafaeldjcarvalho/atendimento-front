import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { ClassService } from '../../../services/class/class.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-calendar-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './calendar-form.component.html',
  styleUrl: './calendar-form.component.scss'
})
export class CalendarFormComponent implements OnInit{

  calendarForm!: FormGroup;
  classId!: string;

  daysOfWeek = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO', 'DOMINGO'];

  constructor(
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    private service: ClassService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id') || ''; // 'id' é o nome do parâmetro na rota
    });

    this.authService.user$.subscribe(user => {
      if (user) {
        // Inicialize o formulário com os valores do usuário autenticado
        this.calendarForm = this.formBuilder.group({
          ownerName: [user.name, Validators.required],
          ownerId: [user.id, Validators.required],
          schedules: this.formBuilder.array(this.retrieveSchedules(), Validators.required)
        });
      }
    });
  }

  retrieveSchedules() {
    const schedules = [];
    schedules.push(this.createSchedule());

    return schedules;
  }

  getSchedulesFormArray() {
    return (<UntypedFormArray>this.calendarForm.get('schedules')).controls;
  }

  createSchedule(): FormGroup {
    return this.formBuilder.group({
      dayOfWeek: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  addNewSchedule() {
    const schedule = this.calendarForm.get('schedules') as UntypedFormArray;
    schedule.push(this.createSchedule());
  }

  removeSchedule(index: number): void {
    const schedules = this.calendarForm.get('schedules') as UntypedFormArray;
    schedules.removeAt(index);
  }

  onSubmit() {
    if (this.calendarForm.valid) {
      const calendarDTO = this.calendarForm.value;
      //console.log('CalendarDTO:', calendarDTO);
      this.service.addCalendar(this.classId, calendarDTO).subscribe({
        next: () => {
          this.toastService.success('Calendário adicionado com sucesso!');
          this.onCancel();
        },
        error: () => this.toastService.error('Erro ao adicionar calendário.')
      })
    } else {
      this.formUtils.validateAllFormFields(this.calendarForm);
    }
  }

  onCancel() {
    this.location.back();
  }
}
