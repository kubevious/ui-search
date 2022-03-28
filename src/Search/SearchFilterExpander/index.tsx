import _ from 'the-lodash';
import React, { FC, useState } from 'react';
import { FilterComponentData, FilterMetaData } from '../../types';
import { FontAwesomeIcon, FASolidIcons } from '@kubevious/ui-components';

import styles from './styles.module.css';

export const SearchFilterExpander: FC<{
    data: FilterComponentData;
    filter: FilterMetaData;
    removeAllFilters: (e: React.ChangeEvent | React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ data, filter, removeAllFilters, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const isActive = _.keys(data.filters).length > 0;

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    return (
        <details open={isOpen} key={filter.payload}>
            <summary onClick={handleToggle} className={styles.expanderContent}>
                <FontAwesomeIcon icon={isOpen ? FASolidIcons.faChevronUp : FASolidIcons.faChevronDown} style={{ marginRight: '5px' }} />

                {filter.title}

                {isActive && (
                    <FontAwesomeIcon
                        className={styles.clearButton}
                        icon={FASolidIcons.faTimes}
                        onClick={removeAllFilters}
                        title="Delete used filters"
                        color="#FFFFFF"
                    />
                )}
            </summary>

            {children}
        </details>
    );
};
