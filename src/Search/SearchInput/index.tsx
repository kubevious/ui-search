import React, { useState } from 'react';

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
        <div className="form-group has-success">
            <input
                type="text"
                className="form-control search-input"
                placeholder="Search"
                value={criteria}
                autoFocus
                onChange={(e) => handleChange(e)}
            />
        </div>
    );
};
