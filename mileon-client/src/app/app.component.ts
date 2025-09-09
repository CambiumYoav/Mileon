import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConstPath } from './constants/const_path';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonComponent } from "./components/shared/base/button/button.component";
import { InfrastructureImportComponent } from './components/infrastractures/infrastructure-import/infrastructure-import.component';
import { InfrastructureFormComponent } from './components/infrastractures/infrastructure-form/infrastructure-form.component';
import { InfrastructureForms } from './types/infrastructure/infrastructure-table.model'; 
import { InfrastructureTableAction } from './types/enum/infrastructureTablesEnum'; 
import { MatDialog } from '@angular/material/dialog';
import { UploadedFile } from './types/uploadedFile';
import { AppModalComponent } from "./components/shared/app-modal/app-modal.component";
import { ConfirmationModalComponent } from "./components/shared/confirmation-modal/confirmation-modal.component";
import { ModalButton } from './constants/modalButtons';
import { TabsGroupComponent } from "./components/shared/tabs-group/tabs-group.component";
import { TabAttributes } from './types/filters/tabsGroup';
import { ManagementMain } from './types/management/management.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, ButtonComponent, AppModalComponent, ConfirmationModalComponent, TabsGroupComponent],
})
export class AppComponent {
  @ViewChild('innerScrollContainer') innerScrollContainer!: ElementRef;

  tabs: TabAttributes[] = ManagementMain.Tabs;
  currentActive: string = this.tabs[0].text;
  currentActiveTabID = this.tabs[0].id;

modalButtons: ModalButton[] = [
  {
    label: 'סגור',
    action: () => this.openSaveModal(),
    buttonClass: 'primary-btn',
  },
];

  constructor(private router: Router, private dialog: MatDialog) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Reset the main document scroll
        window.scrollTo(0, 0);

        // Reset the inner scroll container (if it exists)
        if (this.innerScrollContainer) {
          this.innerScrollContainer.nativeElement.scrollTop = 0;
        }
      }
    });
  }
  title = 'mileon-client';
  isSaveModalOpen = false;
  filesToUpload: UploadedFile[] = [];
  dialogData: any;


  openSaveModal() {
    this.isSaveModalOpen = true;
  }

  isConfirmationModalOpen = false;
  
  openConfirmationModal() {
    this.isConfirmationModalOpen = true;
  }
  

  closeModal() {
    this.isSaveModalOpen = false;
  }

  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          isSignsImport: false,
          description: 'קוד, שם אזור,הגדרת אזור',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.uploadedFiles) {
          this.filesToUpload = result.uploadedFiles;
        } else {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }


  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData;
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureTypeForm;
        // dialogData = form.InfrastructureBusinessForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        data: { form: dialogData, title: 'עריכת רשומה', isEdit: isEdit, isSigns: false },
      });
      const dialogInstance = dialogRef.componentInstance;
      dialogInstance.dataSubject.subscribe((result: any) => {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        // this.handleInsertOrUpdate(result.form, action);
      });
    }
  }

  changeTab(tab: TabAttributes) {
    // Update active tab properties
    this.currentActive = tab.text;
    this.currentActiveTabID = tab.id!;
  }
}
