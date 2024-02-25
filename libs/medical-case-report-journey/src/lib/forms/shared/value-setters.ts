import { controlValue } from '@shared/util-forms';
import { Observable, merge, filter, distinctUntilChanged, tap } from 'rxjs';
import { DoctorDetails } from '../../data-access';
import { DoctorInfoForm } from '../form.model';
import { isEqual } from '@shared/util-helpers';

export const populateFormWhenDoctorIsSelected = (form: DoctorInfoForm): Observable<unknown> => {
  const populateFormWhenDoctorIsSelected$ = merge(
    controlValue(form.controls.lastName),
    controlValue(form.controls.firstName),
  ).pipe(
    filter((value): value is DoctorDetails => typeof value !== 'string'),
    distinctUntilChanged(isEqual),
    tap((doctor) => {
      form.controls.address.setValue(doctor.address);

      form.controls.firstName.setValue(doctor);
      form.controls.lastName.setValue(doctor);
    }),
  );

  return populateFormWhenDoctorIsSelected$;
};
