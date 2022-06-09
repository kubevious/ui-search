import React, { Fragment, useState, FC, useRef } from 'react';
import { AutocompleteInput } from '../../AutocompleteInput';

import { ISearchService } from '@kubevious/ui-middleware';
import { useService, useSharedState } from '@kubevious/ui-framework';

import { FilterComponentProps } from '../types';

import styles from '../styles.module.css';

export const FilterSearchLabel: FC<FilterComponentProps> = ({ addFilter, removeFilter }) => {
    const [currentValue, setCurrentValue] = useState<string>('');
    const [currentKey, setCurrentKey] = useState<string>('');

    const [editedLabels, setEditedLabels] = useState<{
        filter?: string;
        value?: string;
    }>({});

    const [autocompleteKey, setAutocompleteKey] = useState<string | null>(null);
    const [autocompleteKeyResults, setAutocompleteKeyResults] = useState<string[]>([]);

    const [autocompleteValue, setAutocompleteValue] = useState<string | null>(null);
    const [autocompleteValueResults, setAutocompleteValueResults] = useState<string[]>([]);
    const labelsRef = useRef(null);

    useService<ISearchService>(
        { kind: 'search' },
        (service) => {
            if (autocompleteKey) {
                service.autocompleteLabelKeys(autocompleteKey)
                    .then(data => {
                        setAutocompleteKeyResults(data);
                    });
            } else {
                setAutocompleteKeyResults([]);
            }
        },
        [autocompleteKey],
    );

    useService<ISearchService>(
        { kind: 'search' },
        (service) => {
            if (autocompleteKey && autocompleteValue) {
                service.autocompleteLabelValues(autocompleteKey, autocompleteValue)
                    .then((data) => {
                        setAutocompleteValueResults(data);
                    });
            } else {
                setAutocompleteValueResults([]);
            }
        },
        [autocompleteKey, autocompleteValue],
    );

    const sharedState = useSharedState((sharedState) => {
        sharedState.subscribe('edited_filter_labels', (edited_filter_labels) => {
            if (edited_filter_labels) {
                setEditedLabels(edited_filter_labels || {});
                setCurrentValue(edited_filter_labels.value);
                setCurrentKey(edited_filter_labels.filter);
            }
        });
    });

    const handleKeyInput = (value: string): void => {
        setCurrentKey(value);
        setAutocompleteKey(value);
    };

    const handleValueInput = (value: string): void => {
        setCurrentValue(value);
        setAutocompleteValue(value);
    };

    const addInputField = (key?: string): void => {
        addFilter(key || currentKey, `${key || currentKey}=${currentValue}`, currentValue, labelsRef);
        setCurrentValue('');
        setCurrentKey('');
        setEditedLabels({});
        sharedState!.set('edited_filter_labels', null);
    };

    const handleClearFilter = (key?: string) => {
        removeFilter(key || currentKey);
        setCurrentValue('');
        setCurrentKey('');
        setEditedLabels({});
        sharedState!.set('edited_filter_labels', null);
    };

    return (
        <div className={styles.filterInputBox} ref={labelsRef}>
            <Fragment key="Label">
                <AutocompleteInput
                    value={currentKey}
                    items={autocompleteKeyResults}
                    isDisabled={!!editedLabels.filter}
                    placeholder="Label"
                    handleInput={handleKeyInput}
                    />

                <AutocompleteInput
                    value={currentValue}
                    items={autocompleteValueResults}
                    isDisabled={!currentKey.trim()}
                    placeholder="Value"
                    handleInput={handleValueInput}
                    />
            </Fragment>

            {currentKey.trim() && currentValue.trim() && (
                <div className={styles.filterInputBtns}>
                    <button className={styles.clearFilterBtn} onClick={() => handleClearFilter(editedLabels.filter)}>Clear</button>

                    <button className={styles.addFilterBtn} onClick={() => addInputField(editedLabels.filter)}>
                        {editedLabels.filter ? 'Update' : 'Add'}
                    </button>
                </div>
            )}
        </div>
    );
};
