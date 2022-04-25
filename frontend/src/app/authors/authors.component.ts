import { Component, OnInit } from '@angular/core';
import { Author } from '../author';
@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  
  author: Author = {
    id: 1,
    name: 'Umesh Bellur'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
