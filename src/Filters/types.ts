import { FilterComponentData } from "../types"

export interface FilterEntry {
    caption: string
    value: any
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
