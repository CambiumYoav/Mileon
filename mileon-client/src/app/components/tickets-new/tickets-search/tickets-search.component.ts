import { TicketTabs } from './../../../types/filters/ticket/ticketFilterOptionsNew';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TicketFilterOptions } from 'src/app/types/filters/ticket/ticketFilterOptions';
import { TicketsSearchFormService } from './tickets-search-form.service';
import { AdvancedForm } from 'src/app/types/advanced-search/form-tab.model';
import { TicketNew } from 'src/app/types/ticket';
import { ROUTE_PATH } from 'src/app/constants/routerPath';
import { RouterService } from '../../shared/router/router.service';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-tickets-search',
  templateUrl: './tickets-search.component.html',
  styleUrls: ['./tickets-search.component.scss'],
})
export class TicketsSearchComponent implements OnInit {
  ticketsSearchForm: FormGroup = this.ticketsSearchFormService.form;

  advancedSearch: AdvancedForm = TicketTabs.TicketTabs;

  @Input()
  resultData: TicketNew[];

  @Input()
  total: number;

  @Input()
  hasResultsDropdown: boolean = false;

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<TicketFilterOptions>();
  @Input() searchData: TicketFilterOptions;
  searchText: string;

  filterHasValue: boolean = true;
  filterAdvanceHasValue: boolean = false;

  @Output() resetTable = new EventEmitter();

  constructor(
    private ticketsSearchFormService: TicketsSearchFormService,
    private searchFormService: SearchFormService,
    private routerService: RouterService,
    private _baseService: BaseService
  ) {}

  ngOnInit(): void {
    // const searchForm = this.ticketsSearchFormService.searchForm;
    // if (searchForm) {
    //   this.searchText = searchForm.get(['searchText'])?.value;
    //   this.sendFormValue(searchForm);
    // }
  }

  async sendFormValue(searchForm: FormGroup) {
    // NOTE 🤢 ugly due to lack of time
    this.ticketsSearchFormService.searchForm = searchForm;
    const formValue = searchForm.value;
    for (let key of Object.keys(formValue)) {
      if (formValue[key] && typeof formValue[key] === 'object') {
        for (let k of Object.keys(formValue[key])) {
          if (k.toLowerCase().includes('time') && formValue[key][k]) {
            formValue[key][k] = this._baseService.convertTimeToDateTime(
              formValue[key][k]
            );
          }
        }
      }
      if (key.toLowerCase().includes('date') && formValue[key]) {
        this._baseService.setTimeToMidday(formValue[key]);
      }
    }
    if (searchForm.valid) {
      this.onSearch.emit(searchForm.value);
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
