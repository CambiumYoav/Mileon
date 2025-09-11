import { 
  Component, 
  signal, 
  computed, 
  inject, 
  effect, 
  untracked,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';    
import { ModalMessages } from '../../../constants/modalMessages';
import { AuthorityService } from '../../../services/authority.service ';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { TicketBookAction } from '../../../types/enum/TicketBookActionEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { TicketBookFilterOptions } from '../../../types/filters/ticketBooks/ticketBookFilter';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { Column } from '../../../types/table';
import { Utils } from '../../../utils/utils';
import { TerminalService } from '../terminal.service';
import { TerminalExportComponent } from '../../../components/terminal/terminal-export/terminal-export.component';      
import { TerminalTicketBooksFormComponent } from '../../../components/terminal/terminal-ticket-books-form/terminal-ticket-books-form.component';
import { TerminalTicketBooksAssignedComponent } from '../../../components/terminal/terminal-ticket-books-assigned/terminal-ticket-books-assigned.component';
import { MsofonForms } from '../../../types/terminal/terminal-form';
import { TerminalSearchService } from '../../../components/terminal/terminal-search/terminal-search.service';
import { TicketBook } from '../../../types/ticketBook';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { CORE_IMPORTS } from '../../../shared/shared-modules';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AppModalComponent } from "../../shared/app-modal/app-modal.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TerminalSearchComponent } from "../terminal-search/terminal-search.component";
import { TerminalTableComponent } from "../terminal-table/terminal-table.component";

@Component({
  selector: 'app-terminal-ticket-books',
  templateUrl: './terminal-ticket-books.component.html',
  styleUrls: ['./terminal-ticket-books.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...CORE_IMPORTS,
    ButtonComponent,
    AppModalComponent,
    TerminalSearchComponent,
    TerminalTableComponent
],
})
export class TerminalTicketBooksComponent implements OnInit, OnDestroy {
  private terminalSearchFormService = inject(TerminalSearchService);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private dialog = inject(MatDialog);
  private terminalService = inject(TerminalService);
  private destroyRef = inject(DestroyRef);
  

