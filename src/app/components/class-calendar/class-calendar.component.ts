import { FullCalendarModule } from '@fullcalendar/angular';
import { Component, Input } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import { Class } from '../../interfaces/class.interface';
import { ClassService } from '../../services/class/class.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    CommonModule,
    FormsModule
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


  calendarOptions!: CalendarOptions;
  selectedCalendarId!: number;
  calendars: any[] = [];

  @Input() clazz!: Class;

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.loadCalendars();
  }

  loadCalendars(): void {
  // Substitua pelo ID da turma dinâmica
    this.classService.getCalendars(this.clazz.id).subscribe((calendars) => {
      this.calendars = calendars;
      //console.log(calendars);
    });
  }

  onCalendarChange(calendarId: number): void {
    this.selectedCalendarId = calendarId;
    this.loadSchedules(calendarId);
  }

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
      TERCA: 2,
      QUARTA: 3,
      QUINTA: 4,
      SEXTA: 5,
      SABADO: 6,
    };
    return days[day.toUpperCase()] ?? -1; // Retorna -1 se o dia for inválido
  }

}
