import { toSignal } from '@angular/core/rxjs-interop';
import { ValidatorFn, ValidationErrors } from '@angular/forms';
import { PersonInfoForm } from '../../person-info';
import { getPatientAndDoctorNamesChanges } from './value-changes';
import { isEqual } from '@shared/util-helpers';

const areSamePeople = (personOne: PersonInfoForm['value'], personTwo: PersonInfoForm['value']): boolean =>
  Boolean(personOne.firstName && personOne.lastName && personTwo.firstName && personTwo.lastName) &&
  isEqual(personOne, personTwo);

export const getArePatientAndDoctorDifferentPeopleValidator = (
  patientAndDoctorNamesChanges$: ReturnType<typeof getPatientAndDoctorNamesChanges>,
): ValidatorFn => {
  const getPatientAndDoctor = toSignal(patientAndDoctorNamesChanges$, { requireSync: true });

  return (): ValidationErrors => {
    const { patient, doctor } = getPatientAndDoctor();

    return areSamePeople(patient, doctor) ? { patientAndDoctorAreSame: true } : {};
  };
};
