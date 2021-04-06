import _ from 'lodash';

import React from 'react';
import { FilterMetaData, FilterComponentData, SearchData } from '../../types';
import { SearchFilterExpander } from '../SearchFilterExpander';

export interface SearchFilterListProps {
    filterList: FilterMetaData[];
    searchData: SearchData;
    addFilter(searchId: string, filterId: string, caption: string, value: any): void;
    removeFilter(searchId: string, filterId: string): void;
    removeAllFilters(searchId: string): void;
}

export const SearchFilterList: React.FunctionComponent<SearchFilterListProps> = ({
    filterList,
    searchData,
    addFilter,
    removeFilter,
    removeAllFilters,
}) => {
    const renderableFilters = filterList.filter((x) => x.component);

    return (
        <div className="filter-list filter-box">
            {renderableFilters &&
                renderableFilters.map((filter, index) => {
                    const ComponentType = filter.component!;

                    const sourceFilterSearchData = searchData.components[filter.searchId];
                    const filterSearchData: FilterComponentData = {
                        searchId: sourceFilterSearchData.searchId,
                        defaultFilter: null,
                        filters: {},
                    };
                    for (let filter of _.values(sourceFilterSearchData.filters)) {
                        if (filter.isEnabled && filter.filterId) {
                            filterSearchData.filters[filter.filterId] = filter;
                        }
                    }

                    const onFilterAdd = (filterId: string, caption: string, value: any) => {
                        addFilter(filter.searchId, filterId, caption, value);
                    };

                    const onFilterRemove = (filterId: string) => {
                        removeFilter(filter.searchId, filterId);
                    };

                    const onFilterRemoveAll = (
                        e:
                            | React.MouseEvent<SVGSVGElement, MouseEvent>
                            | React.MouseEvent<HTMLButtonElement, MouseEvent>,
                    ) => {
                        e.preventDefault();
                        removeAllFilters(filter.searchId);
                    };

                    return (
                        <SearchFilterExpander
                            key={index}
                            filter={filter}
                            removeAllFilters={onFilterRemoveAll}
                            data={filterSearchData}
                        >
                            <ComponentType
                                data={filterSearchData}
                                addFilter={onFilterAdd}
                                removeFilter={onFilterRemove}
                                removeAllFilters={onFilterRemoveAll}
                            />
                        </SearchFilterExpander>
                    );
                })}
        </div>
    );
};
