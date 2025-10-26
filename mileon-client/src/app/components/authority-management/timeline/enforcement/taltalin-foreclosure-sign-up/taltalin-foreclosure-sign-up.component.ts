import { Component, OnInit } from '@angular/core';
import {
  EarlyNoticeForm,
  TaltalinForeclosureSignUpForm,
} from '../../../../../types/timeline-settings/timeline-form.model';
import { ConfigTableComponent } from "../../config-table/config-table.component";

@Component({
  selector: 'app-taltalin-foreclosure-sign-up',
  templateUrl: './taltalin-foreclosure-sign-up.component.html',
  styleUrls: ['./taltalin-foreclosure-sign-up.component.scss'],
  imports: [ConfigTableComponent],
})
export class TaltalinForeclosureSignUpComponent implements OnInit {
  constructor() {}

  inputFields = TaltalinForeclosureSignUpForm;

  ngOnInit(): void {}
}
