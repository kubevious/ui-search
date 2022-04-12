import React, { Fragment, useState, FC, useRef } from 'react';

import { FilterComponentProps } from '../types';
import { useService, useSharedState } from '@kubevious/ui-framework';
import { ISearchService } from '@kubevious/ui-middleware';

import styles from '../styles.module.css';
import { AutocompleteInput } from '../../AutocompleteInput';

export const FilterSearchAnnotation: FC<FilterComponentProps> = ({ addFilter, removeFilter }) => {
    const [currentValue, setCurrentValue] = useState<string>('');
    const [currentKey, setCurrentKey] = useState<string>('');

    const [editedAnnotations, setEditedAnnotations] = useState<{
        filter?: string;
        value?: string;
    }>({});

    const [autocompleteKey, setAutocompleteKey] = useState<string | null>(null);
    const [autocompleteKeyResults, setAutocompleteKeyResults] = useState<string[]>([]);

    const [autocompleteValue, setAutocompleteValue] = useState<string | null>(null);
    const [autocompleteValueResults, setAutocompleteValueResults] = useState<string[]>([]);
    const annotationsRef = useRef(null);

    useService<ISearchService>(
        { kind: 'search' },
        (service) => {
            if (autocompleteKey) {
                service.autocompleteAnnotationKeys(autocompleteKey)
                    .then((data) => {
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
                service.autocompleteAnnotationValues(autocompleteKey, autocompleteValue)
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
        sharedState.subscribe('edited_filter_annotations', (edited_filter_annotations) => {
            if (edited_filter_annotations) {
                setEditedAnnotations(edited_filter_annotations || {});
                setCurrentValue(edited_filter_annotations.value);
                setCurrentKey(edited_filter_annotations.filter);
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
        addFilter(key || currentKey, `${key || currentKey}=${currentValue}`, currentValue, annotationsRef);
        setCurrentValue('');
        setCurrentKey('');
        setEditedAnnotations({});
        sharedState!.set('edited_filter_annotations', null);
    };

    const handleClearFilter = (key?: string) => {
        removeFilter(key || currentKey);
        setCurrentValue('');
        setCurrentKey('');
        setEditedAnnotations({});
        sharedState!.set('edited_filter_annotations', null);
    };

    return (
        <div className={styles.filterInputBox} ref={annotationsRef}>
            <Fragment key="Annotation">
                <AutocompleteInput
                    value={currentKey}
                    items={autocompleteKeyResults}
                    isDisabled={!!editedAnnotations.filter}
                    placeholder="Annotation"
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
                    <button
                        type="button"
                        onClick={() => handleClearFilter(editedAnnotations.filter)}
                        className={styles.clearFilterBtn}
                    >
                        Clear
                    </button>

                    <button
                        type="button"
                        className={styles.addFilterBtn}
                        onClick={() => addInputField(editedAnnotations.filter)}
                    >
                        {editedAnnotations.filter ? 'Update' : 'Add'}
                    </button>
                </div>
            )}
        </div>
    );
};
