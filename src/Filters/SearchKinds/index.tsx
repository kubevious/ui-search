import React, { FC, useState, useEffect } from "react"
import { KindList, KindListValue } from "./types"
import _ from "lodash"
import { FilterComponentProps } from "../types"
import { KIND_TO_USER_MAPPING } from "@kubevious/helpers/dist/docs"
import classnames from "classnames"

export const FilterSearchKinds: FC<FilterComponentProps> = ({
    data,
    addFilter,
    removeAllFilters,
}) => {
    const selectedKinds = data.filters

    const [kinds, setKinds] = useState<KindList>({
        payload: "kind",
        shownValue: "Kind",
        values: [],
    })
    const getKindsList = (): void => {
        let kindsArray = Object.entries(KIND_TO_USER_MAPPING)
        let newKindsArray = kindsArray
            ? kindsArray.map(([key, value]) => ({ title: value, payload: key }))
            : []
        newKindsArray =
            _.orderBy(newKindsArray, (x: KindListValue) => x.title) || []
        setKinds({
            payload: "kind",
            shownValue: "Kind",
            values: newKindsArray,
        })
    }

    useEffect(() => {
        getKindsList()
    }, [])

    const kindFilterChange = (
        title: string,
        payload: string,
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        removeAllFilters(e)
        if (!selectedKinds[payload]) {
            addFilter(payload, title, true)
        }
    }

    return (
        <div className="inner-items">
            {kinds.values &&
                kinds.values.map((item, index) => {
                    return (
                        <button
                            key={index}
                            className={classnames({'selected-filter': selectedKinds[item.payload]})}
                            onClick={(e) =>
                                kindFilterChange(item.title, item.payload, e)
                            }
                        >
                            {item.title || ""}
                        </button>
                    )
                })}
        </div>
    )
}
