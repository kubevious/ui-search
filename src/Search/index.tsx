import _ from 'the-lodash';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';

import './styles.scss';
import { IDiagramService } from '@kubevious/ui-middleware';
import { SearchData, FilterValue, FilterMetaData, FilterComponentData } from '../types';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { SearchFilterList } from './SearchFilterList';

interface TSearchState {
    searchData: SearchData;
    activeFilters: FilterValue[];
}

const isTesting = process.env.IS_TESTING;

export type SearchProps = {
    filterList: FilterMetaData[];
};

export class Search extends ClassComponent<SearchProps, TSearchState, IDiagramService> {
    private _buildComponentQuery(componentData: FilterComponentData): any | null {
        if (componentData.defaultFilter) {
            return componentData.defaultFilter.value;
        }

        const backendData = {};

        for (let filterData of _.values(componentData.filters)) {
            if (filterData.isEnabled) {
                if (filterData.filterId) {
                    backendData[filterData.filterId] = filterData.value;
                }
            }
        }

        if (_.keys(backendData).length == 0) {
            return null;
        }

        return backendData;
    }

    private _filterList: FilterMetaData[];
    private _metadataDict: Record<string, FilterMetaData>;

    constructor(props: any) {
        //
        // During testing, we do not implement
        // registration of this service,
        // and in order not to receive errors,
        // we do not send the name of the service
        //
        // isTesting ? undefined : { kind: 'diagram' }
        //
        super(props, null, isTesting ? undefined : { kind: 'diagram' });

        this._metadataDict = _.makeDict(
            this.props.filterList,
            (x) => x.searchId,
            (x) => x,
        );

        this._filterList = this.props.filterList;

        let searchData: SearchData = this.sharedState.get('search_filter_data');
        if (!searchData) {
            searchData = {
                components: _.makeDict(
                    this._filterList,
                    (x) => x.searchId,
                    (x) => ({
                        searchId: x.searchId,
                        defaultFilter: null,
                        filters: {},
                    }),
                ),
            };
        }

        this.state = {
            searchData: searchData,
            activeFilters: this._buildActiveFilters(searchData),
        };

        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
        this.toogleVisibilityFilter = this.toogleVisibilityFilter.bind(this);
        this.setFullTextCriteria = this.setFullTextCriteria.bind(this);
    }

    private fetchSearchResults() {
        const { searchData } = this.state;

        let backendData = {};

        for (let componentData of _.values(searchData.components)) {
            const componentMetadata = this._metadataDict[componentData.searchId];
            if (componentMetadata) {
                const componentPayload = this._buildComponentQuery(componentData);

                if (_.isNotNullOrUndefined(componentPayload)) {
                    backendData[componentMetadata.payload] = componentPayload;
                }
            } else {
                console.error('MISSING SEARCH METADATA: ', componentData.searchId);
            }
        }

        // console.log(
        //     "[SEARCH QUERY DATA] ",
        //     JSON.stringify(backendData, null, 4)
        // )

        this.service.fetchSearchResults(backendData, (response: any) => {
            if (response.results) {
                this.sharedState.set('was_filtered', response.wasFiltered);
                this.sharedState.set('search_result', response.results);
                this.sharedState.set('total_count', response.totalCount);
            } else {
                this.sharedState.set('search_result', response);
                this.sharedState.set('total_count', response.length);
            }
        });
    }

    private addFilter(searchId: string, filterId: string | null, caption: string, value: any) {
        const { searchData } = this.state;
        if (!searchData.components[searchId]) {
            searchData.components[searchId] = {
                searchId: searchId,
                defaultFilter: null,
                filters: {},
            };
        }

        const filterValue: FilterValue = {
            searchId: searchId,
            filterId: filterId,
            caption: caption,
            value: value,
            isEnabled: true,
        };

        if (filterId) {
            searchData.components[searchId].filters[filterId] = filterValue;
        } else {
            searchData.components[searchId].defaultFilter = filterValue;
        }

        this._handleSearchDataChange();
    }

    private removeFilter(searchId: string, filterId: string | null) {
        const { searchData } = this.state;

        if (searchData.components[searchId]) {
            if (filterId) {
                delete searchData.components[searchId].filters[filterId];
            } else {
                searchData.components[searchId].defaultFilter = null;
            }
        }

        this._handleSearchDataChange();
    }

    private removeAllFilters(searchId: string) {
        const { searchData } = this.state;

        if (searchData.components[searchId]) {
            (searchData.components[searchId].defaultFilter = null), (searchData.components[searchId].filters = {});
        }

        this._handleSearchDataChange();
    }

    private _handleSearchDataChange() {
        const { searchData } = this.state;

        this._setupSearchData(searchData);

        this.fetchSearchResults();
    }

    private _buildActiveFilters(searchData: SearchData) {
        let activeFilters: FilterValue[] = [];
        for (let componentData of _.values(searchData.components)) {
            const componentMetadata = this._metadataDict[componentData.searchId];
            if (componentMetadata) {
                if (componentMetadata.component) {
                    if (componentData.defaultFilter) {
                        activeFilters.push(componentData.defaultFilter);
                    }
                    activeFilters = _.concat(activeFilters, _.values(componentData.filters));
                }
            }
        }
        return activeFilters;
    }

    private _setupSearchData(searchData: SearchData) {
        console.log('[_setupSearchData] SearchData: ', searchData);

        let activeFilters = this._buildActiveFilters(searchData);

        this.sharedState.set('search_filter_data', searchData);

        this.setState({
            activeFilters: activeFilters,
            searchData: searchData,
        });
    }

    private toogleVisibilityFilter = (searchId: string, filterId: string) => {
        const { searchData } = this.state;
        const { isEnabled } = searchData.components[searchId].filters[filterId];
        searchData.components[searchId].filters[filterId].isEnabled = !isEnabled;

        this._handleSearchDataChange();
    };

    private setFullTextCriteria(value: string) {
        if (!value) {
            this.removeAllFilters('criteria');
        } else {
            this.addFilter('criteria', null, `Search: ${value}`, value);
        }
    }

    render() {
        const { activeFilters, searchData } = this.state;

        return (
            <div data-testid="search" className="Search-wrapper p-40 overflow-hide">
                <SearchInput updateSearchCriteria={this.setFullTextCriteria} />
                <SearchFilters
                    filterList={this._filterList}
                    activeFilters={activeFilters}
                    removeFilter={this.removeFilter}
                    toogleVisibilityFilter={this.toogleVisibilityFilter}
                />
                <div className="search-area">
                    <SearchFilterList
                        filterList={this._filterList}
                        searchData={searchData}
                        addFilter={this.addFilter}
                        removeFilter={this.removeFilter}
                        removeAllFilters={this.removeAllFilters}
                    />
                    <SearchResults />
                </div>
            </div>
        );
    }
}
