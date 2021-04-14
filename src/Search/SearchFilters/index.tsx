import React, { FC } from 'react';
import cx from 'classnames';
import { sharedState } from '@kubevious/ui-framework/dist/global';

import { FilterMetaData, FilterValue } from '../../types';

import styles from './styles.module.css';

export const SearchFilters: FC<{
    filterList: FilterMetaData[];
    activeFilters: FilterValue[];
    removeFilter: (searchId: string, filterId: string | null) => void;
    toogleVisibilityFilter: (searchId: string, filterId: string | null) => void;
    refs: {
        [name: string]: any;
    };
}> = ({ filterList, activeFilters, removeFilter, toogleVisibilityFilter, refs }) => {
    const handleEditFilter = (type: string, filter: string, value: any): void => {
        sharedState.set(`edited_filter_${type}`, {
            filter,
            value,
        });
        refs[type].current.scrollIntoView({ block: 'start' });
    };

    const renderActiveFilter = (val: FilterValue) => {
        const filterComponent = filterList.find((filterValue) => filterValue.searchId === val.searchId);

        return (
            <div
                className={cx(styles.activeFilterBox, {
                    [styles.deactivated]: !val.isEnabled,
                })}
                key={val.caption}
            >
                <span className={styles.filterKey}>{`${val.searchId}: `}</span>
                <span className={styles.filterVal}>{val.caption}</span>
                {filterComponent?.isEditable && (
                    <button
                        className={cx(styles.filterBtn, styles.edit)}
                        onClick={() => handleEditFilter(val.searchId, val.filterId || '', val.value)}
                    />
                )}
                <button
                    className={cx(styles.filterBtn, styles.toggleShow, {
                        [styles.hide]: !val.isEnabled,
                    })}
                    title="Toggle show/hide"
                    onClick={() => toogleVisibilityFilter(val.searchId, val.filterId)}
                />
                <button
                    className={styles.filterBtn}
                    title="Delete"
                    onClick={() => removeFilter(val.searchId, val.filterId)}
                >
                    &times;
                </button>
            </div>
        );
    };

    return <div className={styles.activeFilters}>{activeFilters.map((val) => renderActiveFilter(val))}</div>;
};
