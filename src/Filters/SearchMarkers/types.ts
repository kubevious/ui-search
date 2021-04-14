export type List = {
    payload: string;
    shownValue: string;
};

export interface MarkerItem {
    name: string;
    shape: string;
    color: string;
}

export interface MarkersList extends List {
    values: MarkerItem[];
}
