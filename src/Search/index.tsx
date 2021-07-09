import _ from 'the-lodash';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';

import { ISearchService } from '@kubevious/ui-middleware';
import { SearchData, FilterValue, FilterMetaData, FilterComponentData } from '../types';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { SearchFilterList } from './SearchFilterList';

import styles from './styles.module.css';
import { SearchQueryItem } from '@kubevious/ui-middleware/dist/services/search';

interface TSearchState {
    searchData: SearchData;
    activeFilters: FilterValue[];
    refs: {
        [name: string]: React.MutableRefObject<null>;
    };
    wasFiltered: boolean;
    results: SearchQueryItem[];
    totalCount: number;
}

export type SearchProps = {
    filterList: FilterMetaData[];
    initSearchData?: SearchData;
};

export class Search extends ClassComponent<SearchProps, TSearchState, ISearchService> {
    private _buildComponentQuery(componentData: FilterComponentData): any | null {
        if (componentData.defaultFilter) {
            return componentData.defaultFilter.value;
        }

        const backendData = {};

        for (const filterData of _.values(componentData.filters)) {
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
    private _currentBackendData: Record<string, any> = {};
    private _queryTimeout : NodeJS.Timeout | null = null;

    constructor(props: SearchProps) {
        //
        // During testing, we do not implement
        // registration of this service,
        // and in order not to receive errors,
        // we do not send the name of the service
        //
        // isTesting ? undefined : { kind: 'search' }
        //
        super(props, null, { kind: 'search' });

        this._metadataDict = _.makeDict(
            this.props.filterList,
            (x) => x.searchId,
            (x) => x,
        );

        this._filterList = this.props.filterList;

        let searchData: SearchData | undefined = undefined;
        if (props.initSearchData) {
            searchData = props.initSearchData!;
        }
        if (!searchData) {
            searchData = this.sharedState.get('search_filter_data');
        }

        if (searchData) {
            searchData = _.clone(searchData);
        } else {
            searchData = { components: {} };
        }

        for(let filter of this._filterList) {
            if (!searchData.components[filter.searchId]) {
                searchData.components[filter.searchId] = {
                    searchId: filter.searchId,
                    defaultFilter: null,
                    filters: {},
                };
            }
        }

        // console.error("[SEARCH] INIT DATA: ", searchData);

        this.state = {
            searchData: searchData,
            activeFilters: this._buildActiveFilters(searchData),
            refs: {},
            wasFiltered: false,
            results: [],
            totalCount: 0
        };

        this.addFilter = this.addFilter.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.removeAllFilters = this.removeAllFilters.bind(this);
        this.toggleVisibilityFilter = this.toggleVisibilityFilter.bind(this);
        this.setFullTextCriteria = this.setFullTextCriteria.bind(this);

    }

    private _processSearchChange() {
        const { searchData } = this.state;

        const backendData : Record<string, any> = {};

        for (const componentData of _.values(searchData.components)) {
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

        this._updateSearchBackendData(backendData);
    }

    private _updateSearchBackendData(backendData: Record<string, any>)
    {
        // console.log("[_updateSearchBackendData] ", backendData);
        this._currentBackendData = backendData;
        
        if (_.keys(this._currentBackendData).length == 0) {
            this.setState({
                wasFiltered: false,
                results: [],
                totalCount: 0
            });
            return;
        }

        this._triggerResultQuery();
    }

    private _triggerResultQuery()
    {
        if (this._queryTimeout) {
            return;
        }

        this._queryTimeout = setTimeout(() => {
            this._queryTimeout = null;

            if (_.keys(this._currentBackendData).length == 0) {
                this.setState({
                    wasFiltered: false,
                    results: [],
                    totalCount: 0
                });
                return;
            }

            const queryData = this._currentBackendData;
            // console.log("[_triggerResultQuery] Query: ", queryData)
            this.service.fetchSearchResults(queryData)
                .then((response) => {

                    if (!_.fastDeepEqual(queryData, this._currentBackendData)) {
                        return;
                    }

                    // console.log("[_triggerResultQuery] Result: ", response)

                    if (response.results) {

                        this.setState({
                            wasFiltered: response.wasFiltered,
                            results: response.results,
                            totalCount: response.totalCount
                        });
                    } else {
                        this.setState({
                            wasFiltered: false,
                            results: [],
                            totalCount: 0
                        });
                    }
                });
        }, 10);
    }

    private addFilter(
        searchId: string,
        filterId: string | null,
        caption: string,
        value: any,
        ref?: React.MutableRefObject<null>,
    ) {
        const { searchData } = this.state;
        if (!searchData.components[searchId]) {
            searchData.components[searchId] = {
                searchId: searchId,
                defaultFilter: null,
                filters: {},
            };
        }

        if (ref) {
            this.state.refs[searchId] = ref;
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

        this._processSearchChange();
    }

    private _buildActiveFilters(searchData: SearchData) {
        let activeFilters: FilterValue[] = [];
        for (const componentData of _.values(searchData.components)) {
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
        // console.log('[_setupSearchData] SearchData: ', searchData);

        const activeFilters = this._buildActiveFilters(searchData);

        this.sharedState.set('search_filter_data', searchData);

        this.setState({
            activeFilters: activeFilters,
            searchData: searchData,
        });
    }

    private toggleVisibilityFilter = (searchId: string, filterId: string) => {
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

    componentDidMount()
    {
        setTimeout(() => {
            this._processSearchChange();
        }, 0)
    }

    render() {
        const { activeFilters, searchData, wasFiltered, results, totalCount } = this.state;

        return (
            <div data-testid="search" className="d-flex flex-column p-40 overflow-hide text-white">
                <SearchInput updateSearchCriteria={this.setFullTextCriteria} />
                <SearchFilters
                    filterList={this._filterList}
                    activeFilters={activeFilters}
                    removeFilter={this.removeFilter}
                    toggleVisibilityFilter={this.toggleVisibilityFilter}
                    refs={this.state.refs}
                    />
                <div className={styles.searchArea}>
                    <SearchFilterList
                        filterList={this._filterList}
                        searchData={searchData}
                        addFilter={this.addFilter}
                        removeFilter={this.removeFilter}
                        removeAllFilters={this.removeAllFilters}
                        />

                    <SearchResults
                        wasFiltered={wasFiltered}
                        result={results}
                        totalCount={totalCount}
                        />
                </div>
            </div>
        );
    }
}
