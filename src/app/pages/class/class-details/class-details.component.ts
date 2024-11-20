import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtilsService } from '../../../services/form/form-utils.service';
import { MatInputModule } from '@angular/material/input';

interface ClassForm {
  name: FormControl,
  date: FormControl
}

@Component({
  selector: 'app-class-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent {

  classForm!: FormGroup<ClassForm>;

  constructor(
    public formUtils: FormUtilsService
  ) {
    this.classForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      date: new FormControl(new Date().toISOString().split('T')[0])
    });
  }

  onSubmit() {

  }

  onCancel() {

  }

}
