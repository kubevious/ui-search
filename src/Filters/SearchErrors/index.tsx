import React, { FC } from 'react';
import { FILTER_ENTRIES_ERRORS } from './constants';
import { FilterComponentProps, FilterEntry } from '../types';
import classnames from 'classnames';

import styles from '../styles.module.css';

export const FilterSearchErrors: FC<FilterComponentProps> = ({ data, addFilter, removeFilter }) => {
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
            {FILTER_ENTRIES_ERRORS.map((option, index) => (
                <button
                    key={index}
                    className={classnames({ [styles.selectedFilter]: option.caption === selectedFilter })}
                    onClick={() => handleFilterChange(option)}
                >
                    {option.caption}
                </button>
            ))}
        </div>
    );
};
