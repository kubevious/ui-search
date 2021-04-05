import _ from 'the-lodash'
import React from "react"
import cx from "classnames"
import { FilterComponentData, FilterMetaData } from "../../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export const SearchFilterExpander: React.FunctionComponent<{
    data: FilterComponentData
    filter: FilterMetaData
    removeAllFilters: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void
}> = ({ data, filter, removeAllFilters, children }) => {
    const isActive = (_.keys(data.filters).length > 0);
    return (
        <details open key={filter.payload}>
            <summary
                className={cx("filter-list inner", {
                    "is-active": isActive,
                })}
            >
                {filter.title}
                {isActive && (
                    <FontAwesomeIcon
                        className="clearButton"
                        icon={faTrash}
                        onClick={removeAllFilters}
                    />
                )}
            </summary>

            {children}
        </details>
    )
}
