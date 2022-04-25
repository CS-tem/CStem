import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  subscription = new Subscription();
  authors: any = [{}];

  constructor(private qs : QueryserviceService) { }

  ngOnInit(): void {
    this.updateAuthorsInfo();
  }

  updateAuthorsInfo() : void {
    this.subscription.add(
      this.qs.getAuthors().subscribe(res => {
        this.authors = res;
        console.log(res);
      })
    );
  }

}
