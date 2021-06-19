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
import { FilterMetaData } from '../types';

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
            <Search filterList={SEARCH_FILTER_METADATA} />
        </InnerPage>
    </div>
);


export const SomeResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => app.sharedState.set("search_result", SAMPLE_SEARCH_RESULTS)}
            cleanup={() => app.sharedState.set("search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} />
        </InnerPage>
    </div>
);

export const EmptyResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => app.sharedState.set("search_result", [])}
            cleanup={() => app.sharedState.set("search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} />
        </InnerPage>
    </div>
);

export const ClusteredResults: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <CallbackHook
            setup={() => app.sharedState.set("search_result", SAMPLE_SEARCH_RESULTS_CLUSTERED)}
            cleanup={() => app.sharedState.set("search_result", null)}
        />
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} />
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