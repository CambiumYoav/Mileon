export enum ParkingPermitStatusEnum {
  RequestMade = 1,        // נקלט
  AwaitingFiles = 2,      // ממתין להמצאת מסמכים
  AwaitingPayment = 3,    // ממתין לתשלום
  Active = 4,             // אושר/פעיל
  Denied = 5,             // לא אושר/נדחה
  UnActive = 6,           // לא פעיל/בוטל
  Approved = 7            // מאושר-מצב ביניים לבדיקה האם צריך לשלם
}
