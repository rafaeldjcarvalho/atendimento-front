import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Class } from '../../../interfaces/class.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss'
})
export class ClassListComponent {

  list: Class[] = [];

  constructor() {
    this.list.push({id: 1, name: "Turma01", date: "2024-11-20", owner: { id: 1, name: "Felipe"}});
    this.list.push({id: 1, name: "Turma02", date: "2024-10-20", owner: { id: 1, name: "Felipe"}})
    this.list.push({id: 1, name: "Turma03", date: "2024-09-20", owner: { id: 1, name: "Felipe"}})
  }

  onDelete() {

  }

}
