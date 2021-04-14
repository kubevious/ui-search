import { app } from '@kubevious/ui-framework';
import { SearchService } from './search-service';

export function setupMock(): void {
    app.registerService({ kind: 'search' }, () => {
        return new SearchService();
    });
}
