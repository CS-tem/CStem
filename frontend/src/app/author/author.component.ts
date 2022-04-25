import { Component, OnInit } from '@angular/core';
import { QueryserviceService } from '../queryservice.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  author_id = 0;
  author = {};
  subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute, private qs: QueryserviceService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.author_id = params['author_id'];
      this.updateAuthorInfo();
    });
  }

  updateAuthorInfo(): void {
    this.subscription.add(
      this.qs.getAuthor(this.author_id).subscribe(res => {
        this.author = res;
        console.log(res);
      })
    );
  }

}
