import { InnerPage, PageHeader } from '@kubevious/ui-components';
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

export const Default: Story = () => (
    <div style={{ background: '#2f3036' }}>
        <InnerPage header={<PageHeader title="Search" />}>
            <Search filterList={SEARCH_FILTER_METADATA} />
        </InnerPage>
    </div>
);
