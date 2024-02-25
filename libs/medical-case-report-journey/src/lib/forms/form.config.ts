import { FormGroupConfig } from '@shared/ui-polymorpheus-forms';
import { MedicalCaseReportForm } from './form.model';
import { getDoctorInfoFormConfig, getPatientInfoFormConfig } from './sub-forms';

export const medicalCaseReportFormConfig: FormGroupConfig<MedicalCaseReportForm> = {
  controls: {
    patient: getPatientInfoFormConfig(),
    doctor: getDoctorInfoFormConfig(),
  },
};
