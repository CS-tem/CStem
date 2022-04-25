import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  subscription = new Subscription();
  institutes: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateInstitutesInfo();
  }

  updateInstitutesInfo() : void {
    this.subscription.add(
      this.qs.getInstitutes().subscribe(res => {
        console.log(res);
        this.institutes = res;
        console.log(res);
      })
    );
  }

}
