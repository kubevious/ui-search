import _ from 'the-lodash';
import { Promise } from 'the-promise';
import { ISearchService } from '@kubevious/ui-middleware';
import { app } from '@kubevious/ui-framework';
import { SearchQueryItem } from '@kubevious/ui-middleware/dist/services/search';

export class SearchService implements ISearchService {

    private _counter : number = 0;

    close() {}

    fetchSearchResults(criteria: any) {
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
        const items : SearchQueryItem[] = _.cloneDeep(app.sharedState.get("mock_search_result") || []);

        for(let x of items)
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
        return Promise.resolve(["l-foo1", "l-foo2", "l-foo3"]);
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
