import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorityService } from '../../../../services/authority.service ';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { InfrastructuresTicketsStagesComponent } from "../infrastructures-tickets-stages/infrastructures-tickets-stages.component";
import { InfrastructuresTicketsStatusesComponent } from "../infrastructures-tickets-statuses/infrastructures-tickets-statuses.component";

@Component({
  selector: 'app-infrastructures-tickets-stages-statuses',
  templateUrl: './infrastructures-tickets-stages-statuses.component.html',
  styleUrls: ['./infrastructures-tickets-stages-statuses.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresTicketsStagesComponent, 
    InfrastructuresTicketsStatusesComponent
  ],
})
export class InfrastructuresTicketsStagesStatusesComponent implements OnInit {
  private authorityService = inject(AuthorityService);

  title = signal<string>(TitlesEnum.InfrastructureTicketsStagesStatusesTitle);

  constructor() {}

  ngOnInit(): void {
    this.authorityService.setMunicipalsToNationalAdmin();
  }
}
