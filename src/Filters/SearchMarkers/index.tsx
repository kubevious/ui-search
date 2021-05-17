import React, { FC, useState } from 'react';
import { FilterComponentProps } from '../types';
import { useSharedState } from '@kubevious/ui-framework';
import { Checkbox, MarkerPreview } from '@kubevious/ui-components';

import styles from '../styles.module.css';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';

export const FilterSearchMarkers: FC<FilterComponentProps> = ({ data, addFilter, removeFilter }) => {
    const [markers, setMarkers] = useState<MarkerConfig[]>([]);

    useSharedState((sharedState) => {
        sharedState.set('need_markers_list', true);

        sharedState.subscribe('markers_list', (markers_list) => {
            setMarkers(
                markers_list || [
                    {
                        name: 'marker 1',
                        shape: 'f164',
                        color: '#FFFFFF',
                        propagate: false,
                    },
                    {
                        name: 'marker 2',
                        shape: 'f164',
                        color: '#FFFFFF',
                        propagate: true,
                    },
                ],
            );
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
            {markers.map((item, index) => {
                const name = item.name || '';
                return (
                    <div className={styles.itemBlock} key={index}>
                        <Checkbox
                            label={
                                <>
                                    <MarkerPreview shape={item.shape} color={item.color} />
                                    <span className={styles.textWrapper}>{name}</span>
                                </>
                            }
                            checked={!!data.filters[name]}
                            onChange={() => handleMarkerFilterChange(name)}
                        />
                    </div>
                );
            })}
        </div>
    );
};
