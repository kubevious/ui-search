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
import { Search } from '../Search';
import { FilterMetaData, SearchData } from '../types';

import { app } from '@kubevious/ui-framework';

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

export const NoCriteria: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_EMPTY_FILTER} />
        </InnerPage>
    </div>
);


export const SomeResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => app.sharedState.set("mock_search_result", SAMPLE_SEARCH_RESULTS)}
            cleanup={() => app.sharedState.set("mock_search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER} />
        </InnerPage>
    </div>
);

export const EmptyResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => {
                app.sharedState.set("mock_search_result", [])
            }}
            cleanup={() => {
                app.sharedState.set("mock_search_result", null)
            }}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER2} />
        </InnerPage>
    </div>
);

export const ClusteredResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => app.sharedState.set("mock_search_result", SAMPLE_SEARCH_RESULTS_CLUSTERED)}
            cleanup={() => app.sharedState.set("mock_search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} initSearchData={SAMPLE_KIND_FILTER} />
        </InnerPage>
    </div>
);

const SAMPLE_SEARCH_RESULTS = [{
    dn: 'root/ns-[addr]/app-[gprod-addr-main-app]'
}, {
    dn: 'root/ns-[kube-system]'
}];



const SAMPLE_SEARCH_RESULTS_CLUSTERED = [{
    dn: 'root/ns-[addr]/app-[gprod-addr-main-app]',
    clusterId: '1234'
}, {
    dn: 'root/ns-[kube-system]',
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