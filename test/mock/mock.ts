import { app } from '@kubevious/ui-framework';
import { SearchService } from './search-service';
import { mockMarkerData } from './markers'

export function setupMock(): void {
    mockMarkerData();

    app.registerService({ kind: 'search' }, () => {
        return new SearchService();
    });
}
