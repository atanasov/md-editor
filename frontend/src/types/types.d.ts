// src/types.ts

export type TreeItemType = 'file' | 'folder';

export interface TreeItemData {
  path: string;
  name: string;
  file?: string; // Only present if type is 'file'
  parentPath: string;
  type: TreeItemType;
  children?: TreeItemData[]; // Only present if type is 'folder'
  editable?: boolean; // Only present if type is 'file'
  expanded?: boolean; // Only present if type is 'folder'
  selected?: boolean; // Selected Item
}

export interface EditorData {
  name: string;
  markdown: string | undefined;
  frontmatter: Record<string, any>;
}

export interface SettingsData {
  zoomLevel: number;
  theme: "dark" | "light";  // Union type for theme, restricts to "dark" or "light"
  folder: string;           // Path as a string
  lastFile: string;         // Path as a string
  showSidebar: boolean;     // Boolean value
}

// {
//  "Save": "Command+S",
//  "Open": "Command+O"
// }
export interface KeymapData {
  [key: string]: string;
}

export type KnownPath = "config" | "data" | "cache" | "documents" | "pictures" | "music" | "video" | "downloads" | "savedGames1" | "savedGames2" | "temp";