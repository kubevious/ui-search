import React, { useState } from 'react';
import { DnShortcutComponent } from '@kubevious/ui-components';
import { LIMITED_RESULTS_MSG, NO_ITEMS_MATCHING_MSG, NO_SEARCH_RESULT_MSG } from '../constants';
import { isEmptyArray } from '../util';
import { SelectedData } from '../../types';
import { useSharedState } from '@kubevious/ui-framework';

import styles from './styles.module.css';

export const SearchResults = () => {
    const [result, setResult] = useState<SelectedData[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [wasFiltered, setWasFiltered] = useState<boolean>(false);

    useSharedState((sharedState) => {
        sharedState.subscribe('search_result', (search_result) => {
            setResult(search_result);
            setTotalCount(sharedState.get('total_count'));
            setWasFiltered(sharedState.get('was_filtered'));
        });
    });

    return (
        <div className={styles.searchResults}>
            {isEmptyArray(result) ? (
                <div className={styles.resultPlaceholder}>
                    {wasFiltered ? NO_ITEMS_MATCHING_MSG : NO_SEARCH_RESULT_MSG}
                </div>
            ) : (
                <>
                    {result && result.map((item, index) => <DnShortcutComponent key={index} dn={item.dn} />)}
                    {result.length < totalCount && (
                        <div className={styles.limitedResultsMsg}>{LIMITED_RESULTS_MSG}</div>
                    )}
                </>
            )}
        </div>
    );
};
