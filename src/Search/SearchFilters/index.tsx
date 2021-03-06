import React, { FC } from 'react';
import { sharedState } from '@kubevious/ui-framework/dist/global';
import cx from 'classnames';

import { FilterMetaData, FilterValue } from '../../types';

import styles from './styles.module.css';
import { FontAwesomeIcon, FASolidIcons } from '@kubevious/ui-components';

export const SearchFilters: FC<{
    filterList: FilterMetaData[];
    activeFilters: FilterValue[];
    removeFilter: (searchId: string, filterId: string | null) => void;
    toggleVisibilityFilter: (searchId: string, filterId: string | null) => void;
    refs: {
        [name: string]: any;
    };
}> = ({ filterList, activeFilters, removeFilter, toggleVisibilityFilter, refs }) => {
    const handleEditFilter = (type: string, filter: string, value: any): void => {
        sharedState.set(`edited_filter_${type}`, {
            filter,
            value,
        });
        const ref = refs[type];
        if (!ref) {
            console.error("REF for ", type, " not found.")
            return;
        }
        const currentRef = ref.current;
        if (!ref) {
            console.error("CurrentREF for ", type, " not found.")
            return;
        }
        currentRef.scrollIntoView({ block: 'start' });
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
                <div style={{ padding: '5px 0 5px 10px' }}>
                    <span className={styles.filterKey}>{`${val.searchId}: `}</span>
                    <span className={styles.filterVal}>{val.caption}</span>
                </div>

                <div className="d-flex">
                    {filterComponent?.isEditable && (
                        <button
                            className={cx(styles.filterBtn, styles.edit)}
                            onClick={() => handleEditFilter(val.searchId, val.filterId || '', val.value)}
                        >
                            <FontAwesomeIcon icon={FASolidIcons.faPen} size="xs" color="white" style={{ width: '10px' }} />
                        </button>
                    )}

                    <button
                        className={cx(styles.filterBtn, styles.toggleShow, {
                            [styles.hide]: !val.isEnabled,
                        })}
                        title="Toggle show/hide"
                        onClick={() => toggleVisibilityFilter(val.searchId, val.filterId)}
                    />

                    <button
                        className={cx(styles.filterBtn, styles.deleteButton)}
                        title="Delete"
                        onClick={() => removeFilter(val.searchId, val.filterId)}
                    >
                        <FontAwesomeIcon icon={FASolidIcons.faTimes} size="xs" color="white" style={{ width: '10px' }} />
                    </button>
                </div>
            </div>
        );
    };

    return <div className={styles.activeFilters}>
        {activeFilters.map((val) => renderActiveFilter(val))}
    </div>;
};
