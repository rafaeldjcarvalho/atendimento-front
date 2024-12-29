import { MatCardModule } from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { OrderServiceService } from '../../../services/order/order-service.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../interfaces/orderService.interface';
import { Location } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClassService } from '../../../services/class/class.service';
import { MatSelectModule } from '@angular/material/select';
import { Schedule } from '../../../interfaces/schedule.interface';
import { Calendar } from '../../../interfaces/calendar.interface';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbar,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.scss'
})
export class OrderFormComponent implements OnInit {

  orderForm!: FormGroup;
  classId!: string;

  calendars: Calendar[] = [];
  availableDates: Date[] = [];
  availableTimes: any[] = [];
  filteredTimeSlots: any[] = [];

  constructor(
    public formUtils: FormUtilsService,
    private formBuilder: FormBuilder,
    private service: OrderServiceService,
    private classService: ClassService,
    private route: ActivatedRoute,
    private location: Location,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    //this.route.paramMap.subscribe((params) => {
    //  this.classId = params.get('id') || ''; // 'id' é o nome do parâmetro na rota
    //});

    const order: OrderService = this.route.snapshot.data['order'];
    this.orderForm = this.formBuilder.group({
      id: [order.id],
      title: [order.title, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [order.description, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      date: [order.date, [Validators.required, Validators.maxLength(10)]],
      calendar: ['', Validators.required],
      time_start: [order.time_start, [Validators.required, Validators.maxLength(6)]],
      time_end: [order.time_end, [Validators.required, Validators.maxLength(6)]],
      status: [order.status, [Validators.required, Validators.maxLength(12)]],
      classId: [order.classId, [Validators.required]],
      userId: [order.userId, [Validators.required]]
    });

    this.classService.getCalendars(order.classId).subscribe((calendars) => {
      this.calendars = calendars;
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      this.service.save(this.orderForm.value).subscribe({
        next: () => this.onSuccess(),
        error: () => this.onError()
      });
    } else {
      this.formUtils.validateAllFormFields(this.orderForm);
    }
  }

  onCancel() {
    this.location.back();
  }

  private onSuccess() {
    this.toastService.success('Pedido adicionado com sucesso!');
    this.onCancel();
  }

  private onError() {
    this.toastService.success('ERRO ao criar pedido.');
  }

  onCalendarChange(calendar: any): void {
    // Filtrar as datas disponíveis a partir dos schedules
    this.availableDates = this.extractUniqueDates(calendar.schedules);
    this.availableTimes = [];
    this.orderForm.get('date')?.reset();
    this.orderForm.get('time_start')?.reset();
    this.orderForm.get('time_end')?.reset();
  }

  onDateChange(date: Date): void {
    const selectedCalendar = this.orderForm.get('calendar')?.value;
    if (selectedCalendar) {
      const selectedDay = this.getDayOfWeek(date); // Obter o dia da semana da data selecionada
      this.onDaySelected(selectedDay);
    }
  }

  onDaySelected(dayOfWeek: string): void {
    const selectedCalendar = this.orderForm.get('calendar')?.value;

    if (selectedCalendar) {
      const schedulesForDay: Schedule[] = selectedCalendar.schedules.filter(
        (schedule: Schedule) => schedule.dayOfWeek === dayOfWeek
      );

      if (schedulesForDay.length > 0) {
        this.availableTimes = schedulesForDay.flatMap((schedule: Schedule) =>
          this.generateTimeSlots(schedule.startTime, schedule.endTime)
        );
      } else {
        this.availableTimes = []; // Sem horários disponíveis para o dia no calendário selecionado
      }
    } else {
      this.availableTimes = []; // Nenhum calendário selecionado
    }
  }

  onTimeStartChange(startTime: string): void {
    const startIndex = this.availableTimes.indexOf(startTime);

    // Filtra os horários que vêm após o horário inicial selecionado
    this.filteredTimeSlots = this.availableTimes.slice(startIndex + 1);
  }

  generateTimeSlots(startTime: string, endTime: string, interval: number = 15): string[] {
    const start = this.parseTime(startTime); // Converte string para Date
    const end = this.parseTime(endTime); // Converte string para Date
    const timeSlots: string[] = [];

    let current = new Date(start);
    while (current <= end) {
      timeSlots.push(current.toTimeString().slice(0, 5)); // Formata como HH:mm
      current.setMinutes(current.getMinutes() + interval);
    }

    return timeSlots;
  }

  parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  validateTimeRange(group: FormGroup): ValidationErrors | null {
    const start = group.get('time_start')?.value;
    const end = group.get('time_end')?.value;

    if (start && end && start >= end) {
      return { timeRangeInvalid: true }; // Horário inválido
    }

    return null; // Válido
  }

  // Extrair dias únicos a partir dos schedules
  extractUniqueDates(schedules: any[]): Date[] {
    const uniqueDates = schedules.flatMap(schedule => {
      const dayOfWeek = schedule.dayOfWeek;
      const days = this.getNextDatesForDay(dayOfWeek, 30); // Buscar próximos 30 dias
      return days;
    });

    return Array.from(new Set(uniqueDates.map(date => date.toISOString()))).map(date => new Date(date));
  }

  // Obter os próximos dias específicos para o dia da semana fornecido
  getNextDatesForDay(dayOfWeek: string, range: number): Date[] {
    const daysMap: Record<string, number> = {
      "DOMINGO": 0,
      "SEGUNDA": 1,
      "TERÇA": 2,
      "QUARTA": 3,
      "QUINTA": 4,
      "SEXTA": 5,
      "SÁBADO": 6
    };

    const today = new Date();
    const targetDayIndex = daysMap[dayOfWeek];

    if (targetDayIndex === undefined) {
      throw new Error(`Dia da semana inválido: ${dayOfWeek}`);
    }

    const dates: Date[] = [];
    for (let i = 0; i < range; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      if (nextDate.getDay() === targetDayIndex) {
        dates.push(new Date(nextDate));
      }
    }

    return dates;
  }

  // Converter dia da semana para uma data
  getDateFromDay(dayOfWeek: string): Date {
    const daysMap: Record<string, number> = {
      "DOMINGO": 0,
      "SEGUNDA": 1,
      "TERÇA": 2,
      "QUARTA": 3,
      "QUINTA": 4,
      "SEXTA": 5,
      "SÁBADO": 6
    };

    const today = new Date();
    const dayIndex = daysMap[dayOfWeek];

    if (dayIndex === undefined) {
      throw new Error(`Dia da semana inválido: ${dayOfWeek}`);
    }

    const currentDayIndex = today.getDay();
    const diff = (dayIndex - currentDayIndex + 7) % 7; // Ajuste para dias futuros
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    return targetDate;
  }

  // Obter o dia da semana a partir de uma data
  getDayOfWeek(date: Date): string {
    const daysMap = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
    return daysMap[date.getDay()];
  }

  formatDateToPortuguese(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
  }
}
