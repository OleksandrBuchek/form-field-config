/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroupFacade, provideFormGroupRoot } from '@shared/ui-polymorpheus-forms';
import { MedicalCaseReportForm, medicalCaseReportFormConfig } from './forms';
import { PersonInfoComponent } from './person-info';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'medical-case-report-journey',
  standalone: true,
  imports: [PersonInfoComponent, ReactiveFormsModule, MatCardModule],
  templateUrl: './medical-case-report-journey.component.html',
  styleUrls: ['./medical-case-report-journey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideFormGroupRoot(medicalCaseReportFormConfig)],
})
export class MedicalCaseReportJourneyComponent {
  readonly facade = inject<FormGroupFacade<MedicalCaseReportForm>>(FormGroupFacade);
}
