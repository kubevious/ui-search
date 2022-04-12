import { Input } from '@kubevious/ui-components';
import React, { FC, useState } from 'react';
import cx from 'classnames';

import styles from './style.module.css';
import { FontAwesomeIcon, FASolidIcons } from '@kubevious/ui-components';

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
        <div className={styles.inputContainer}>
            <Input
                type="text"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={handleChange}
                rightIcon={<FontAwesomeIcon icon={FASolidIcons.faSearch} size="lg" style={{ top: '15px' }} />}
            />
        </div>
    );
};
