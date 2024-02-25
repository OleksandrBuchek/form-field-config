import { controlValue } from '@shared/util-forms';
import { combineLatest, map, distinctUntilChanged, shareReplay } from 'rxjs';
import { DoctorInfoForm } from '../form.model';
import { injectPatientInfoForm, injectDoctorInfoForm } from './form-injectors';
import { isEqual } from '@shared/util-helpers';

const getDoctorFirstName = (firstName: DoctorInfoForm['value']['firstName'] | string): string =>
  typeof firstName === 'string' ? firstName : firstName?.firstName ?? '';

const getDoctorLastName = (lastName: DoctorInfoForm['value']['lastName'] | string): string =>
  typeof lastName === 'string' ? lastName : lastName?.lastName ?? '';

export const getPatientAndDoctorNamesChanges = () => {
  const patientInfoForm = injectPatientInfoForm();
  const doctorInfoForm = injectDoctorInfoForm();

  return combineLatest({
    patient: combineLatest({
      firstName: controlValue(patientInfoForm.controls.firstName),
      lastName: controlValue(patientInfoForm.controls.lastName),
    }),
    doctor: combineLatest({
      firstName: controlValue(doctorInfoForm.controls.firstName).pipe(map(getDoctorFirstName)),
      lastName: controlValue(doctorInfoForm.controls.lastName).pipe(map(getDoctorLastName)),
    }),
  }).pipe(distinctUntilChanged(isEqual), shareReplay({ refCount: true, bufferSize: 1 }));
};
