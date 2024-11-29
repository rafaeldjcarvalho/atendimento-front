import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ClassCalendarComponent } from '../../../components/class-calendar/class-calendar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ClassCalendarComponent
  ],
  templateUrl: './calendar-list.component.html',
  styleUrl: './calendar-list.component.scss'
})
export class CalendarListComponent {

  @Input() idClass: string = '';
  @Output('addCalendar') onAdd = new EventEmitter();

  addCalendar() {
    this.onAdd.emit();
  }

}
