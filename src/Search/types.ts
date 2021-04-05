export type List = {
    payload: string
    shownValue: string
}

export type FilterObjectType = {
    key?: string
    value?: string
    kind?: string
    count?: number
}

export type FilterType = FilterObjectType | string

export type SearchProps = {
    filterList: FilterItem[]
}

// TODO: Move types above to /Filters/**/types.ts

/********/

export interface FilterData {
    isEnabled: boolean
    criteria: FilterCriteria[]
}

export interface FilterCriteria {
    caption: string
    values: any
}

export interface FilterComponentProps {
    data: FilterComponentData
    addFilter: (filterId: string, caption: string, value: any) => void
    removeFilter: (filterId: string) => void
    removeAllFilters: (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => void
}

export interface FilterItem {
    searchId: string
    payload: string
    title: string
    component: React.ComponentType<FilterComponentProps>
    data?: FilterData
    isEditable?: boolean
}

/*******/

export interface SearchData {
    components: Record<string, FilterComponentData>
}

export interface FilterComponentData {
    searchId: string
    filters: Record<string, FilterValue>
}

export interface FilterValue {
    searchId: string
    filterId: string
    caption: string
    value: any
    isEnabled: boolean
}

export interface FilterEntry {
    caption: string
    value: any
}

export interface SelectedData {
    dn: string
    id?: number
    errors?: number
    warnings?: number
    options?: {
        relativeTo?: string
    }
    markers?: string[]
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

export type EditorItem = {
    script?: string;
    target?: string;
    name?: string;
    propagate?: boolean;
    shape?: string;
    color?: string;
    item_count?: number;
    error_count?: number;
    enabled?: boolean;
    is_current?: boolean;
};
