import {
  FormGroupConfig,
  overrideAsAutocomplete,
  overrideAsSingleSelect,
  overrideFormGroup,
} from '@shared/ui-polymorpheus-forms';
import { getPersonInfoFormConfig } from '../../person-info';
import { AddressForm } from '../../address';
import {
  isAddressDisabled,
  displayWithFirstName,
  displayWithLastName,
  withFilteredDoctorsListOptions,
  populateFormWhenDoctorIsSelected,
  withCountriesOptions,
} from '../shared';
import { inject } from '@angular/core';
import { CountriesApi, DoctorsApi } from '../../data-access';
import { DoctorInfoForm } from '../form.model';

export const getDoctorAddressFormConfig = (config: FormGroupConfig<AddressForm>): FormGroupConfig<AddressForm> => {
  const newConfig = overrideFormGroup(config, {
    states: {
      disabled: isAddressDisabled,
    },
  });

  const country = overrideAsSingleSelect(newConfig.controls.country, {
    props: {
      options: withCountriesOptions,
    },
    hooks: {
      onInit: () => {
        inject(CountriesApi).fetchCountries();
      },
    },
  });

  newConfig.controls.country = country;

  return newConfig;
};

export const getDoctorInfoFormConfig = (): FormGroupConfig<DoctorInfoForm> => {
  const configBase = getPersonInfoFormConfig() as FormGroupConfig<DoctorInfoForm>;

  const newConfig = overrideFormGroup(configBase, {
    hooks: {
      onInit: (form) => {
        inject(DoctorsApi).fetchDoctorsList();

        return populateFormWhenDoctorIsSelected(form);
      },
    },
  });

  const firstName = overrideAsAutocomplete(newConfig.controls.firstName, {
    props: {
      options: (form) => withFilteredDoctorsListOptions(form.controls.firstName),
      displayWith: displayWithFirstName,
    },
  });

  const lastName = overrideAsAutocomplete(newConfig.controls.lastName, {
    props: {
      options: (form) => withFilteredDoctorsListOptions(form.controls.lastName),
      displayWith: displayWithLastName,
    },
  });

  newConfig.controls.firstName = firstName;
  newConfig.controls.lastName = lastName;

  newConfig.controls.address = getDoctorAddressFormConfig(newConfig.controls.address);

  return newConfig;
};
