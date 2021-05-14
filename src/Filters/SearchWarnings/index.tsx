import { Checkbox } from '@kubevious/ui-components';
import React, { FC } from 'react';
import { FILTER_ENTRIES_WARNINGS } from './constants';
import { FilterComponentProps, FilterEntry } from '../types';

import styles from '../styles.module.css';

export const FilterSearchWarnings: FC<FilterComponentProps> = ({ data, addFilter, removeFilter }) => {
    const selectedFilter = data.filters?.value?.caption;

    const handleFilterChange = (entry: FilterEntry): void => {
        if (entry.caption === selectedFilter) {
            removeFilter('value');
        } else {
            addFilter('value', entry.caption, entry.value);
        }
    };

    return (
        <div className={styles.innerItems}>
            {FILTER_ENTRIES_WARNINGS.map((option, index) => (
                <div key={index} className={styles.itemBlock}>
                    <Checkbox
                        label={option.caption}
                        onChange={() => handleFilterChange(option)}
                        checked={option.caption === selectedFilter}
                    />
                </div>
            ))}
        </div>
    );
};
