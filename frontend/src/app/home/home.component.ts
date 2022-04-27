import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dataSource: any;
  displayedColumns: any;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns = ['route', 'desc'];
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        'route': '/',
        'desc': 'Homepage',
      },
      {
        'route': '/institutes',
        'desc': 'All institutes',
      },
      {
        'route': '/institute/<institute_id>',
        'desc': 'A specific institute',
      },
      {
        'route': '/authors',
        'desc': 'All authors',
      },
      {
        'route': '/author/<author_id>',
        'desc': 'A specific author',
      },
      {
        'route': '/articles',
        'desc': 'All articles',
      },
      {
        'route': '/article/<article_id>',
        'desc': 'A specific article',
      },
      {
        'route': '/topics',
        'desc': 'All topics',
      },
      {
        'route': '/topic/<topic_id>',
        'desc': 'A specific topic',
      },
      {
        'route': '/venues',
        'desc': 'All venues',
      },
      {
        'route': '/venue/<venue_id>',
        'desc': 'A specific venue',
      },
    ];
  }

}
