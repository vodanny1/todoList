import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Item } from './item/item';
import { HttpClient } from '@angular/common/http';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  todoList: Item[] = [];
  completedList: Item[] = [];

  todoForm: FormGroup;
  listForm: FormGroup;
  style = 'text-decoration: line-through';

  isCompleteMode = true;

  constructor(private http: HttpClient, private itemsService: ItemsService) {}

  ngOnInit(): void {
    this.todoForm = new FormGroup({
      todo: new FormControl(null, Validators.required),
    });

    this.listForm = new FormGroup({
      item: new FormControl(null),
    });

    this.itemsService.fetchItems().subscribe((items) => {
      this.todoList = items;
    });

    this.itemsService.fetchCompletedItems().subscribe((items) => {
      this.completedList = items;
    });
  }

  onAddToList() {
    let item = new Item('', this.todoForm.get('todo').value, false, '');

    this.itemsService.addItems(item).subscribe((data: { name: string }) => {
      this.todoList.push({ ...item, id: data.name });
    });

    this.todoForm.reset();
  }

  onFetchItem() {
    this.itemsService.fetchItems();
  }

  onComplete() {
    let i = 0;
    while (i < this.todoList.length) {
      if (this.todoList[i].checkedOff === true) {
        this.todoList[i].style = this.style;
      } else {
        i++;
      }
    }
  }

  onSubmit() {
    let i = 0;
    while (i < this.todoList.length) {
      if (this.todoList[i].checkedOff) {
        if (this.isCompleteMode) {
          //  To mark them as completed
          this.itemsService.completeItems(this.todoList[i]).subscribe(() => {});
          this.itemsService
            .deleteItems(this.todoList[i].id)
            .subscribe(() => {});
          this.completedList.push(this.todoList[i]);
          this.todoList.splice(i, 1);
          i++;
        } else {
          // To delete the items
          this.itemsService
            .deleteItems(this.todoList[i].id)
            .subscribe(() => {});
          this.todoList.splice(i, 1);
        }
      } else {
        i++;
      }
    }
  }

  onChange(item: Item) {
    item.checkedOff = !item.checkedOff;
    if (item.style === '') {
      item.style = this.style;
    } else {
      item.style = '';
    }
  }

  onSwitchMode() {
    this.isCompleteMode = !this.isCompleteMode;
  }
}
