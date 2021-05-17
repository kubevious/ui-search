import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@kubevious/ui-components';
import React, { FC, useState } from 'react';
import cx from 'classnames';

import styles from './style.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface SearchInputProps {
    updateSearchCriteria: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({ updateSearchCriteria }) => {
    const [criteria, setCriteria] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const input = e.target.value;
        setCriteria(input);
        updateSearchCriteria(input);
    };

    return (
        <div className={cx('form-group d-flex mb-3', styles.wrapper)}>
            <Input
                type="text"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={handleChange}
                rightIcon={<FontAwesomeIcon icon={faSearch} size="lg" style={{ top: '15px' }} />}
            />
        </div>
    );
};
