import React, { FC } from 'react';
import _ from 'lodash';
import { FilterComponentProps } from '../types';
import { TOP_ROOTS, NODE_LABELS, NodeKind } from '@kubevious/entity-meta';
import { DnComponent, DnIconComponent } from '@kubevious/ui-components';
import { Checkbox } from '@kubevious/ui-components';

import commonStyles from '../styles.module.css';
import styles from './styles.module.css';

export const FilterSearchKinds: FC<FilterComponentProps> = ({ data, addFilter, removeAllFilters }) => {
    const selectedKinds = data.filters;

    const kindFilterChange = (kind: NodeKind, e: React.ChangeEvent): void => {
        removeAllFilters(e);

        if (!selectedKinds[kind]) {
            addFilter(kind, NODE_LABELS.get(kind), true);
        }
    };

    return (
        <div className={commonStyles.innerItems}>
            {TOP_ROOTS.map((root, index) => (
                <div key={index}>
                    <DnComponent dn={root.dn} />

                    <div className={styles.kindList}>
                        {root.subNodes.map((kind, index) => (
                            <div className={styles.itemBlock} key={index}>
                                <Checkbox
                                    label={
                                        <div className={styles.nodeKind}>
                                            <DnIconComponent dnParts={[{rn: '', kind: kind, name: null }]} size="xs" />
                                            <span className={styles.textWrapper}>{NODE_LABELS.get(kind)}</span>
                                        </div>
                                    }
                                    checked={selectedKinds[kind]?.value ?? false}
                                    onChange={(e) => kindFilterChange(kind, e)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};