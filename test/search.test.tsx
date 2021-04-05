import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { Search } from '../src';

function renderSearch() {
    return render(<Search filterList={[]} />);
}

describe('Search', () => {
    test('Should check that the component Search is rendered', async () => {
        const { findByTestId } = renderSearch();

        const searchComponent = await findByTestId('search');

        expect(searchComponent);
    });
});
