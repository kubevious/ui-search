import { InnerPage, PageHeader, CallbackHook } from '@kubevious/ui-components';
import { Story } from '@storybook/react';
import React from 'react';
import {
    FilterSearchAnnotation,
    FilterSearchErrors,
    FilterSearchKinds,
    FilterSearchLabel,
    FilterSearchMarkers,
    FilterSearchWarnings,
} from '..';
import { setupMock } from '../../test/mock/mock';
import { Search } from '.';
import { FilterMetaData, SearchData } from '../types';

import { app } from '@kubevious/ui-framework';
import { SearchQueryItem } from '@kubevious/ui-middleware/dist/services/search';

export default {
    title: 'Search',
};

const SEARCH_FILTER_METADATA: FilterMetaData[] = [
    {
        searchId: 'criteria',
        payload: 'criteria',
        title: 'criteria',
    },
    {
        searchId: 'kind',
        payload: 'kind',
        title: 'Kind',
        component: FilterSearchKinds,
    },
    {
        searchId: 'labels',
        payload: 'labels',
        title: 'Labels',
        component: FilterSearchLabel,
        isEditable: true,
    },
    {
        searchId: 'annotations',
        payload: 'annotations',
        title: 'Annotations',
        component: FilterSearchAnnotation,
        isEditable: true,
    },
    {
        searchId: 'warnings',
        payload: 'warnings',
        title: 'Warnings',
        component: FilterSearchWarnings,
    },
    {
        searchId: 'errors',
        payload: 'errors',
        title: 'Errors',
        component: FilterSearchErrors,
    },
    {
        searchId: 'markers',
        payload: 'markers',
        title: 'Markers',
        component: FilterSearchMarkers,
    },
];


setupMock();

export const ComponentOnly: Story = () => {
    return (
        <div style={{ background: '#2f3036', height: "600px", padding: "20px" }}>
            <Search filterList={SEARCH_FILTER_METADATA}
                    initSearchData={SAMPLE_EMPTY_FILTER} />
        </div>
    )
};

export const NoCriteria: Story = () => {
    return (
        <div style={{ background: '#2f3036', height: "100vh" }}>
            <InnerPage header={<PageHeader title="Search" />} fullHeight>
                <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_EMPTY_FILTER} />
            </InnerPage>
        </div>
    )
};


export const SomeResults: Story = () => (
    <div style={{ background: '#2f3036', height: "100vh" }}>
        <CallbackHook
            setup={() => app.sharedState.set("mock_search_result", SAMPLE_SEARCH_RESULTS)}
            cleanup={() => app.sharedState.set("mock_search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />} fullHeight>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER} />
        </InnerPage>
    </div>
);

export const LotsOfResults: Story = () => (
    <div style={{ background: '#2f3036', height: "100vh" }}>
        <CallbackHook
            setup={() => app.sharedState.set("mock_search_result", SAMPLE_MANY_SEARCH_RESULTS)}
            cleanup={() => app.sharedState.set("mock_search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />} fullHeight>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER} />
        </InnerPage>
    </div>
);


export const EmptyResults: Story = () => (
    <div style={{ background: '#2f3036', height: "100vh" }}>
        <CallbackHook
            setup={() => {
                app.sharedState.set("mock_search_result", [])
            }}
            cleanup={() => {
                app.sharedState.set("mock_search_result", null)
            }}
        />
        <InnerPage header={<PageHeader title="Search" />} fullHeight>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER2} />
        </InnerPage>
    </div>
);

export const ClusteredResults: Story = () => (
    <div style={{ background: '#2f3036', height: "100vh" }}>
        <CallbackHook
            setup={() => app.sharedState.set("mock_search_result", SAMPLE_SEARCH_RESULTS_CLUSTERED)}
            cleanup={() => app.sharedState.set("mock_search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />} fullHeight>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER} />
        </InnerPage>
    </div>
);

const SAMPLE_SEARCH_RESULTS : SearchQueryItem[] = [{
    dn: 'root/logic/ns-[addr]/app-[gprod-addr-main-app]'
}, {
    dn: 'root/logic/ns-[kube-system]'
}];

const SAMPLE_MANY_SEARCH_RESULTS : SearchQueryItem[] = [{
    dn: 'root/logic/ns-[addr]/app-[gprod-addr-main-app]'
}, {
    dn: 'root/logic/ns-[kube-system]'
}];
for(let i = 0; i < 200; i++) {
    SAMPLE_MANY_SEARCH_RESULTS.push({
        dn: `root/logic/ns-[kube-system]/app-[${i}]`
    })
}


const SAMPLE_SEARCH_RESULTS_CLUSTERED = [{
    dn: 'root/logic/ns-[addr]/app-[gprod-addr-main-app]',
    clusterId: '1234'
}, {
    dn: 'root/logic/ns-[kube-system]',
    clusterId: '5678'
}];


const SAMPLE_EMPTY_FILTER : SearchData = {
    components: {
    }
}

const SAMPLE_KIND_FILTER : SearchData = {
    components: {
        kind: {
            searchId: "kind",
            defaultFilter: null,
            filters: {
                app: {
                    searchId: "kind",
                    filterId: "app",
                    caption: "Application",
                    value: true,
                    isEnabled: true
                }
            }
        }
    }
}

const SAMPLE_KIND_FILTER2 : SearchData = {
    components: {
        kind: {
            searchId: "kind",
            defaultFilter: null,
            filters: {
                app: {
                    searchId: "kind",
                    filterId: "cont",
                    caption: "Container",
                    value: true,
                    isEnabled: true
                }
            }
        }
    }
}