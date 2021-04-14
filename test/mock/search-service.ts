// @ts-nocheck
import { ISearchService } from '@kubevious/ui-middleware';

export class SearchService implements ISearchService {
    close() {}

    fetchSearchResults(criteria, cb) {
        if (!criteria) {
            cb([]);
            return;
        }
        let res = [];
        let res2 = res.map((x) => ({
            dn: x,
        }));
        cb(res2);
    }

    autocompleteLabelKeys() {}

    autocompleteLabelValues() {}

    autocompleteAnnotationKeys() {}

    autocompleteAnnotationValues() {}
}
