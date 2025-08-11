export type ButtonTypes = `${ButtonTypesEnum}`; // turn enum values into type

export enum ButtonTypesEnum {
  Button = 'button', // Defines a click Button.
  Reset = 'reset', // This Button resets all the controls in the form elements to their initial values.
  Submit = 'submit', // This Button submits the form data to the server.
}
