
export const fetchAutocomplete = (type: string, criteria: string): void => {
    // const searchService = new Search([])

    // searchService.fetchAutocompleteKeys(type, { criteria }, (response) => {
    //     const autocomplete = sharedState.get("autocomplete") || {}
    //     autocomplete[type].keys = response
    //     sharedState.set("autocomplete", autocomplete)
    // })
    console.log(type, criteria);
}

export const fetchAutocompleteValues = (
    type: string,
    key: string,
    criteria: string
): void => {
    console.log(type, key, criteria);

    // const searchService = new Search([])
    // if (!key) {
    //     return
    // }

    // searchService.fetchAutocompleteValues(
    //     type,
    //     { key, criteria },
    //     (response) => {
    //         const autocomplete = sharedState.get("autocomplete") || {}
    //         autocomplete[type].values = response
    //         sharedState.set("autocomplete", autocomplete)
    //     }
    // )
}
