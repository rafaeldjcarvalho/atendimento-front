import { Component, OnInit } from '@angular/core';
import { Class } from '../../../interfaces/class.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { CalendarListComponent } from "../calendar-list/calendar-list.component";
import { OrderListComponent } from "../order-list/order-list.component";
import { CustomerServiceListComponent } from "../customer-service-list/customer-service-list.component";
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-class-principal',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    CalendarListComponent,
    OrderListComponent,
    CustomerServiceListComponent
],
  templateUrl: './class-principal.component.html',
  styleUrl: './class-principal.component.scss'
})
export class ClassPrincipalComponent implements OnInit {

  clazz!: Class;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const classes: Class = this.route.snapshot.data['classes'];
    if(classes) {
      this.clazz = classes;
    }
  }

  onAddCalendar(classId: string) {
    this.router.navigate(['/user/class/', classId, 'newCalendar']);
  }
}
