// filter.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })

export class FilterPipe implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param list array of employee objects
   * @param search search string
   * @returns list of employe filtered by search text or []
   */

  transform(list: Array<any>, search:string) {
      if(list && search){
        search = search.toLowerCase();
        return list.filter(
            (e)=>
                e.firstName.toLowerCase().indexOf(search) > -1 ||
                e.lastName.toLowerCase().indexOf(search) > -1
        )
      }
      return list;  
  }
}