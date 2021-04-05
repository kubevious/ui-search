import { Search } from "."
import { FilterType } from "./types"

export const keyCheck = (el: FilterType, key: string): boolean => {
    return typeof el !== "string" && el.key === key
}

export const fetchSearchResult = () => {
    const searchService = new Search([])
    searchService.fetchSearchResults()
}

export const isEmptyArray = (arr: any[]): boolean => { // Later will be corrected on other type
    return !arr || arr.length === 0;
}
