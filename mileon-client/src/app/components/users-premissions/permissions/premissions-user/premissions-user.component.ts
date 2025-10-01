import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PremissionsManagementTableComponent } from "../premissions-management-table/premissions-management-table.component";

@Component({
  selector: 'app-premissions-user',
  templateUrl: './premissions-user.component.html',
  styleUrls: ['./premissions-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PremissionsManagementTableComponent],
})
export class PremissionsUserComponent {
  // Signals for mock data
  mockData = signal([
    {
      category: 'משתמשים',
      modules: [
        {
          moduleId: 1,
          name: 'UserNotes',
          description: 'ניהול הערות משתמש',
          route: 1,
          canRead: true,
          canWrite: true,
          childModules: [],
        },
      ],
    },
    {
      category: 'טבלאות תשתית',
      modules: [
        {
          moduleId: 94,
          name: 'GetInfrasrtuctureTables',
          description: 'משיכת טבלאות תשתית',
          route: 94,
          canRead: true,
          canWrite: true,
          childModules: [
            {
              moduleId: 95,
              name: 'GetInfrasrtuctureTablesExport',
              description: 'ייצוא טבלאות תשתית',
              route: 95,
              canRead: true,
              canWrite: true,
              childModules: [],
            },
            {
              moduleId: 96,
              name: 'GetInfrasrtuctureTablesImport',
              description: 'ייבוא טבלאות תשתית',
              route: 96,
              canRead: true,
              canWrite: true,
              childModules: [],
            },
            {
              moduleId: 97,
              name: 'PostInfrasrtuctureTablesUpdate',
              description: 'עדכון טבלאות תשתית',
              route: 97,
              canRead: true,
              canWrite: true,
              childModules: [],
            },
          ],
        },
      ],
    },
  ]);

  // Computed signals
  hasData = computed(() => this.mockData().length > 0);
  categories = computed(() => this.mockData());

  trackByFn(index: number, item: any): any {
    return item.moduleId || index; // Use a unique identifier for modules
  }

  getCategoryModules(category: any) {
    return [category]; // Return the category as an array for the table component
  }
}
