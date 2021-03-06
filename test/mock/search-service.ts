import _ from 'the-lodash';
import { Promise } from 'the-promise';
import { ISearchService } from '@kubevious/ui-middleware';
import { app } from '@kubevious/ui-framework';
import { SearchQueryItem } from '@kubevious/ui-middleware/dist/services/search';

export class SearchService implements ISearchService {

    private _counter : number = 0;

    close() {}

    fetchSearchResults(criteria: any) {
        console.log("[SearchService] criteria: ", criteria);
        if (!criteria) {
            return Promise.resolve({
                results: [],
                wasFiltered: false,
                totalCount: 0
            });
        }

        if (_.keys(criteria).length == 0) {
            return Promise.resolve({
                results: [],
                wasFiltered: false,
                totalCount: 0
            });
        }
        
        this._counter ++;
        const items : SearchQueryItem[] = _.cloneDeep(app.sharedState.get<SearchQueryItem[]>("mock_search_result", []));

        for(const x of items)
        {
            x.dn = x.dn.replaceAll("gprod-addr-main-app", `gprod-addr-main-app-${this._counter}`)
        }

        return Promise.resolve({
            results: items,
            wasFiltered: true,
            totalCount: items.length
        });
    }

    autocompleteLabelKeys()
    {
        const list : string[] = [];
        for(let i = 0; i < 50; i++) {
            list.push(`l-foo-${i}`);
        }

        return Promise.resolve(list);
    }

    autocompleteLabelValues()
    {
        return Promise.resolve(["l-bar1", "l-bar2", "l-bar3"]);
    }

    autocompleteAnnotationKeys()
    {
        return Promise.resolve(["a-foo1", "a-foo2", "a-foo3"]);
    }

    autocompleteAnnotationValues()
    {
        return Promise.resolve(["a-bar1", "a-bar2", "a-bar3"]);
    }

}
