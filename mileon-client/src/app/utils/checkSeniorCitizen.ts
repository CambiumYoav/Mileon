export function isSeniorCitizen(birthDate: Date, seniorCitizenAge: number): boolean {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= seniorCitizenAge;
}
