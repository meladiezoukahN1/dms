export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginState {
  error: string | null;
  isSubmitting: boolean;
}
