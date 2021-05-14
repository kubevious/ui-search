import React, { Fragment, useState, FC, useRef } from 'react';
import Autocomplete from 'react-autocomplete';
import { sharedState } from '@kubevious/ui-framework/dist/global';

import { ISearchService } from '@kubevious/ui-middleware';
import { useService, useSharedState } from '@kubevious/ui-framework';

import { FilterComponentProps } from '../../types';

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
                service.autocompleteLabelKeys(autocompleteKey, (data) => {
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
                service.autocompleteLabelValues(autocompleteKey, autocompleteValue, (data) => {
                    setAutocompleteValueResults(data);
                });
            } else {
                setAutocompleteValueResults([]);
            }
        },
        [autocompleteKey, autocompleteValue],
    );

    useSharedState((sharedState) => {
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
        sharedState.set('edited_filter_labels', null);
    };

    const handleClearFilter = (key?: string) => {
        removeFilter(key || currentKey);
        setCurrentValue('');
        setCurrentKey('');
        setEditedLabels({});
        sharedState.set('edited_filter_labels', null);
    };

    return (
        <div className={styles.filterInputBox}>
            <Fragment key="Label">
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocompleteKeyResults}
                    value={currentKey}
                    onChange={(e) => handleKeyInput(e.target.value)}
                    onSelect={(val) => handleKeyInput(val)}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => <div className={styles.autocomplete} children={items} />}
                    renderInput={(props) => (
                        <input
                            placeholder="Label"
                            disabled={!!editedLabels.filter}
                            className={styles.input}
                            {...props}
                        />
                    )}
                    onMenuVisibilityChange={() => handleKeyInput(currentKey)}
                />
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocompleteValueResults}
                    value={currentValue}
                    onChange={(e) => handleValueInput(e.target.value)}
                    onSelect={(val) => handleValueInput(val)}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => <div className={styles.autocomplete} children={items} />}
                    renderInput={(props) => (
                        <input placeholder="Value" disabled={!currentKey.trim()} className={styles.input} {...props} />
                    )}
                    onMenuVisibilityChange={() => handleValueInput(currentValue)}
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
