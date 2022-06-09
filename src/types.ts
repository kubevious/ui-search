import { FilterComponentProps } from './Filters/types';

export interface FilterMetaData {
    searchId: string;
    payload: string;
    title: string;
    component?: React.ComponentType<FilterComponentProps>;
    data?: FilterData;
    isEditable?: boolean;
}

export interface FilterData {
    isEnabled: boolean;
    criteria: FilterCriteria[];
}

export interface FilterCriteria {
    caption: string;
    values: any;
}


/*******/

export interface SearchData {
    components: Record<string, FilterComponentData>;
}

export interface FilterComponentData {
    searchId: string;
    defaultFilter: FilterValue | null;
    filters: Record<string, FilterValue>;
}

export interface FilterValue {
    searchId: string;
    filterId: string | null;
    caption: string;
    value: any;
    isEnabled: boolean;
}


export interface AutocompleteValues {
    labels: {
        keys: [];
        values: [];
    };
    annotations: {
        keys: [];
        values: [];
    };
}

export type FilterObjectType = {
    key?: string;
    value?: string;
    kind?: string;
    count?: number;
};

export type FilterType = FilterObjectType | string;
