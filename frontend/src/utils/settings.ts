import { os, computer, filesystem } from '@neutralinojs/lib';

export async function getConfigPath() {
    let osInfo = await computer.getOSInfo();
    let configPath;
    let dataPath = await os.getPath("data");
    switch (osInfo.name) {
        case 'Windows_NT': // Windows
            configPath = dataPath + '\\NewMD\\config.json';
            break;
        case 'Darwin': // macOS
            configPath = dataPath + '/NewMD/config.json';
            break;
        case 'Linux': // Linux
            configPath = dataPath + '/NewMD/config.json';
            break;
        default:
            throw new Error('Unsupported OS');
    }

    return configPath;
}

export async function loadSettings() {
    let configPath = await getConfigPath();

    try {
        let data = await filesystem.readFile(configPath);
        let settings = JSON.parse(data);
        console.log("Settings loaded:", settings);
        return settings;
    } catch (error) {
        console.log("Config file not found. Creating a default config.");
        let defaultSettings = { theme: "light", folder: "", lastFile: "" };
        await saveSettings(defaultSettings);  // Save the default settings
        return defaultSettings;
    }
}

export async function saveSettings(settings: any) {
    let configPath = await getConfigPath();
    let data = JSON.stringify(settings, null, 2); // Beautify JSON with 2 spaces indentation
    console.log(configPath, data);
    await ensureDirectoryExists(configPath);
    await filesystem.writeFile(configPath, data);
    console.log("Settings saved:", settings);
}

export async function ensureDirectoryExists(path:string) {
    try {
        let pathParts = await filesystem.getPathParts(path);
        await filesystem.createDirectory(pathParts.parentPath);
    } catch (error) {
        // if (error.code !== 'EEXIST') {
        //     throw error; // Ignore error if the directory already exists
        // }
    }
}

export async function updateSettings(theme: string, folder: string, lastFile: string) {
    let settings = await loadSettings();

    settings.theme = theme; 
    settings.folder = folder;
    settings.lastFile = lastFile;

    await saveSettings(settings);
}
