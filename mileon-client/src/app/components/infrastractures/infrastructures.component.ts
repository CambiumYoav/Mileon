import { Component, OnInit } from '@angular/core';
import { InfrastructuresRoutingModule } from "./infrastructures-routing.module";

@Component({
  selector: 'app-infrastructures',
  templateUrl: './infrastructures.component.html',
  styleUrls: ['./infrastructures.component.scss'], 
  imports: [InfrastructuresRoutingModule],
})
export class InfrastructuresComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
