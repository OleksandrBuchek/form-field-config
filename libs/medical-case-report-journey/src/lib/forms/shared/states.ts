import { controlValue } from '@shared/util-forms';
import { Observable, combineLatest, map } from 'rxjs';
import { injectDoctorInfoForm } from './form-injectors';

export const isAddressDisabled = (): Observable<boolean> => {
  const doctorInfoForm = injectDoctorInfoForm();

  return combineLatest([
    controlValue(doctorInfoForm.controls.firstName),
    controlValue(doctorInfoForm.controls.lastName),
  ]).pipe(map(([firstName, lastName]) => typeof firstName !== 'string' && typeof lastName !== 'string'));
};
