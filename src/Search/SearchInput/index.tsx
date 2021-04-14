import React, { useState } from 'react';
import cx from 'classnames';

import styles from './style.module.css';

export interface SearchInputProps {
    updateSearchCriteria: (value: string) => void;
}

export const SearchInput: React.FunctionComponent<SearchInputProps> = ({ updateSearchCriteria }) => {
    const [criteria, setCriteria] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value;
        setCriteria(input);
        updateSearchCriteria(input);
    };

    return (
        <div className="form-group d-flex mb-3">
            <input
                type="text"
                className={cx('form-control', styles.searchInput)}
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={handleChange}
            />
        </div>
    );
};
