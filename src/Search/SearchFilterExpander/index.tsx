import _ from 'the-lodash';
import React, { FC, useState } from 'react';
import { FilterComponentData, FilterMetaData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './styles.module.css';

export const SearchFilterExpander: FC<{
    data: FilterComponentData;
    filter: FilterMetaData;
    removeAllFilters: (e: React.ChangeEvent | React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}> = ({ data, filter, removeAllFilters, children }) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const isActive = _.keys(data.filters).length > 0;

    return (
        <details open={isOpen} key={filter.payload}>
            <summary onClick={() => setIsOpen(!isOpen)}>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ marginRight: '5px' }} />

                {filter.title}

                {isActive && (
                    <FontAwesomeIcon
                        className={styles.clearButton}
                        icon={faTimes}
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
