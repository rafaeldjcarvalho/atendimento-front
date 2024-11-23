import { Component, OnInit } from '@angular/core';
import { ClassCalendarComponent } from '../../../components/class-calendar/class-calendar.component';
import { Class } from '../../../interfaces/class.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-class-principal',
  standalone: true,
  imports: [
    ClassCalendarComponent
  ],
  templateUrl: './class-principal.component.html',
  styleUrl: './class-principal.component.scss'
})
export class ClassPrincipalComponent implements OnInit {

  getClass!: Class;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const classes: Class = this.route.snapshot.data['classes'];
    if(classes) {
      this.getClass = classes;
    }
  }

}
