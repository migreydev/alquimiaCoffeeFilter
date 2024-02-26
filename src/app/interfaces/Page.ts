import { Pageable } from "./Pageable";
import { Recipe } from "./Recipe";
import { Sort } from "./Sort";

export interface Page {
    content:          Recipe[];
    pageable:         Pageable;
    totalPages:       number;
    totalElements:    number;
    last:             boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}


