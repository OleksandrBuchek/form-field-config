import { FormControl, FormGroup } from '@angular/forms';
import { PersonInfoForm } from '../person-info';
import { AddressForm } from '../address';
import { DoctorDetails } from '../data-access';

export type DoctorInfoForm = FormGroup<{
  firstName: FormControl<string | DoctorDetails>;
  lastName: FormControl<string | DoctorDetails>;
  address: AddressForm;
}>;

export type MedicalCaseReportForm = FormGroup<{
  patient: PersonInfoForm;
  doctor: DoctorInfoForm;
}>;
