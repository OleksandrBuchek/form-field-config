import { DoctorDetails } from '../../data-access';

export const displayWithFirstName = (value: DoctorDetails | string) =>
  typeof value === 'string' ? '' : value.firstName;

export const displayWithLastName = (value: DoctorDetails | string) => (typeof value === 'string' ? '' : value.lastName);
