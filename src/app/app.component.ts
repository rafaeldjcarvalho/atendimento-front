import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DefaultLoginLayoutComponent } from "./components/default-login-layout/default-login-layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'atendimento-front';
}