  readonly title = TitlesEnum.TicketBooksTitle;
  readonly TicketBookAction = TicketBookAction;
  readonly Icons = ConstPath;
  readonly modalTitle = ModalMessages.CLOSE_TICKETBOOK;

  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  searchText = signal<string>('');
  searchData: TicketBookFilterOptions = new TicketBookFilterOptions();
  filter: TicketBookFilterOptions = new TicketBookFilterOptions();
  list = signal<TicketBook[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  selectedTicketBook = signal<TicketBook | null>(null);
  selectedBookID = signal<string | null>(null);
  isTicketBookSelected = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  assignedTickets = signal<any[]>([]);
  selectedBookNumber = signal<string>('');

  modalButtons = computed<ModalButton[]>(() => this.createModalButtons());
  terminalForm = computed<FormGroup>(() => this.terminalSearchFormService.searchForm);

  constructor() {
    this.terminalSearchFormService.setFormsOrderDirection(SortOrder.desc);
    
    effect(() => {
      const selectedBook = this.selectedTicketBook();
      if (selectedBook) {
        this.isTicketBookSelected.set(true);
      }
    });

    effect(() => {
      const authorityID = this.authorityService.authorityId();
      if (!authorityID) return;

      this.currentAuthority.set(authorityID);

      untracked(() => {
        this.loadData(this.terminalSearchFormService.form.value);
      });
    });
  }

  ngOnInit(): void {
    this.searchData = {
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
      pageSize: 100,
    };
    this.filter = {
      order: 1,
      searchText: '',
      currentPage: 1,
      pageSize: 100,
    };
  }

  ngOnDestroy(): void {
    this.resetSearchForm();
    this.terminalSearchFormService.reInitSortOrderFormsOnComponentDestroy();
  }

  // async loadData(filter: TicketBookFilterOptions) {
  //   this.loader = true;

  //   console.log(filter);
  //   const MIN_LOADER_TIME = 1500;
  //   const startTime = Date.now();
  //   try {
  //     this.searchText = filter.searchText ?? '';
  //     filter.pageSize = 10;
  //     filter.orderByField =
  //       filter.orderByField && filter.orderByField != ''
  //         ? filter.orderByField
  //         : 'CreationDate'; //set default to creation date
  //     console.log(this.searchText);
  //     filter.searchText = this.searchText;
  //     // filter.searchText = this.searchText;
  //     console.log(filter); //this value does not get updated in the input
  //     this.filter = { ...filter, authorityID: this.currentAuthority! };
  //     console.log(this.filter);
  //     const res = await this.terminalService.getTicketBooks(this.filter);
  //     if (res) {
  //       this.data = res.list;
  //       this.total = res.total; //overall server data
  //       this.count = res.count; //response current count
  //     }
  //   } catch (e) {
  //     this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
  //     console.error(e);
  //   }

  //   const elapsedTime = Date.now() - startTime;
  //   const remainingTime = MIN_LOADER_TIME - elapsedTime;

  //   if (remainingTime > 0) {
  //     //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
  //     await new Promise((resolve) => setTimeout(resolve, remainingTime));
  //   }
  //   this.loader = false;
  // }

  async loadData(filter: TicketBookFilterOptions) {
    this.loader.set(true);

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();

    try {
      const incomingSearch = filter.searchText ?? this.searchText();
      this.searchText.set(incomingSearch);

      const currentFilter = this.filter;
      const newFilter: TicketBookFilterOptions = {
        ...currentFilter,
        ...filter,
        searchText: incomingSearch,
        authorityID: this.currentAuthority()!,
      };

      newFilter.pageSize = 100;
      newFilter.orderByField =
        newFilter.orderByField && newFilter.orderByField !== ''
          ? newFilter.orderByField
          : 'CreationDate';

      this.filter = newFilter;

      const res = await this.terminalService.getTicketBooks(newFilter);
      if (res) {
        this.data.set(res.list);
        this.total.set(res.total);
        this.count.set(res.count);
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;
    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }

  async openDialogExport() {
    let dialogComponent = TerminalExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {});
      
      // Handle dialog result using afterClosed
      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          if (result) {
            this.exportData();
          }
        });
    }
  }
  async openDialog(action: TicketBookAction) {
    if (!TerminalTicketBooksFormComponent) return;

    let dialogData = this.getDialogFormData(action);
    dialogData.forEach((row: any) => {
      row.row.forEach((field: any) => {
        if (field.name === 'authorityID') {
          field.value = this.currentAuthority();
        }
        if (field.name === 'TicketBookIDs') {
          field.value = [this.selectedTicketBook()?.bookID];
        }
      });
    });
    const isTransfer = action === TicketBookAction.TRANSFER;

    // Update the form only if action is TRANSFER
    if (isTransfer) {
      dialogData = this.populateTransferData(dialogData);
    }

    const dialogRef = this.dialog.open(TerminalTicketBooksFormComponent, {
      autoFocus: false,
      data: {
        form: dialogData, // Pass the updated form
        title: Utils.getDialogTitle(action),
        isTransfer: isTransfer,
      },
    });

    // Handle dialog result using afterClosed
    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result && result.form) {
          this.handleTicketBookAction(result.form, action);
        }
      });
  }

  /**  Returns the appropriate form data based on action */
  private getDialogFormData(action: TicketBookAction): any {
    switch (action) {
      case TicketBookAction.ADD:
        return new MsofonForms().TicketBookAddForm;
      case TicketBookAction.TRANSFER:
        return new MsofonForms().TicketBookTransferForm;
      default:
        return this.dialogData();
    }
  }

  /** Method to handle selected ticket book updates */
  updateSelectedTicketBook(ticketBook: TicketBook) {
    this.selectedTicketBook.set(ticketBook);
  }

  private populateTransferData(formData: any): any {
    const selectedBook = this.selectedTicketBook();
    if (!selectedBook) return formData;

    const fieldsToUpdate = [
      'inspectorName',
      'bookID',
      'bookNumber',
      'ticketTypeID',
    ];

    return formData.map((dynamicRow: any) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field: any) => ({
        ...field,
        value:
          fieldsToUpdate.includes(field.name) &&
          (selectedBook as any)[field.name]
            ? (selectedBook as any)[field.name]
            : field.value,
      })),
    }));
  }

  async handleTicketBookAction(ticketBookData: any, action: TicketBookAction) {
    try {
      const updatedObj = {
        ...ticketBookData,
        authorityID: this.currentAuthority(),
      };
      const result = await this.terminalService.updateTicketBookByAction(
        updatedObj,
        action
      );

      if (result) {
        this.resetSearchForm();

        this.dialog.closeAll();
        if (action == TicketBookAction.ADD) {
          if (this.addBookResultValidate(result)) {
            this.toaster.success(
              ErrorSuccessMessages.TICKET_BOOK__ADDED_SUCCESSFULY
            );
            this.loadData(this.terminalSearchFormService.form.value);
          } else {
            this.toaster.error(this.addBookResultToastText(result));
          }
        }
        if (action == TicketBookAction.TRANSFER) {
          this.toaster.success(
            ErrorSuccessMessages.TICKET_BOOKED_ASSIGNED_SUCCESSFULY
          );
          this.loadData(this.terminalSearchFormService.form.value);
        }
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }
  }
  addBookResultValidate(result: any) {
    return (
      result &&
      result.newTicketBooks &&
      Array.isArray(result.newTicketBooks) &&
      result.newTicketBooks.length > 0
    );
  }
  addBookResultToastText(result: any) {
    if (this.addBookResultValidate(result)) {
      return ErrorSuccessMessages.TICKET_BOOK__ADDED_SUCCESSFULY;
    } else {
      if (
        result &&
        result.wrongTicketNumbers &&
        Array.isArray(result.wrongTicketNumbers) &&
        result.wrongTicketNumbers.length > 0
      ) {
        return ErrorSuccessMessages.TICKET_BOOK__ERROR_TICKET_NUMBER;
      } else {
        return ErrorSuccessMessages.TICKET_BOOK__NOT_ADDED_SUCCESSFULY;
      }
    }
  }
  async exportData(isAssigned?: boolean) {
    try {
      const fileBlob = await this.terminalService.exportTicketBooks(
        this.filter,
        this.selectedBookID()!,
        isAssigned
      );
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const fileName = isAssigned
        ? `${this.selectedBookNumber()}_פנקס_${currentDate}.xlsx`
        : `פנקסים${currentDate}.xlsx`;
      const file = new File([fileBlob], fileName, {
        type: FileTypeExtension.XLSX,
      });
      Utils.saveFile(file);
    } catch (error) {
      console.error('Error while exporting data:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  openModal() {
    this.isModalOpen.set(true);
  }
  closeModal() {
    this.isModalOpen.set(false);
  }

  createModalButtons(): ModalButton[] {
    return [
      { label: 'ביטול', action: () => this.closeModal(),
        buttonClass: 'outline-btn button-base',
       },
      {
        label: 'אישור',
        action: () => this.closeTicketBook(),
        buttonClass: 'primary-btn btn-fill ',
      },
    ];
  }

  openAssignedTickets(bookNumber: string) {
    let dialogComponent = TerminalTicketBooksAssignedComponent;

    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          ticketBookId: this.selectedBookID(),
          assignedTickets: this.assignedTickets(),
          bookNumber: bookNumber,
        },
      });

      // Handle dialog result using afterClosed
      dialogRef.afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
          if (result) {
            this.exportData(true);
          }
        });
    }
  }

  async getAssignedTickets(event: any) {
    // Update selected ticket book
    this.updateSelectedTicketBook(event);
    
    this.selectedBookID.set(event.bookID);
    this.selectedBookNumber.set(event.bookNumber);
    if (this.selectedBookID()) {
      try {
        const res = await this.terminalService.getAssignedTickets(
          this.selectedBookID()!
        );

        this.assignedTickets.set(res);

        this.openAssignedTickets(event.bookNumber);
      } catch (e) {
        console.error(e);
        this.toaster.error(ErrorSuccessMessages.TICKET_BOOKED_NOT_ASSIGNED);
      }
    }
  }
  async closeTicketBook() {
    try {
      const selectedBook = this.selectedTicketBook();
      if (!selectedBook) return;
      
      const res = await this.terminalService.deleteTicketBook(
        selectedBook.bookID
      );
      if (res) {
        this.resetSearchForm();
        this.loadData(this.terminalSearchFormService.form.value);
        this.toaster.success(
          ErrorSuccessMessages.TICKET_BOOKED_CLOSED_SUCCESSFULY
        );
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  resetSearchForm() {
    this.terminalSearchFormService.clearForm();
    this.terminalSearchFormService.setFormsOrderDirection(SortOrder.desc);
    this.terminalSearchFormService.setFormsPage();
  }

  isValidDateString(input: string): boolean {
    const separators = ['/', '-', '.'];
    for (const sep of separators) {
      const parts = input.split(sep);
      if (parts.length !== 2 && parts.length !== 3) continue;

      let day: number, month: number, year: number;

      if (parts.length === 3) {
        if (sep === '-' && input.match(/^\d{4}-\d{2}-\d{2}$/)) {
          [year, month, day] = parts.map(Number);
        } else {
          [day, month, year] = parts.map(Number);
        }
      } else if (parts.length === 2) {
        [day, month] = parts.map(Number);
        year = new Date().getFullYear();
      } else {
        continue;
      }

      const date = new Date(year, month - 1, day);
      if (
        !isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() + 1 === month &&
        date.getFullYear() === year
      ) {
        return true;
      }
    }

    return false;
  }

  parseDateString(input: string): string | null {
    const match = input.match(/^(\d{1,2})[./-](\d{1,2})(?:[./-](\d{4}))?$/);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();

    if (
      isNaN(day) ||
      isNaN(month) ||
      isNaN(year) ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    if (
      date.getDate() !== day ||
      date.getMonth() !== month - 1 ||
      date.getFullYear() !== year
    ) {
      return null;
    }

    return this.getISODateWithoutTimezone(day, month, year);
  }

  getISODateWithoutTimezone(day: number, month: number, year: number): string {
    const isoString = new Date(Date.UTC(year, month - 1, day)).toISOString();
    return isoString.split('T')[0]; // "2025-07-09"
  }
}
