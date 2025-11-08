import { AbstractControl, ValidationErrors } from "@angular/forms";

export const passwordMatchValidator = (formGroup: AbstractControl):  ValidationErrors | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value)
      return { passwordsMisMatch: true }
    return null;
}
