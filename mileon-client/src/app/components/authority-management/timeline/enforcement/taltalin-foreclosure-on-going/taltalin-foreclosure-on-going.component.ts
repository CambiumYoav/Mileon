import { Component, OnInit } from '@angular/core';
import { ConfigTableComponent } from "../../config-table/config-table.component";
// import { EarlyNoticeForm } from 'src/app/types/timeline-settings/timeline-form.model';

@Component({
  selector: 'app-taltalin-foreclosure-on-going',
  templateUrl: './taltalin-foreclosure-on-going.component.html',
  styleUrls: ['./taltalin-foreclosure-on-going.component.scss'],
  imports: [ConfigTableComponent],
})
export class TaltalinForeclosureOnGoingComponent implements OnInit {
  constructor() {}

  inputFields = {
    Parking: [],
    General: [],
    Administrative: [],
  };

  ngOnInit(): void {}
}
