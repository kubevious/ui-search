import React, { FC, useState } from 'react';
import { FilterComponentProps } from '../types';
import { useSharedState } from '@kubevious/ui-framework';
import { Checkbox, MarkerPreview, ScrollbarComponent } from '@kubevious/ui-components';

import styles from '../styles.module.css';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';

export const FilterSearchMarkers: FC<FilterComponentProps> = ({ data, addFilter, removeFilter }) => {
    const [markers, setMarkers] = useState<MarkerConfig[]>([]);

    useSharedState((sharedState) => {
        sharedState.markUserFlag('need_markers_list', 'search-page');

        sharedState.subscribe('markers_list', (markers_list) => {
            setMarkers(markers_list || []);
        });

        return () => {
            sharedState.clearUserFlag('need_markers_list', 'search-page');
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
        <ScrollbarComponent style={{ height: '200px' }}>
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
        </ScrollbarComponent>
    );
};
