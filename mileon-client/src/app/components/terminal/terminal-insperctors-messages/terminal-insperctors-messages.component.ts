import { Component, inject, signal, effect, runInInjectionContext, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthorityService } from '../../../services/authority.service ';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { Column } from '../../../types/table';
import { TerminalService } from '../terminal.service';
import { User } from '../../../types/user';
import { TerminalFormComponent } from '../terminal-form/terminal-form.component';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { MatDialog } from '@angular/material/dialog';
import { MsofonForms } from '../../../types/terminal/terminal-form';
import { TerminalSearchService } from '../terminal-search/terminal-search.service';
import { FormGroup } from '@angular/forms';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { InspectorTask } from '../../../types/inspectorTask';
import { TerminalInspectorsFilterOptions } from '../../../types/filters/terminal/terminalInsperctorsFilterOptions';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { TaskPreviewComponent } from "../../shared/task-preview/task-preview.component";

@Component({
  selector: 'app-terminal-insperctors-messages',
  templateUrl: './terminal-insperctors-messages.component.html',
  styleUrls: ['./terminal-insperctors-messages.component.scss'],
  imports: [ButtonComponent, TaskPreviewComponent],
})
export class TerminalInsperctorsMessagesComponent {
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private terminalService = inject(TerminalService);
  private dialog = inject(MatDialog);
  private terminalSearchFormService = inject(TerminalSearchService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InspectorsMessages);
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  loader = signal<boolean>(false);
  currentAuthority = signal<string | null>(null);
  searchText = signal<string>('');
  searchData!: TerminalInspectorsFilterOptions;
  filter!: TerminalInspectorsFilterOptions;
  list = signal<User[]>([]);
  dialogData = signal<DynamicRow[]>([]);

  terminalForm: FormGroup = this.terminalSearchFormService.form;

  currentPage = signal<number>(1);
  pageSize = signal<number>(100);

  private authorityIdSig = toSignal<string | null>(this.authorityService.authorityId$, { initialValue: null });

  constructor() {
    effect(() => {
      const authorityId = this.authorityIdSig();
      if (!authorityId) return;

      this.currentAuthority.set(authorityId);

      const form = new MsofonForms();
      const dialogForm = form.InspectorsMessagesForm;
      const authorityField = dialogForm
        .flatMap((row) => row.row)
        .find((f) => f.name === 'authorityID');
      if (authorityField) authorityField.value = authorityId;

      this.dialogData.set(dialogForm);
      this.loadData(this.terminalForm.value);
    });
  }

  

  async loadData(filter?: any, append = false) {
    this.loader.set(true);
    const startTime = Date.now();
    try {
      filter = {
        ...filter,
        authorityID: this.currentAuthority()!,
        pageSize: this.pageSize(),
        currentPage: this.currentPage(),
        orderByField: 'taskCreationDate',
        order: 1,
      };

      const res = await this.terminalService.getInspectorsTasks(filter);
      if (res) {
        this.total.set(res.totalRecords);
        this.count.set(res.totalRecords);

        if (append) {
          this.data.update((current) => [...current, ...res.data]);
        } else {
          this.data.set(res.data);
        }
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }

    const elapsed = Date.now() - startTime;
    if (elapsed < 1000) await new Promise((r) => setTimeout(r, 1000 - elapsed));

    this.loader.set(false);
  }

  openDialog() {
    if (!TerminalFormComponent) return;

    const dialogRef = this.dialog.open(TerminalFormComponent, {
      autoFocus: false,
      data: {
        form: this.dialogData(),
        title: 'הוספת רשומה',
        buttonText: 'שלח',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.form) {
        this.createTask(result.form as InspectorTask);
      }
    });
  }

  async createTask(task: InspectorTask) {
    try {
      const res = await this.terminalService.createInspectorTask(task);
      if (res) {
        this.toaster.success(ErrorSuccessMessages.TASK_ADDED_SUCCESSFULY);
        this.currentPage.set(1);
        this.loadData(this.terminalForm.value);
        this.dialog.closeAll();
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  onScroll(event: any) {
    const element = event.target;

    const nearBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50;

    if (nearBottom && !this.loader() && this.data().length < this.total()) {
      this.currentPage.update((p) => p + 1);
      this.loadData(this.terminalForm.value, true);
    }
  }
}
