import React from 'react';
import { FilterComponentData } from '../types';

export interface FilterEntry {
    caption: string;
    value: any;
}

export interface FilterComponentProps {
    data: FilterComponentData;
    addFilter: (filterId: string, caption: string, value: any, ref?: React.MutableRefObject<null>) => void;
    removeFilter: (filterId: string) => void;
    removeAllFilters: (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<SVGSVGElement, MouseEvent>
            | React.ChangeEvent,
    ) => void;
}
