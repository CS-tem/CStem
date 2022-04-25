import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  subscription = new Subscription();
  institute = {};
  institute_id = 0;

  constructor(private activatedRoute : ActivatedRoute, private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.institute_id = params['institute_id'];
      this.updateInstituteInfo();
    });
  }

  updateInstituteInfo(): void {
    this.subscription.add(
      this.qs.getInstitute(this.institute_id).subscribe(res => {
        this.institute = res;
        console.log(res);
      })
    );
  }

}
