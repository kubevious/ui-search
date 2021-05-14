import React, { FC, useState } from 'react';
import { FilterComponentProps } from '../types';
import { useSharedState } from '@kubevious/ui-framework';
import classnames from 'classnames';
import { MarkerPreview } from '@kubevious/ui-rule-engine'

import styles from '../styles.module.css';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';

export const FilterSearchMarkers: FC<FilterComponentProps> = ({ data, addFilter, removeFilter }) => {
    const [markers, setMarkers] = useState<MarkerConfig[]>([]);

    useSharedState((sharedState) => {
        sharedState.set('need_markers_list', true);

        sharedState.subscribe('markers_list', (markers_list) => {
            setMarkers(markers_list || []);
        });

        return () => {
            sharedState.set('need_markers_list', false);
        };
    });

    const markerFilterChange = (title: string): void => {
        const newMarker = markers.find((marker) => marker.name === title);

        if (!newMarker || !newMarker.name) {
            return;
        }

        addFilter(newMarker.name, `Marker ${newMarker.name}`, true);
    };

    const handleMarkerFilterChange = (title: string): void => {
        const isActive = data.filters[title];

        isActive ? removeFilter(title) : markerFilterChange(title);
    };

    return (
        <div className={styles.innerItems}>
            {markers.map((item) => {
                const name = item.name || '';
                return (
                    <button
                        title={name}
                        key={name}
                        className={classnames({ [styles.selectedFilter]: data.filters[name] })}
                        onClick={() => handleMarkerFilterChange(name)}
                    >
                        <MarkerPreview shape={item.shape} color={item.color} />
                        {name}
                    </button>
                );
            })}
        </div>
    );
};
