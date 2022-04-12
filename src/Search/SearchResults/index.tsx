import React, { FC } from 'react';
import { DnResults, Label } from '@kubevious/ui-components';
import { LIMITED_RESULTS_MSG, NO_ITEMS_MATCHING_MSG, NO_SEARCH_RESULT_MSG } from '../constants';
import { isEmptyArray } from '../util';

import styles from './styles.module.css';
import { SearchQueryItem } from '@kubevious/ui-middleware/dist/services/search';

export interface SearchResultsProps 
{
    wasFiltered: boolean,
    result?: SearchQueryItem[],
    totalCount: number
}

export const SearchResults : FC<SearchResultsProps> = ({ wasFiltered, result, totalCount }) => {

    return (
        <div className={styles.searchResults}>
            {isEmptyArray(result!) ? (
                <div className={styles.centeredMessage}>
                    <Label text={wasFiltered ? NO_ITEMS_MATCHING_MSG : NO_SEARCH_RESULT_MSG}
                           size="xlarge" />
                </div>
            ) : (
                <>
                    {result && 
                        <DnResults items={result} />
                    }
                    {result!.length < totalCount && (
                        <div className={styles.centeredMessage}>
                            <Label text={LIMITED_RESULTS_MSG}
                                   size="xlarge" />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
