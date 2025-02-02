  import type { TreeItemData } from './types';  
  export interface IFileOperations {
    openFolder(path: string): Promise<TreeItemData[]>;
    openFile(path: string): Promise<string>;
    saveFile(path: string, content: string): Promise<void>;
  }
  
  export interface ISettingsOperations {
    loadSettings(): Promise<Record<string, any>>;
    saveSettings(settings: Record<string, any>): Promise<void>;
  }