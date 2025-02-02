import type { SettingsData, TreeItemData, KeymapData } from "@/types/types";

// DesktopAPI.ts
export interface DesktopAPI {
    loadSettings(): Promise<any>;
    saveSettings(settings: SettingsData): Promise<void>;
    loadKeymap(): Promise<string>
    saveKeymap(keymap: KeymapData): Promise<void>
    openFolder(path: string, exts: string[]): Promise<TreeItemData[]>;
    openFolderDialog(): Promise<string>;
    createFolder(path: string): Promise<void>;
    createFile(path: string, data: string): Promise<void>;
    openFile(path: string): Promise<string>;
    saveFile(path: string, data: string): Promise<void>;
    checkPath(path: string): Promise<boolean>;
    debug(message: string): Promise<void>;
    move(source: string, destination: string): Promise<void>;
    remove(path: string): Promise<void>;
    isDarkMode(): Promise<boolean>;
    showMessageBox(title: string, contesnt: string): Promise<void>;
}