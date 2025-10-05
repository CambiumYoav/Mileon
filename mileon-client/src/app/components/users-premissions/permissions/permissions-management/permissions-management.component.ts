import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../../constants/const_path';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { PremissionsTabsComponent } from "../premissions-tabs/premissions-tabs.component";
import { RouterOutlet } from "@angular/router";

interface AccordionItem {
  title: string;
  content: string;
}

@Component({
  selector: 'app-permissions-management',
  templateUrl: './permissions-management.component.html',
  styleUrls: ['./permissions-management.component.scss'],
  standalone: true,
  imports: [CommonModule, PremissionsTabsComponent, RouterOutlet],
})
export class PermissionsManagementComponent implements OnInit {
  title = signal<string>(TitlesEnum.GroupsPermissionsTitle);
  Icons = ConstPath;
  
  items = signal<AccordionItem[]>([
    { title: 'Item 1', content: 'Content for item 1' },
    { title: 'Item 2', content: 'Content for item 2' },
    { title: 'Item 3', content: 'Content for item 3' },
  ]);

  expanded = signal<boolean[]>([]);

  allExpanded = computed(() => this.expanded().every(exp => exp));
  allCollapsed = computed(() => this.expanded().every(exp => !exp));
  hasItems = computed(() => this.items().length > 0);

  constructor() {
    // Initialize expanded state based on items length
    this.initializeExpandedState();
  }

  ngOnInit(): void {
    // Component initialization logic can go here
  }

  private initializeExpandedState(): void {
    this.expanded.set(Array(this.items().length).fill(false));
  }

  toggleItem(index: number): void {
    const currentExpanded = this.expanded();
    const newExpanded = [...currentExpanded];
    newExpanded[index] = !newExpanded[index];
    this.expanded.set(newExpanded);
  }

  toggleAll(expand: boolean): void {
    this.expanded.set(Array(this.items().length).fill(expand));
  }

  addItem(item: AccordionItem): void {
    this.items.update(items => [...items, item]);
    this.expanded.update(expanded => [...expanded, false]);
  }

  removeItem(index: number): void {
    this.items.update(items => items.filter((_, i) => i !== index));
    this.expanded.update(expanded => expanded.filter((_, i) => i !== index));
  }
}
