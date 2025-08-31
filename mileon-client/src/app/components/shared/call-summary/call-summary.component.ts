import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { PermissionRoutes } from '../../../constants/permissions.enum';
import { PermissionService } from '../../../services/permission.service';
import { TicketService } from '../../../services/ticket.service';
import { UserService } from '../../../services/user.service';
import { CallSummary } from '../../../types/callSummary';
import { ReservedSummary } from '../../../types/reservedSummary';
import { Patterns } from '../../../validators/validationPatterns';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-call-summary',
  templateUrl: './call-summary.component.html',
  styleUrls: ['./call-summary.component.scss'],
  imports:[CommonModule,MaterialModule,ReactiveFormsModule,FormsModule]
})
export class CallSummaryComponent implements OnInit {
  @Input() isList: boolean = false;
  @Input() phone?: string;
  @Input() ticketId: string = '';
  @Input() callSummariesList!: CallSummary[];

  @Output() close = new EventEmitter();
  @Output() addCallSummary = new EventEmitter();

  editSvg = ConstPath.EDIT;
  loaderGif = ConstPath.LOADER;
  date: Date = new Date();
  text: string = '';
  reserverdes!: ReservedSummary[];
  reserverdesToShow!: ReservedSummary[];
  showErrorText: boolean = false;
  showErrorPhone: boolean = false;
  isLoading: boolean = false;
  isPhoneValid: boolean = true;
  isValid: boolean = true;
  currentCallSummary!: CallSummary;
  callSummarySaveButton: boolean = false;

  private ticketService = inject(TicketService);
  private userService = inject(UserService);
  private permissionsService = inject(PermissionService);
  
  constructor() {
    this.callSummarySaveButton = this.permissionsService.checkUserPermission(
      PermissionRoutes.CALL_SUMMARY
    );
  }

  ngOnInit(): void {
    this.getReserves();
  }

  callSummaryDetails(callSummary: CallSummary) {
    this.currentCallSummary = callSummary;
    if (callSummary?.reservedes) {
      const reservedTemp: ReservedSummary[] = [];
      this.reserverdes?.forEach((r) => {
        if (
          callSummary.reservedes?.find(
            (i) => i.reservedSummaryID === r.reservedSummaryID
          )
        ) {
          reservedTemp.push(r);
        }
      });
      this.reserverdesToShow = reservedTemp;
      this.reserverdesToShow?.forEach((r) => (r.isChoose = true));
    } else {
      this.reserverdesToShow = [];
    }
    this.text = callSummary?.content ?? '';
  }

  getReserves() {
    this.ticketService.getReserves().subscribe({
      next: (res) => {
        this.reserverdes = res;
        this.reserverdesToShow = this.reserverdes;
        if (this.isList) {
          this.callSummaryDetails(this.callSummariesList[0]);
        }
      },
    });
  }

  closeCallSummary() {
    this.close.emit();
  }

  validatePhone() {
    if (this.phone) {
      const phonePattern: RegExp = new RegExp(Patterns.PHONE_NUMBER);
      this.isPhoneValid = phonePattern.test(this.phone);
    }
    if (!this.phone) {
      this.isPhoneValid = false;
    }
  }

  save() {
    this.isValid = true;
    if (
      this.text.length < 2 &&
      this.reserverdesToShow?.filter((r) => r.isChoose).length === 0
    ) {
      this.showErrorText = true;
      this.isValid = false;
    }
    if (!this.isPhoneValid || !this.phone) {
      this.validatePhone();
      this.isValid = false;
    }

    if (!this.isValid) return;

    this.isList = true;
    this.isLoading = true;
    const callSummary: CallSummary = {
      createdDate: this.date,
      phoneNumber: this.phone,
      content: this.text,
      reservedes: this.reserverdesToShow?.filter(({ isChoose }) => isChoose),
      ticketIDs: [this.ticketId],
    };
    this.ticketService.addCallSummary(callSummary).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.addCallSummary.emit(res);
        this.callSummaryDetails(res);
        this.userService.userActivityData.callSummaryCount++;
      },
    });
  }

  addNew() {
    this.isList = false;
    this.currentCallSummary = {};
    this.reserverdes?.forEach((r) => (r.isChoose = false));
    this.text = '';
    this.reserverdesToShow = this.reserverdes;
  }
}
