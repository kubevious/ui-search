import React, { Fragment, useState, FC, useEffect, useRef } from "react"
import Autocomplete from "react-autocomplete"
import { sharedState } from "@kubevious/ui-framework/dist/global"

import { IDiagramService } from "@kubevious/ui-middleware"
import { useService, useSharedState } from "@kubevious/ui-framework"

import { FilterComponentProps } from '../../types';


export const FilterSearchLabel: FC<FilterComponentProps> = ({
    addFilter,
    removeFilter,
}) => {
    const [currentValue, setCurrentValue] = useState<string>("")
    const [currentKey, setCurrentKey] = useState<string>("")

    const [editedLabels, setEditedLabels] = useState<{
        filter?: string
        value?: string
    }>({})

    const [autocompleteKey, setAutocompleteKey ] = useState<string | null>(null); 
    const [autocompleteKeyResults, setAutocompleteKeyResults ] = useState<string[]>([]);

    const [autocompleteValue, setAutocompleteValue ] = useState<string | null>(null); 
    const [autocompleteValueResults, setAutocompleteValueResults ] = useState<string[]>([]);

    useService<IDiagramService>({ kind: 'diagram' }, (service) => {
        if (autocompleteKey) {
            service.autocompleteLabelKeys(autocompleteKey, (data) => {
                setAutocompleteKeyResults(data);
            })
        } else {
            setAutocompleteKeyResults([]);
        }
    }, [ autocompleteKey ])


    useService<IDiagramService>({ kind: 'diagram' }, (service) => {
        if (autocompleteKey && autocompleteValue) {
            service.autocompleteLabelValues(autocompleteKey, autocompleteValue, (data) => {
                setAutocompleteValueResults(data);
            })
        } else {
            setAutocompleteValueResults([]);
        }
    }, [ autocompleteKey, autocompleteValue ])

    useSharedState((sharedState) => {
        sharedState.subscribe(
            "edited_filter_labels",
            (edited_filter_labels) => {
                if (edited_filter_labels) {
                    setEditedLabels(edited_filter_labels || {})
                    setCurrentValue(edited_filter_labels.value)
                    setCurrentKey(edited_filter_labels.filter)
                }
            }
        )
    })

    const handleKeyInput = (value: string): void => {
        setCurrentKey(value);
        setAutocompleteKey(value);
    }

    const handleValueInput = (value: string): void => {
        setCurrentValue(value);
        setAutocompleteValue(value);
    }

    const addInputField = (key?: string): void => {
        addFilter(
            key || currentKey,
            `${key || currentKey}=${currentValue}`,
            currentValue
        )
        setCurrentValue("")
        setCurrentKey("")
        setEditedLabels({})
        sharedState.set("edited_filter_labels", null)
    }

    const handleClearFilter = (key?: string) => {
        removeFilter(key || currentKey)
        setCurrentValue("")
        setCurrentKey("")
        setEditedLabels({})
        sharedState.set("edited_filter_labels", null)
    }

    const labelsRef = useRef(null)

    useEffect(() => {
        sharedState.set("labels_ref", labelsRef)
    }, [])
    
    return (
        <div className="filter-input-box">
            <Fragment key="Label">
                <label ref={labelsRef}>Label</label>
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocompleteKeyResults}
                    value={currentKey}
                    onChange={(e) => handleKeyInput(e.target.value)}
                    onSelect={(val) => handleKeyInput(val)}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => (
                        <div className="autocomplete" children={items} />
                    )}
                    renderInput={(props) => (
                        <input disabled={!!editedLabels.filter} {...props} />
                    )}
                    onMenuVisibilityChange={() =>
                        handleKeyInput(currentKey)
                    }
                />
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocompleteValueResults}
                    value={currentValue}
                    onChange={(e) => handleValueInput(e.target.value)}
                    onSelect={(val) => handleValueInput(val)}
                    renderItem={(content) => <div>{content}</div>}
                    renderMenu={(items) => (
                        <div className="autocomplete" children={items} />
                    )}
                    renderInput={(props) => (
                        <input disabled={!currentKey.trim()} {...props} />
                    )}
                    onMenuVisibilityChange={() =>
                        handleValueInput(currentValue)
                    }
                />
            </Fragment>
            {currentKey.trim() && currentValue.trim() && (
                <div className="filter-input-btns">
                    <button
                        type="button"
                        className="add-filter-btn"
                        onClick={() => addInputField(editedLabels.filter)}
                    >
                        {!!editedLabels.filter ? "Update" : "Add"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleClearFilter(editedLabels.filter)}
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    )
}
