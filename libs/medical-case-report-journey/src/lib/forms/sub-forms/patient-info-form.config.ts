import { FormGroupConfig, overrideAsSingleSelect, overrideAsTextInput } from '@shared/ui-polymorpheus-forms';
import { PersonInfoForm, getPersonInfoFormConfig } from '../../person-info';
import {
  getArePatientAndDoctorDifferentPeopleValidator,
  getPatientAndDoctorNamesChanges,
  withCountriesOptions,
} from '../shared';
import { inject } from '@angular/core';
import { CountriesApi } from '../../data-access';
import { memoUntilDestroyed } from '@shared/util-memoization';

export const getPatientInfoFormConfig = (): FormGroupConfig<PersonInfoForm> => {
  const config = getPersonInfoFormConfig();

  const patientAndDoctorNamesChanges = memoUntilDestroyed(() => getPatientAndDoctorNamesChanges());

  const arePatientAndDoctorDifferentPeopleValidator = memoUntilDestroyed(() =>
    getArePatientAndDoctorDifferentPeopleValidator(patientAndDoctorNamesChanges()),
  );

  const firstName = overrideAsTextInput(config.controls.firstName, {
    validation: {
      triggerOn: patientAndDoctorNamesChanges,
      deferredValidators: () => [arePatientAndDoctorDifferentPeopleValidator()],
      messages: () => ({
        patientAndDoctorAreSame: `Patient's first name is invalid`,
      }),
    },
  });

  const lastName = overrideAsTextInput(config.controls.lastName, {
    validation: {
      triggerOn: patientAndDoctorNamesChanges,
      deferredValidators: () => [arePatientAndDoctorDifferentPeopleValidator()],
      messages: () => ({
        patientAndDoctorAreSame: `Patient's last name is invalid`,
      }),
    },
  });

  config.controls.firstName = firstName;
  config.controls.lastName = lastName;

  const country = overrideAsSingleSelect(config.controls.address.controls.country, {
    props: {
      options: withCountriesOptions,
    },
    hooks: {
      onInit: () => {
        inject(CountriesApi).fetchCountries();
      },
    },
  });

  config.controls.address.controls.country = country;

  return config;
};
