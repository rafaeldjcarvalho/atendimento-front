import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SideNavComponent } from "../side-nav/side-nav.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavComponent,
    RouterOutlet
  ],
  templateUrl: './default-app-layout.component.html',
  styleUrl: './default-app-layout.component.scss'
})
export class DefaultAppLayoutComponent {

}
