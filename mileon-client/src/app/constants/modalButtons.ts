export interface ModalButton {
  label: string;
  action: () => void;
  buttonClass?: string;
}

export type ModalButtons = {
  [name in ModalButtonNames]: ModalButton;
};

export type ModalButtonNames = "אישור" | "ביטול" ;
