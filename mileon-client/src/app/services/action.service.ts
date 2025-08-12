import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionButtons } from '../constants/action_buttons';
import { Buttons } from '../constants/buttonEnum';
import { ConstPath } from '../constants/const_path';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  Icons = ConstPath;

  buttons: ActionButtons = {
    Payment: {
      text: Buttons.Payment,
      imgSrc: this.Icons.WALLET,

      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    SendToPhone: {
      text: Buttons.SendToPhone,
      imgSrc: this.Icons.PHONE,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    SendEmail: {
      text: Buttons.SendEmail,
      imgSrc: this.Icons.SMS,

      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    PrintToPDF: {
      text: Buttons.PrintToPDF,
      imgSrc: this.Icons.PRINTER,

      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    NewRequest: {
      text: Buttons.NewRequest,
      imgSrc: this.Icons.ADD_CIRCLE,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: null,
    },
    AddReminder: {
      text: Buttons.AddReminder,
      imgSrc: this.Icons.REMINDER,
      function: () => {
        this.showNotes();
      },
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    Create: {
      text: Buttons.Create,
      imgSrc: this.Icons.ADD_CIRCLE,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    ClearData: {
      text: Buttons.ClearData,
      imgSrc: this.Icons.TRASH,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    ExportTestFile: {
      text: Buttons.ExportTestFile,
      imgSrc: this.Icons.EXCEL_DOWN,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    ExportMana: {
      text: Buttons.ExportMana,
      imgSrc: this.Icons.ADD_CIRCLE,
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    ViewMana: {
      text: Buttons.ViewMana,
      imgSrc: '',
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    RestoreMana: {
      text: Buttons.RestoreMana,
      imgSrc: '',
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    PostApprove: {
      text: Buttons.PostApprove,
      imgSrc: '',
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
    CopyReport: {
      text: Buttons.CopyReport,
      imgSrc: '',
      cssClass: '',
      tooltipText: '',
      tooltipClass: '',
      disabled: true,
    },
  };

  private noteSignal = signal<any>({});
  public clickedNote = this.noteSignal.asReadonly();

  constructor() {}

  setNote(note: any) {
    this.noteSignal.set(note);
  }

  showNotes() {
    this.setNote(true);
  }
}
