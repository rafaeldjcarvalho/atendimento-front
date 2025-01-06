import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterLink,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {

  isOpen: Observable<boolean>;

  constructor(private sidenavService: SidenavService) {
    this.isOpen = this.sidenavService.isOpen$;
  }

}
