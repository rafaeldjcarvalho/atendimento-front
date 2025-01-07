import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ClassService } from '../../../services/class/class.service';
import { Class } from '../../../interfaces/class.interface';
import { AuthService } from '../../../services/auth.service';
import { ReportData } from '../../../interfaces/report/report.interface';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.scss'
})
export class ReportListComponent implements OnInit{

  classes: Class[] | null = null;
  reportData: ReportData = {
    totalServices: 0,
    completedServices: 0,
    canceledServices: 0,
    servicesDays: [],
    weeklyUsage: {}
  };
  selectedClassId: number = 0;
  weeklyUsageArray!: any;


  constructor(
    private classService: ClassService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.classService.getClassesUser(user.id).subscribe(classes => this.classes = classes);
      }
    });
  }

  loadReportData(): void {
    if (this.selectedClassId) {
      const classId = this.selectedClassId.toString();
      this.classService.getReport(classId).subscribe(data => {
        this.reportData = data;
        this.weeklyUsageArray = Object.values(this.reportData.weeklyUsage).map(user => ({
          userName: user.userName,
          hoursByWeekArray: Object.entries(user.hoursByWeek).map(([week, hours]) => ({
            week,
            hours
          }))
        }));
      })
    }
  }

}
