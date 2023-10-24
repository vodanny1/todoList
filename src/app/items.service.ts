import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from './item/item';

import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  constructor(private http: HttpClient) {}

  addItems(item: Item) {
    // this.http
    //   .post(
    //     'https://angular-todo-a93ce-default-rtdb.firebaseio.com/items.json',
    //     item
    //   )
    //   .subscribe((responseData) => {
    //     console.log(responseData);
    //   });

    return this.http.post(
      'https://angular-todo-a93ce-default-rtdb.firebaseio.com/items.json',
      item
    );
  }

  completeItems(item: Item) {
    return this.http.post(
      'https://angular-todo-a93ce-default-rtdb.firebaseio.com/completeditems.json',
      item
    );
  }

  fetchItems() {
    return this.http
      .get('https://angular-todo-a93ce-default-rtdb.firebaseio.com/items.json')
      .pipe(
        map((responseData) => {
          const itemArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              itemArray.push({ ...responseData[key], id: key });
            }
          }
          console.log(itemArray);
          return itemArray;
        })
      );
  }

  fetchCompletedItems() {
    return this.http
      .get(
        'https://angular-todo-a93ce-default-rtdb.firebaseio.com/completeditems.json'
      )
      .pipe(
        map((responseData) => {
          const itemArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              itemArray.push({ ...responseData[key], id: key });
            }
          }
          return itemArray;
        })
      );
  }

  deleteItems(key: string) {
    return this.http.delete(
      'https://angular-todo-a93ce-default-rtdb.firebaseio.com/items/' +
        key +
        '.json'
    );
  }
}
