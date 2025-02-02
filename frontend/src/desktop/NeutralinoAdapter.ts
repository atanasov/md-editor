// NeutralinoAdapter.ts
import { os, computer, filesystem, debug } from '@neutralinojs/lib';
import type { DesktopAPI } from './DesktopAPI';
import type { SettingsData, TreeItemData, KeymapData } from '@/types/types';
import { decodeHtmlEntities } from '@/utils/helper';

export class NeutralinoAdapter implements DesktopAPI {
    private async getConfigPath(): Promise<string> {
        let osInfo = await computer.getOSInfo();
        let dataPath = await os.getPath("data");
        let configPath: string;

        switch (osInfo.name) {
            case 'Windows_NT':
                configPath = `${dataPath}\\NewMD\\config.json`;
                break;
            case 'Darwin':
            case 'Linux':
                configPath = `${dataPath}/NewMD/config.json`;
                break;
            default:
                throw new Error('Unsupported OS');
        }
        return configPath;
    }

    private async getKeymapPath(): Promise<string> {
        let osInfo = await computer.getOSInfo();
        let dataPath = await os.getPath("data");
        let configPath: string;

        switch (osInfo.name) {
            case 'Windows_NT':
                configPath = `${dataPath}\\NewMD\\keymap.json`;
                break;
            case 'Darwin':
            case 'Linux':
                configPath = `${dataPath}/NewMD/keymap.json`;
                break;
            default:
                throw new Error('Unsupported OS');
        }
        return configPath;
    }

    private async getDirSeparator() {
        let osInfo = await computer.getOSInfo();
        if (osInfo.name == 'Windows_NT') {
            return '\\';
        }
        return '/';
    }

    async loadSettings(): Promise<any> {
        let configPath = await this.getConfigPath();
        this.debug("Loading settings from " + configPath);
        let settings = { theme: "light", folder: "", lastFile: "", showSidebar: true };
        try {
            let data = await filesystem.readFile(configPath);
            settings = JSON.parse(data);
        } catch {
            await this.debug("Config file not found. Creating a default config.");
        }
        await this.debug("Settings loaded from " + configPath + " : " + JSON.stringify(settings, null, 2));
        return settings;
    }

    async saveSettings(settings: SettingsData): Promise<void> {
        let configPath = await this.getConfigPath();
        await this.saveFile(configPath, JSON.stringify(settings, null, 2));
        await this.debug("Settings saved in " + configPath + " : " + JSON.stringify(settings));
    }

    async loadKeymap(): Promise<string> {
        return '';
    }

    async saveKeymap(keymap: KeymapData): Promise<void> {
    }
    
    async openFolder(path: string, exts: string[]): Promise<TreeItemData[]> {
        const files = await filesystem.readDirectory(path);
        return (
            await Promise.all(
                files.map(
                    async (file) => {
                        // decode &amp; &lt; &gt; &quot; &apos;
                        const entryName = decodeHtmlEntities(file.entry);
                        if (file.type === "DIRECTORY") {
                            const children = await this.openFolder(`${path}/${file.entry}`, exts);
                            return {
                                path: path + "/" + file.entry,
                                name: entryName,
                                file: file.entry,
                                parentPath: path,
                                type: "folder",
                                children: children,
                                editable: false,
                                expanded: true
                            };
                        } else {
                            const isValid = exts.some((ext) => file.entry.endsWith(`.${ext}`));
                            if (!isValid) return null; 
                            // urldecode name
                            
                            return {
                                path: path + "/" + file.entry,
                                name: entryName.replace(/\.[^/.]+$/, ""), // Remove file extension
                                file: file.entry,
                                parentPath: path,
                                type: "file",
                                children: [],
                                editable: false,
                                expanded: false
                            };
                        }
                    }
                )
            )
        ).filter(Boolean) as TreeItemData[]; // Filter out `null` values
    }

    async openFolderDialog(): Promise<string> {
        let result = await os.showFolderDialog('Open directory');
        return result || "";
    }

    async createFolder(path: string): Promise<void> {
        let result = await filesystem.createDirectory(path);
    }
    
    async createFile(path: string, data: string): Promise<void> {
        await this.debug('CREATE FILE '+path);
        let result = await filesystem.writeFile(path, data)
    }

    async openFile(path: string): Promise<string> {
        let result = null;
        try {
            result = await filesystem.readFile(path);
        } catch (error) {
            console.log(error);
        }
        return result || "";
    }

    async saveFile(path: string, data: string): Promise<void> {
        await filesystem.writeFile(path, data);
    }

    async checkPath(path: string): Promise<boolean> {
        try {
            let stats = await filesystem.getStats(path);
            console.log(stats);
            // if (stats.isDirectory()) {
            //     return {
            //         id: crypto.randomUUID(),
            //         name: path.split(await this.getDirSeparator()).pop() || "",

            //     }
            // }
            return true;
        } catch (error) {
            console.log(error);
            return false;            
        }
    }

    async move(source: string, destination: string): Promise<void> {
        await filesystem.move(source, destination);
    }
    async remove(path: string): Promise<void> {
        await filesystem.remove(path);
    }

    async debug(message: string): Promise<void> {
        await debug.log(message);
    }

    async exec(command: string): Promise<os.ExecCommandResult> {
        return await os.execCommand(command);
    }

    async isDarkMode(): Promise<boolean> {
        const result: os.ExecCommandResult = await this.exec('defaults read -g AppleInterfaceStyle');
        const mode = result.stdOut.trim()
        return mode === 'Dark' ? true : false;      
    }

    async showMessageBox(title: string, content: string): Promise<void> {
        await os.showMessageBox(
            title,
            content
        );
    }
}