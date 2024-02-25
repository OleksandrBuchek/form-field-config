import { inject } from '@angular/core';
import { ROOT_FORM_GROUP_REF } from '@shared/ui-polymorpheus-forms';
import { PersonInfoForm } from '../../person-info';
import { DoctorInfoForm, MedicalCaseReportForm } from '../form.model';
import { AddressForm } from '../../address';

export const injectMedicalCaseReportForm = (): MedicalCaseReportForm =>
  inject<MedicalCaseReportForm>(ROOT_FORM_GROUP_REF);

export const injectPatientInfoForm = (): PersonInfoForm => injectMedicalCaseReportForm().controls.patient;
export const injectPatientAddressForm = (): AddressForm => injectPatientInfoForm().controls.address;

export const injectDoctorInfoForm = (): DoctorInfoForm => injectMedicalCaseReportForm().controls.doctor;
