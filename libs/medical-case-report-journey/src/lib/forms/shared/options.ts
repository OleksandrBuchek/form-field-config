import { inject } from '@angular/core';
import { controlValue } from '@shared/util-forms';
import { UIOption } from '@shared/util-types';
import { Observable, map, filter, combineLatest } from 'rxjs';
import { CountriesApi, DoctorDetails, DoctorsApi } from '../../data-access';
import { DoctorInfoForm } from '../form.model';
import { PersonInfoForm } from '../../person-info';

const getPersonFullName = ({ firstName, lastName }: PersonInfoForm['value']): string => `${firstName} ${lastName}`;

export const withCountriesOptions = (): Observable<Array<UIOption<string>>> => {
  return inject(CountriesApi).countries$.pipe(
    map((countries) => countries.map((country) => ({ value: country, label: country }))),
  );
};

export const withFilteredDoctorsListOptions = (
  control: DoctorInfoForm['controls']['firstName'] | DoctorInfoForm['controls']['lastName'],
): Observable<Array<UIOption<DoctorDetails>>> => {
  const doctorsList$ = inject(DoctorsApi).doctorsList$;
  const query$ = controlValue(control).pipe(filter((value): value is string => typeof value === 'string'));

  return combineLatest([doctorsList$, query$]).pipe(
    map(([allDoctors, query]) =>
      allDoctors.filter((doctor) => {
        const doctorFullName = `${doctor.firstName}${doctor.lastName}`.toLowerCase();

        return doctorFullName.includes(query.toLowerCase());
      }),
    ),
    map((filteredDoctors) => filteredDoctors.map((doctor) => ({ label: getPersonFullName(doctor), value: doctor }))),
  );
};
