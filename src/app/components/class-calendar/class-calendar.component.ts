import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import { ClassService } from '../../services/class/class.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import { CustomerServiceService } from '../../services/order/customer-service.service';

@Component({
  selector: 'app-class-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './class-calendar.component.html',
  styleUrl: './class-calendar.component.scss'
})
export class ClassCalendarComponent {

  /*
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [timeGridWeek]
  };
  */


  calendarOptions?: CalendarOptions;
  selectedCalendarId!: number;
  calendars: any[] = [];

  @Input() classId!: string;

  constructor(
    private classService: ClassService,
    private customerService: CustomerServiceService,
    public dialog: MatDialog,
    private toastService: ToastrService) {}

  ngOnInit(): void {
    this.loadCalendars();
  }

  loadCalendars(): void {
  // Substitua pelo ID da turma dinâmica
    this.classService.getCalendars(this.classId).subscribe((calendars) => {
      this.calendars = calendars;
      //console.log(calendars);
    });
  }

  onCalendarChange(calendarId: number): void {
    this.selectedCalendarId = calendarId;
    const calendarUser = this.calendars[calendarId-1]
    //console.log(calendarUser.ownerId);
    this.loadSchedules(calendarId, calendarUser.ownerId);
  }
  /*
  loadSchedules(calendarId: number): void {
    this.classService.getSchedules(calendarId).subscribe((schedules) => {
      // Mapeia os dias da semana para números
      const visibleDays = schedules.map((schedule: any) =>
        this.mapDayToNumber(schedule.dayOfWeek)
      );

      // Calcula os horários mínimos e máximos para cada dia
      const timeRanges = this.getTimeRanges(schedules);

      this.calendarOptions = {
        initialView: 'timeGridWeek',
        plugins: [timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        },
        hiddenDays: this.getHiddenDays(visibleDays),
        editable: false,
        droppable: false,
        // Define os horários mínimos e máximos com base nos eventos
        slotMinTime: timeRanges.minTime,
        slotMaxTime: timeRanges.maxTime,
        events: schedules.map((schedule: any) => ({
          title: `${schedule.dayOfWeek}`,
          start: `2023-01-01T${schedule.startTime}`,
          end: `2023-01-01T${schedule.endTime}`,
          daysOfWeek: [this.mapDayToNumber(schedule.dayOfWeek)],
        })),
      };
    });
  }
  */

  loadSchedules(calendarId: number, ownerId: string): void {
    // Obtém os horários do calendário
    this.classService.getSchedules(calendarId).subscribe((schedules) => {
      // Obtém os atendimentos relacionados ao calendário
      this.customerService.listServicesByOwner(ownerId).subscribe((appointments) => {
        // Combina horários e atendimentos em um único array de eventos
        const events = [
          ...schedules.map((schedule: any) => ({
            title: `Horário: ${schedule.dayOfWeek}`,
            start: `2023-01-01T${schedule.startTime}`,
            end: `2023-01-01T${schedule.endTime}`,
            daysOfWeek: [this.mapDayToNumber(schedule.dayOfWeek)],
            color: '#6C757D', // Cor dos horários
          })),
          ...appointments.map((appointment: any) => ({
            title: `Atendimento: ${appointment.title}`,
            start: `${appointment.date}T${appointment.time_start}`,
            end: `${appointment.date}T${appointment.time_end}`,
            color: '#007BFF', // Cor dos atendimentos
          })),
        ];

        // Mapeia os dias da semana para números
        const visibleDays = schedules.map((schedule: any) =>
          this.mapDayToNumber(schedule.dayOfWeek)
        );

        // Calcula os horários mínimos e máximos para cada dia
        const timeRanges = this.getTimeRanges(schedules);

        // Configuração do FullCalendar
        this.calendarOptions = {
          initialView: 'timeGridWeek',
          plugins: [timeGridPlugin, interactionPlugin],
          headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
          },
          hiddenDays: this.getHiddenDays(visibleDays),
          editable: false,
          droppable: false,
          slotMinTime: timeRanges.minTime,
          slotMaxTime: timeRanges.maxTime,
          events: events, // Define os eventos consolidados
        };
      });
    });
  }

  getHiddenDays(visibleDays: number[]): number[] {
    const allDays = [0, 1, 2, 3, 4, 5, 6]; // Dias da semana (0 = domingo, 6 = sábado)
    return allDays.filter((day) => !visibleDays.includes(day)); // Retorna dias que não devem ser exibidos
  }

  getTimeRanges(schedules: any[]): { minTime: string; maxTime: string } {
    const startTimes = schedules.map((s) => s.startTime);
    const endTimes = schedules.map((s) => s.endTime);

    const minTime = startTimes.reduce((min, time) => (time < min ? time : min), '23:59:59');
    let maxTime = endTimes.reduce((max, time) => (time > max ? time : max), '00:00:00');

    maxTime = this.addOneHour(maxTime);

    return { minTime, maxTime };
  }

  addOneHour(time: string): string {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24; // Incrementa 1 hora e ajusta para 24h
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  mapDayToNumber(day: string): number {
    const days: { [key: string]: number } = {
      DOMINGO: 0,
      SEGUNDA: 1,
      TERÇA: 2,
      QUARTA: 3,
      QUINTA: 4,
      SEXTA: 5,
      SÁBADO: 6,
    };
    return days[day.toUpperCase()] ?? -1; // Retorna -1 se o dia for inválido
  }

  onRemoveCalendar() {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 'Tem certeza que deseja remover esse calendário?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.classService.removeCalendar(this.classId, this.selectedCalendarId).subscribe({
          next: () => {
            this.calendarOptions = undefined;
            this.loadCalendars();
            window.location.reload();
            //const trigger = document.querySelector('mat-select#calendarSelect');
            //(trigger as HTMLElement)?.focus();
            this.toastService.success("Calendário removido com sucesso!")
          },
          error: () => this.toastService.error('Erro ao tentar remover calendário.')
        });
      }
    });
  }

}
