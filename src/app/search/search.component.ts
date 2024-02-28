import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit{
  
  @Output() searchEvent: EventEmitter<string> = new EventEmitter();
  searchTerm: string = '';

  constructor(){}
  
  ngOnInit(): void {

    
  }

  search(): void {
    this.searchEvent.emit(this.searchTerm.trim().toLowerCase());
  }
}
