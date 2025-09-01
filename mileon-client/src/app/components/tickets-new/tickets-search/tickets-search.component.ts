import {
  TicketFilterOptions,
  TicketTabs,
} from './../../../types/filters/ticket/ticketFilterOptionsNew';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ROUTE_PATH } from '../../../constants/routerPath';
import { BaseService } from '../../../services/base.service';
import { SearchNormalizerService } from '../../../services/search-normalizer.service';
import { RouterService } from '../../../services/router.service';
import { AdvancedForm } from '../../../types/advanced-search/form-tab.model';
import { TicketNew } from '../../../types/ticket';
import { TicketsSearchFormService } from './tickets-search-form.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-tickets-search',
  imports: [SearchBarComponent],
  templateUrl: './tickets-search.component.html',
  styleUrls: ['./tickets-search.component.scss'],
})
export class TicketsSearchComponent implements OnInit {
  ticketsSearchForm!: FormGroup;

  advancedSearch: AdvancedForm = TicketTabs.TicketTabs;

  @Input()
  resultData: TicketNew[] | any = null;

  @Input()
  total: number = 0;

  @Input()
  hasResultsDropdown: boolean = false;

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<TicketFilterOptions>();
  @Input() searchData: TicketFilterOptions | null = null;
  searchText: string = '';

  filterHasValue: boolean = true;
  filterAdvanceHasValue: boolean = false;

  @Output() resetTable = new EventEmitter();

  private ticketsSearchFormService = inject(TicketsSearchFormService);
  private routerService = inject(RouterService);
  private _baseService = inject(BaseService);
  private searchNormalizer = inject(SearchNormalizerService);
  constructor() {
    this.ticketsSearchForm = this.ticketsSearchFormService.form;
  }

  ngOnInit(): void {}

  async sendFormValue(searchForm: FormGroup) {
    this.ticketsSearchFormService.searchForm = searchForm;
    const formValue = this.searchNormalizer.normalizeForSearch({ ...searchForm.value });
    if (searchForm.valid) {
      this.onSearch.emit(formValue);
    }
  }

  async goToSearchResults() {
    const url = this.routerService.getCurrentUrl();
    if (!url.includes(ROUTE_PATH.TicketsNew.Tickets))
      await this.routerService.navigateToUrl(
        [ROUTE_PATH.TicketsNew.Home, ROUTE_PATH.TicketsNew.Tickets],
        true
      );
  }
}
