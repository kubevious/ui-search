import _ from "the-lodash"
import React from "react"
import { ClassComponent } from "@kubevious/ui-framework"
import { sharedState } from "@kubevious/ui-framework/dist/global"

import "./styles.scss"
import { IDiagramService } from "@kubevious/ui-middleware"
import { SearchData, FilterValue, FilterMetaData, FilterComponentData } from "../types"
import { SearchInput } from "./SearchInput"
import { SearchFilters } from "./SearchFilters"
import { SearchResults } from "./SearchResults"
import { SearchFilterList } from "./SearchFilterList"

interface TSearchState {
    searchData: SearchData
    activeFilters: FilterValue[]
}

const isTesting = process.env.IS_TESTING;


export type SearchProps = {
    filterList: FilterMetaData[]
}

export class Search extends ClassComponent<
    SearchProps,
    TSearchState,
    IDiagramService
> {
    fetchSearchResults() {
        const { searchData } = this.state

        let backendData = {}

        for (let componentData of _.values(searchData.components)) {
            const componentMetadata = this._metadataDict[componentData.searchId];
            if (componentMetadata)
            {
                const componentPayload = this._buildComponentQuery(componentData);

                if (_.isNotNullOrUndefined(componentPayload))
                {
                    backendData[componentMetadata.payload] = componentPayload
                }
            }
            else
            {
                console.error("MISSING SEARCH METADATA: ", componentData.searchId);
            }
        }

        console.log(
            "[SEARCH QUERY DATA] ",
            JSON.stringify(backendData, null, 4)
        )

        this.fetchResults(backendData)
    }

    private _buildComponentQuery(componentData: FilterComponentData) : any | null
    {
        if (componentData.defaultFilter) {
            return componentData.defaultFilter.value;
        }

        const backendData = {};

        for (let filterData of _.values(componentData.filters)) {
            if (filterData.isEnabled) {
                if (filterData.filterId) {
                    backendData[filterData.filterId] = filterData.value
                }
            }
        }

        if (_.keys(backendData).length == 0) {
            return null;
        }

        return backendData;
    }

    fetchAutocompleteKeys(
        type: string,
        criteria: any,
        cb: (data: any) => any
    ): void {
        this.service.fetchAutocompleteKeys(type, criteria, cb)
    }

    fetchAutocompleteValues(
        type: string,
        criteria: any,
        cb: (data: any) => any
    ): void {
        this.service.fetchAutocompleteValues(type, criteria, cb)
    }

    private _filterList: FilterMetaData[]
    private _metadataDict: Record<string, FilterMetaData>
    
    initialSearchData: SearchData

    initialState: TSearchState
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
            (x) => x
        )

        this._filterList = this.props.filterList

        this.initialSearchData = {
            components: _.makeDict(
                this._filterList,
                (x) => x.searchId,
                (x) => ({
                    searchId: x.searchId,
                    defaultFilter: null,
                    filters: {},
                })
            ),
        }
        this.initialState = {
            searchData: this.initialSearchData,
            activeFilters: [],
        }

        this.state = this.initialState
        this.fetchResults = this.fetchResults.bind(this)
        this.fetchAutocompleteKeys = this.fetchAutocompleteKeys.bind(this)
        this.fetchAutocompleteValues = this.fetchAutocompleteValues.bind(this)

        this.addFilter = this.addFilter.bind(this)
        this.removeFilter = this.removeFilter.bind(this)
        this.removeAllFilters = this.removeAllFilters.bind(this)
        this.toogleVisibilityFilter = this.toogleVisibilityFilter.bind(this)

        this._setFullTextCriteria = this._setFullTextCriteria.bind(this);
    }

    fetchResults(criteria: any): void {
        this.service.fetchSearchResults(criteria, (response: any) => {
            if (response.results) {
                sharedState.set("was_filtered", response.wasFiltered)
                sharedState.set("search_result", response.results)
                sharedState.set("total_count", response.totalCount)
            } else {
                sharedState.set("search_result", response)
                sharedState.set("total_count", response.length)
            }
        })
    }

    addFilter(searchId: string, filterId: string | null, caption: string, value: any) {
        const { searchData } = this.state
        if (!searchData.components[searchId]) {
            searchData.components[searchId] = {
                searchId: searchId,
                defaultFilter: null,
                filters: {},
            }
        }

        const filterValue : FilterValue = {
            searchId: searchId,
            filterId: filterId,
            caption: caption,
            value: value,
            isEnabled: true,
        }

        if (filterId) {
            searchData.components[searchId].filters[filterId] = filterValue;
        } else {
            searchData.components[searchId].defaultFilter = filterValue;
        }

        this._handleSearchDataChange()
    }

    removeFilter(searchId: string, filterId: string | null) {
        const { searchData } = this.state

        if (searchData.components[searchId]) {
            if (filterId) {
                delete searchData.components[searchId].filters[filterId]
            } else {
                searchData.components[searchId].defaultFilter = null;
            }
        }

        this._handleSearchDataChange()
    }

    removeAllFilters(searchId: string) {
        const { searchData } = this.state

        if (searchData.components[searchId]) {
            searchData.components[searchId].defaultFilter = null,
            searchData.components[searchId].filters = {}
        }

        this._handleSearchDataChange()
    }

    private _handleSearchDataChange() {
        const { searchData } = this.state

        console.log("[_handleSearchDataChange] SearchData: ", searchData)

        let activeFilters: FilterValue[] = []
        for (let componentData of _.values(searchData.components)) {
            if (componentData.defaultFilter) {
                activeFilters.push(componentData.defaultFilter);
            }
            activeFilters = _.concat(
                activeFilters,
                _.values(componentData.filters)
            )
        }

        this.setState({
            activeFilters: activeFilters,
            searchData: searchData,
        })

        this.fetchSearchResults()
    }

    toogleVisibilityFilter = (searchId: string, filterId: string) => {
        const { searchData } = this.state
        const { isEnabled } = searchData.components[searchId].filters[filterId]
        searchData.components[searchId].filters[filterId].isEnabled = !isEnabled

        this._handleSearchDataChange()
    }

    private _setFullTextCriteria(value: string)
    {
        this.addFilter('criteria', null, `Search: ${value}`, value);
    }


    render() {
        const { activeFilters, searchData } = this.state

        return (
            <div data-testid="search" className="Search-wrapper p-40 overflow-hide">
                <SearchInput
                    updateSearchCriteria={this._setFullTextCriteria} />
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
        )
    }
}
