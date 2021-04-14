import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { Search } from '../src';

const renderComponent = () => render(<Search filterList={[]} />);

describe('Search', () => {
    test('should check that the component Search is rendered', async () => {
        const { findByTestId } = renderComponent();

        const searchComponent = await findByTestId('search');

        expect(searchComponent).toBeTruthy();
    });
});
