import React, { Fragment, useState, useEffect, FC } from "react"
import Autocomplete from "react-autocomplete"
import { sharedState } from "@kubevious/ui-framework/dist/global"
// import { fetchAutocomplete } from "../utils"

import { IDiagramService } from "@kubevious/ui-middleware"
import { useService } from "@kubevious/ui-framework"

import { AutocompleteValues, FilterComponentProps } from '../../types';

import { INITIAL_AUTOCOMPLETE } from "../constants"

// interface AutocompleteTarget
// {

// }


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

    const [autocompleteKeyValue, setAutocompleteKeyValue] = useState<string | null>(null);
    const [autocompleteKeyResults, setAutocompleteKeyResults] = useState<string[]>([]);

    useService<IDiagramService>({ kind: 'diagram' }, (service) => {

        // const value = autocompleteKeyValue;

        if (autocompleteKeyValue) {
            service.fetchAutocompleteKeys('labels', autocompleteKeyValue, (data) => {
                console.error("**** DATA", data);
            })
        } else {
            setAutocompleteKeyResults([]);
        }

    }, [ autocompleteKeyValue ])


    const [autocomplete, setAutocomplete] = useState<AutocompleteValues>(
        INITIAL_AUTOCOMPLETE
    )

    useEffect(() => {
        sharedState.set("autocomplete", INITIAL_AUTOCOMPLETE)
    }, [])

    useEffect(() => {
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
    }, [])

    useEffect(() => {
        sharedState.subscribe("autocomplete", (autocomplete) => {
            setAutocomplete(autocomplete || INITIAL_AUTOCOMPLETE)
        })
    }, [])

    const handleKeyInput = (value: string): void => {
        setCurrentKey(value);
        setAutocompleteKeyValue(value);
    }

    const handleValueInput = (value: string): void => {
        setCurrentValue(value)
        // fetchAutocompleteValues("labels", currentKey, value)
        // setAutocompleteKeyValue(value);
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
    return (
        <div className="filter-input-box">
            <Fragment key="Label">
                <label>Label</label>
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
                        // fetchAutocomplete("labels", currentKey)
                    }
                />
                <Autocomplete
                    getItemValue={(value) => value}
                    items={autocomplete.labels.values}
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
                        // fetchAutocomplete("labels", currentValue)
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
