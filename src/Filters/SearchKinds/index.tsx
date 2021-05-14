import React, { FC, useState, useEffect } from 'react';
import { KindListValue } from './types';
import _ from 'lodash';
import { FilterComponentProps } from '../types';
import { KIND_TO_USER_MAPPING } from '@kubevious/helpers/dist/docs';
import { Checkbox } from '@kubevious/ui-components';

import styles from '../styles.module.css';

export const FilterSearchKinds: FC<FilterComponentProps> = ({ data, addFilter, removeAllFilters }) => {
    const selectedKinds = data.filters;

    const [kinds, setKinds] = useState<KindListValue[]>([]);
    const getKindsList = (): void => {
        const kindsArray = Object.entries(KIND_TO_USER_MAPPING);
        let newKindsArray = kindsArray ? kindsArray.map(([key, value]) => ({ title: value, payload: key })) : [];
        newKindsArray = _.orderBy(newKindsArray, (x: KindListValue) => x.title) || [];
        setKinds(newKindsArray || []);
    };

    useEffect(() => {
        getKindsList();
    }, []);

    const kindFilterChange = (title: string, payload: string, e: React.ChangeEvent): void => {
        removeAllFilters(e);

        if (!selectedKinds[payload]) {
            addFilter(payload, title, true);
        }
    };

    return (
        <div className={styles.innerItems}>
            {kinds.map((item, index) => (
                <div className={styles.itemBlock} key={index}>
                    <Checkbox
                        label={item.title || ''}
                        checked={!!selectedKinds[item.payload]}
                        onChange={(e) => kindFilterChange(item.title, item.payload, e)}
                    />
                </div>
            ))}
        </div>
    );
};
