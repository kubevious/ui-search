import _ from 'the-lodash';
import { app } from '@kubevious/ui-framework';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';

export const MARKER_FOO = 'foo';
export const MARKER_BAR = 'bar';

const SHAPE_OPTIONS = [ 'f164', 'f135', 'f165' ];
const COLOR_OPTIONS = [ '#D5CEC2', '#11E7E9' ];

export function mockMarkerData()
{
    const MARKER_LIST : MarkerConfig[] = [];
    const MARKERS_DICT = _.makeDict(MARKER_LIST, x => x.name, x => x);
    
    for(let i = 0; i <= 20; i++)
    {
        MARKER_LIST.push({
            name: `marker ${i}`,
            shape: SHAPE_OPTIONS[i % SHAPE_OPTIONS.length],
            color: COLOR_OPTIONS[i % COLOR_OPTIONS.length],
            propagate: false
        })
    }
    
    app.sharedState.set('markers_list', MARKER_LIST);
    app.sharedState.set('markers_dict', MARKERS_DICT);
}