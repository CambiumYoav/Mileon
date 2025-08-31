import { Component, OnInit } from '@angular/core';
import { InfrastructuresRoutingModule } from "./infrastructures-routing.module";
import { CommonModule } from '@angular/common';
import { SharedImports } from '../../shared/shared-modules';

@Component({
  selector: 'app-infrastructures',
  templateUrl: './infrastructures.component.html',
  styleUrls: ['./infrastructures.component.scss'],
  imports: [SharedImports, InfrastructuresRoutingModule],
})
export class InfrastructuresComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
