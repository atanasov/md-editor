// DesktopFactory.ts
import type { DesktopAPI } from './DesktopAPI';
import { NeutralinoAdapter } from './NeutralinoAdapter';
// Add imports for other adapters like TauriAdapter or ElectronAdapter when needed.

export function createDesktopAPI(adapterName: string): DesktopAPI {
    switch (adapterName) {
        case 'neutralino':
            return new NeutralinoAdapter();
        // case 'tauri':
        //     return new TauriAdapter();
        // case 'electron':
        //     return new ElectronAdapter();
        default:
            throw new Error(`Unsupported adapter: ${adapterName}`);
    }
}