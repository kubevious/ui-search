import React, { Fragment, useState, useEffect, FC, useRef } from "react"
import Autocomplete from "react-autocomplete"

import { FilterComponentProps } from "../types"
import { sharedState } from "@kubevious/ui-framework/dist/global"
import { useService, useSharedState } from "@kubevious/ui-framework"
import { IDiagramService } from "@kubevious/ui-middleware"

export const FilterSearchAnnotation: FC<FilterComponentProps> = ({
    addFilter,
    removeFilter,
}) => {
    const [currentValue, setCurrentValue] = useState<string>("")
    const [currentKey, setCurrentKey] = useState<string>("")

    const [editedAnnotations, setEditedAnnotations] = useState<{
        filter?: string
        value?: string
    }>({})

    const [autocompleteKey, setAutocompleteKey ] = useState<string | null>(null); 
    const [autocompleteKeyResults, setAutocompleteKeyResults ] = useState<string[]>([]);

    const [autocompleteValue, setAutocompleteValue ] = useState<string | null>(null); 
    const [autocompleteValueResults, setAutocompleteValueResults ] = useState<string[]>([]);

    useService<IDiagramService>({ kind: 'diagram' }, (service) => {
        if (autocompleteKey) {
            service.autocompleteAnnotationKeys(autocompleteKey, (data) => {
                setAutocompleteKeyResults(data);
            })
        } else {
            setAutocompleteKeyResults([]);
        }
    }, [ autocompleteKey ])


    useService<IDiagramService>({ kind: 'diagram' }, (service) => {
        if (autocompleteKey && autocompleteValue) {
            service.autocompleteAnnotationValues(autocompleteKey, autocompleteValue, (data) => {
                setAutocompleteValueResults(data);
            })
        } else {
            setAutocompleteValueResults([]);
        }
    }, [ autocompleteKey, autocompleteValue ])


    useSharedState((sharedState) => {
        sharedState.subscribe(
            "edited_filter_annotations",
            (edited_filter_annotations) => {
                if (edited_filter_annotations) {
                    setEditedAnnotations(edited_filter_annotations || {})
                    setCurrentValue(edited_filter_annotations.value)
                    setCurrentKey(edited_filter_annotations.filter)
                }
            }
        )
    })
    const annotationsRef = useRef(null)

    useEffect(() => {
        sharedState.set("annotations_ref", annotationsRef)
    }, [])

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
        setEditedAnnotations({})
        sharedState.set("edited_filter_annotations", null)
    }

    const handleClearFilter = (key?: string) => {
        removeFilter(key || currentKey)
        setCurrentValue("")
        setCurrentKey("")
        setEditedAnnotations({})
        sharedState.set("edited_filter_annotations", null)
    }

    return (
        <div className="filter-input-box">
            <Fragment key="Annotation">
                <label ref={annotationsRef}>Annotation</label>
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
                        <input
                            disabled={!!editedAnnotations.filter}
                            {...props}
                        />
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
                        onClick={() => addInputField(editedAnnotations.filter)}
                    >
                        {!!editedAnnotations.filter ? "Update" : "Add"}
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            handleClearFilter(editedAnnotations.filter)
                        }
                    >
                        Remove
                    </button>
                </div>
            )}
        </div>
    )
}
