import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class MaterialTableService {

  constructor() { }

  insertDataIntoTable<T>(data: Array<T>, paginator: MatPaginator, sort: MatSort) {
    const dataSource = new MatTableDataSource(data);
    dataSource.paginator = paginator;
    dataSource.sort = sort;

    return dataSource;
  }

  defaultFilter(event: Event, dataSource: MatTableDataSource<any>) {
    if (!dataSource)
      return;

    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  clearDefaultFilter(dataSource: MatTableDataSource<any>) {
    if (dataSource) {
      dataSource.filter = null;
    }

    if (dataSource && dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  /**
   * Method for sorting nested objects
   * Found answers on these two links:
   * https://www.competa.com/blog/angular-material-deep-nested-objects-in-sortable-table/,
   * https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects
   */
  sortingDataAccessor(item, property) {
    if (property.includes('.')) {
      return property.split('.')
        .reduce((object, key) => object[key], item);
    }
    return item[property];
  }

  /**
   * Method for filtering nested objects
   * Found answer here https://stackoverflow.com/questions/49833315/angular-material-2-datasource-filter-with-nested-object
   */
  filterPredicateFunction = (data, filter: string) => {
    const accumulator = (currentTerm, key) => {
      return this.nestedFilterCheck(currentTerm, data, key);
    };
    const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();
    return dataStr.indexOf(transformedFilter) !== -1;
  }

  /**
   * Method for filtering nested objects
   */
  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

}
