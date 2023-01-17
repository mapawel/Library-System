export type UserParams = {
  pesel: number;
  firstName: string;
  lastName: string;
};

export type ExceptionPayload = {
  pesel: number;
  firstName?: string;
  lastName?: string;
};
