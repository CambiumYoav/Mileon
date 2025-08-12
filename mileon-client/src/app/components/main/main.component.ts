import { HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { BaseComponents, SharedComponents, SharedImports } from '../../shared/shared-modules';

@Component({
  selector: 'app-main',
  imports: [SharedImports, SharedComponents],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  private baseService = inject(BaseService);
  constructor() {
    this.baseService.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `bearer ${sessionStorage['token']}`,
      }),
    };
  }
  ngOnInit(): void {}
}
