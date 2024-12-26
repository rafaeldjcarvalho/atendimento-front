import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  @Input() topico: string = '';
  @Input() loggedUser!: string;
  @Input() itensList: User[] = [];

}
