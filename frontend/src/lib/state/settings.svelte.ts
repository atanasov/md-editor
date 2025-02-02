import type { SettingsData } from "@/types/types";

export class Settings {
    data: SettingsData = $state({
        theme: "light", 
        folder: "", 
        lastFile: "", 
        showSidebar: true,
        zoomLevel: 1
    });
    sidebarClass = $derived(this.data.showSidebar ? "" : "hidden");

    async loadSettings(settingsData: SettingsData): Promise<void> {
        this.data = {
            theme: settingsData.theme ?? "light",
            folder: settingsData.folder ?? "",
            lastFile: settingsData.lastFile ?? "",
            showSidebar: settingsData.showSidebar ?? true,
            zoomLevel: settingsData.zoomLevel ?? 1
        };
    }

    zoomIn(value: number) {
        // if (this.data.zoomLevel) {
            this.data.zoomLevel += value;
        // }
    }

    zoomOut(value: number) {
        // if (this.data.zoomLevel) {
            this.data.zoomLevel -= value;
        // }
    }

    toggleTheme() {
        this.data.theme = this.data.theme === "light" ? "dark" : "light";
    }

    toggleSidebar() {
        this.data.showSidebar = !this.data.showSidebar;
    }
}