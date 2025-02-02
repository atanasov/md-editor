<script lang="ts">
  import { onMount } from "svelte";
  
  import hotkeys from 'hotkeys-js';

  import type {TreeItemData} from "@/types/types";
  import { window, os, app, filesystem } from '@neutralinojs/lib';
  import { createDesktopAPI } from './../../desktop/DesktopFactory';
  import type { DesktopAPI } from './../../desktop/DesktopAPI';

	// components
  import { PaneGroup, Pane, PaneResizer } from "paneforge";

  import TipTapEditor from "$lib/components/TipTapEditor.svelte";
  import ContextMenu from "$lib/components/ContextMenu.svelte";
  import TreeView from "$lib/components/TreeView.svelte";
  import MainLayout from "$lib/layouts/MainLayout.svelte";
	import Menubar from "$lib/components/Menubar.svelte";
	import Icon from "$lib/components/Icon.svelte";
	import Statusbar from "$lib/components/Statusbar.svelte";
	import Button from "$lib/components/Button.svelte";
	import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
  import ModalForm from "$lib/components/ModalForm.svelte";
  // states
  import { Tree } from "$lib/state/tree.svelte";
  import { Editor } from "$lib/state/editor.svelte";
  import { Settings } from "$lib/state/settings.svelte";
	
	
  // initial state
  const treeView = new Tree();
  const contentData = new Editor();
  const settings = new Settings();

  // const carta = new Carta();
  // let editor: Editor | undefined = $state();
  let mainMenuVisible: boolean = $state(false);
  let treeMenuVisible: boolean = $state(false);
  let mouse: {x: number, y: number}  = $state({ x: 0, y: 0 });
  let zoomFactor = $derived(Math.pow(1.2,settings.data.zoomLevel));
  let mousePosition: { x: number, y: number } = $derived({ 
    x: mouse.x / zoomFactor, 
    y: mouse.y / zoomFactor
   });
  let treeMenuStyle = $derived(`top: ${mousePosition?.y}px; left: ${mousePosition?.x}px`);
  let menuStyle = $derived(`bottom: 3rem; left: 0px`);
  // Desktop API
  const desktopAPI: DesktopAPI = createDesktopAPI('neutralino'); // Choose the adapter here
  // Set Menus
  const menu = [
    { label: "Open Folder", action: "open-folder", icon: "open-folder" },
    // { label: "Settings", action: "settings", icon: "settings" },
    { label: "About", action: "about", icon: "about" },
    { label: "Exit", action: "exit", icon: "exit" },
  ];
  const treeMenu = [
    { label: "New Folder", action: "new-folder", icon: "new-folder" },
    { label: "New File", action: "new-file", icon: "new-file" },
    { label: "Rename", action: "edit", icon: "edit" },
    { label: "Delete", action: "trash", icon: "trash" },
  ];

  interface FormData {
    name: string;
    email: string;
  }

  let isOpen = $state(false);
  let formData: FormData = {
    name: '',
    email: ''
  };

  function handleSubmit(): void {
    console.log('Form submitted:', formData);
    // Add API call or form handling logic here
  }


  $effect(() => {
    // focus editable item
    const editableItem = treeView.tree.find(item => item.editable);
    if (editableItem) {
      const element = document.getElementById(editableItem.path);
      if (element) {
        const inputElement = element.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }
    }
  });

  async function init() {
    let settingsData = await desktopAPI.loadSettings();
    desktopAPI.debug(JSON.stringify(settingsData));
    settings.loadSettings(settingsData);
    desktopAPI.debug(JSON.stringify(settingsData));

    const isDarkMode = await desktopAPI.isDarkMode();
    let systemTheme: "dark" | "light" = isDarkMode ? 'dark' : 'light';
    if (settings.data.theme) {
      if (settings.data.theme !== systemTheme) {
        settings.data.theme = systemTheme;
        await desktopAPI.saveSettings(settings.data);
      }
      setTheme(settings.data.theme);
    }

    if (settings.data.folder != '') {
      treeView.tree = await desktopAPI.openFolder(settings.data.folder,['md','txt']);
      treeView.selectedPath = settings.data.folder;
      treeView.rootPath = settings.data.folder;
    }

    if (settings.data.lastFile) {
      treeView.selectNodeByPath(settings.data.lastFile);
      await loadFile(settings.data.lastFile);
    }
  }

  const keymap = {
    "Save": "Command+S",
    "Open": "Command+O",
    "Close": "Command+W",
    "ZoomIn": "Command+=",
    "ZoomOut": "Command+-",
  };

  // Handlers for each action
  async function handleSave() {
    await desktopAPI.debug('Save triggered');
  }

  async function handleOpen() {
    await desktopAPI.debug('Open triggered');
  }

  async function handleClose() {
    await desktopAPI.debug('Close triggered');
  } 

  async function handleZoomIn() {
    await desktopAPI.debug('ZoomIn triggered');
    settings.zoomIn(0.5);
  }

  async function handleZoomOut() {
    await desktopAPI.debug('ZoomOut triggered');
    settings.zoomOut(0.5);
  }


  // Map of handlers
  const handlers: Record<string, () => void> = {
    Save: handleSave,
    Open: handleOpen,
    Close: handleClose,
    ZoomIn: handleZoomIn,
    ZoomOut: handleZoomOut,
  };

  function handleGlobalHotkeys(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === '=') {
      event.preventDefault();
      handleZoomIn();
    } else if ((event.metaKey || event.ctrlKey) && event.key === '-') {
      event.preventDefault();
      handleZoomOut();
    }
  }

  function handleContextMenu(event: MouseEvent) {
    treeMenuVisible = true;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    // console.log("Right-click at:", mouseX, mouseY);
  }
  // document.addEventListener("contextmenu", (event) => {
  //     // event.preventDefault(); // Prevent the default context menu
  //     mouse.x  = event.clientX;
  //     mouse.y = event.clientY;

  //     // console.log("Right-click at:", mouseX, mouseY);
  //   });

  onMount(async () => {
    // listen for global hotkeys
    document.addEventListener('keydown', handleGlobalHotkeys);
    // listen for global mouse events
    document.addEventListener('click', (event) => {
      // if visible and click is not on menu button, hide the menu
      if (mainMenuVisible && !(event.target as Element).closest('#menu-btn')) {
        mainMenuVisible = false;
      }
      if (treeMenuVisible) {
        treeMenuVisible = false;
      }
    });

    document.addEventListener("contextmenu", (event: any) => {
      // make this work only on treeview
      console.log(event.target);
      mouse.x  = event.clientX;
      mouse.y = event.clientY;
    });
    // Wait for DOM to be ready and then initialize the editor
    // await init();
    Object.entries(keymap).forEach(([action, shortcut]) => {
      if (handlers[action]) {
        hotkeys(shortcut, (event) => {
          event.preventDefault(); // Prevent default behavior
          handlers[action](); // Call the corresponding handler
        });
      }
    });

    // Cleanup on component destruction
    return () => {
      document.removeEventListener('keydown', handleGlobalHotkeys);
      Object.values(keymap).forEach((shortcut) => {
        hotkeys.unbind(shortcut);
      });
    };
  });
  init();

  async function treeMenuItemClick(item: { label?: string; action: any; }) {
    if (item.action == 'new-folder') {
      newFolder();
    } else if (item.action == 'new-file') {
      newFile();
    } else if (item.action == 'edit') {
      editItem();
    } else if (item.action == 'trash') {
      removeItem();
    }
    treeMenuVisible = false;
  }

  async function menuItemClick(item: { label?: string; action: any; }) {
    if (item.action == 'open-folder') {
      let path = await desktopAPI.openFolderDialog();
      let files = await desktopAPI.openFolder(path, ['md','txt']);
      if (files) {
        treeView.tree = files;
        treeView.rootPath = path;
        settings.data.folder = path;
        await desktopAPI.saveSettings(settings.data);
      }
      contentData.resetContent();
    } else if (item.action == 'exit') {
      await desktopAPI.saveSettings(settings.data);
      app.exit(0).catch(console.error);
    } else if (item.action == 'about') {
      mainMenuVisible = false;
      await desktopAPI.showMessageBox('About', 'NeoMD - Markdown Editor\n Version: 0.1.0');
    }
    mainMenuVisible = false;
  }

  async function handleUpdateItem(path: string, operation: string, item?: TreeItemData): Promise<void> {
    treeMenuVisible = false;
    let treeItem = treeView.findNodeByPath(path);
    desktopAPI.debug('Update Item - Path: ' + path + ' Operation: ' + operation + ' Item : ' + JSON.stringify(item));
    // desktopAPI.debug('Found treeItem: ' + JSON.stringify(treeItem));
    if (path == "" && operation == 'select') {
        treeView.unselectNodes();
        treeView.selectedPath = settings.data.folder;
        await desktopAPI.debug('Unselect all nodes');
        return;
    }
    if (path == "" && operation == 'contextmenu') {
      desktopAPI.debug('Context Menu: ' + path);
        // treeView.unselectNodes();
        // treeView.selectedPath = settings.data.folder;
        treeMenuVisible = true;
        // return;
    }
    if (treeItem) {
      const type = treeItem.type;
      const name = treeItem.name;
      if (operation === 'contextmenu') {
        desktopAPI.debug('Context Menu: ' + path);
        treeMenuVisible = true;
        if (type == 'file') {
          await loadFile(path);
          settings.data.lastFile = path;
          await desktopAPI.saveSettings(settings.data);
        } else if (type === 'folder') {
          // treeView.toggleNodeByPath(path);
        }
        treeView.selectNodeByPath(path);
      }
      if (operation === 'select') {
        if (type == 'file') {
          await loadFile(path);
          settings.data.lastFile = path;
          await desktopAPI.saveSettings(settings.data);
        } else if (type === 'folder') {
          treeView.toggleNodeByPath(path);
        }
        treeView.selectNodeByPath(path);
      }
      if (operation == 'create' && item) {
        await desktopAPI.debug('CREATE ITEM: ' + item.path + ' type: ' + item.type +  ' ' +type);
        if (type == 'file') {
          desktopAPI.createFile(item.path, '');
          treeView.updateNodeByPath(item.path, item);
        } else if (type == 'folder') {
          desktopAPI.createFolder(item.path);
          treeView.updateNodeByPath(item.path, item);
        }
        // desktopAPI.debug('Create item: ' + item.path + ' type: ' + item.type);
        // treeItem.editable = false;
      } else if (operation == 'rename' && item) {
        treeView.renameNodeByPath(item.path, item.name);
        await desktopAPI.debug("RENAME :" + treeItem.path  + ' => ' + item.path);
        const result = await desktopAPI.move(treeItem.path, item.path);
        await reloadTreeView();
      } else if (operation == 'delete') {
        treeView.removeNodeByPath(treeItem.path);
        await desktopAPI.remove(treeItem.path);
        // delete item
      } else if (operation == 'cancel') {
        treeItem.editable = false;
      }
    }
  }

  async function loadFile(path: string): Promise<void> {
    let fileData = await desktopAPI.openFile(path);
    contentData.setContent(path, fileData);
    settings.data.lastFile = path;
    await window.setTitle(`NeoMD - ${contentData.content.name}`);
  }

  async function setTheme(theme: string): Promise<void> {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }

  async function switchTheme() {
    settings.toggleTheme();
    setTheme(settings.data.theme);
    await desktopAPI.saveSettings(settings.data);
  }

  async function newFile() {
    treeView.addNodeToParentPath(treeView.selectedPath, 'file');
  }

  function newFolder() {
    treeView.addNodeToParentPath(treeView.selectedPath, 'folder');
  }

  async function reloadTreeView() {
    treeView.tree = await desktopAPI.openFolder(settings.data.folder, ['md','txt']);
    treeView.selectedPath = settings.data.folder;
    treeView.rootPath = settings.data.folder;
    if (settings.data.lastFile) {
      treeView.selectNodeByPath(settings.data.lastFile);
    }
  }

  function editItem() {
    const editableItem = treeView.selectedItemPath ? treeView.findNodeByPath(treeView.selectedItemPath) : null;
    if (editableItem) {
      treeView.updateNodeByPath(editableItem.path, { ...editableItem, editable: true });
    }
  }

  function removeItem() {
    const selectedNode = treeView.selectedItemPath ? treeView.findNodeByPath(treeView.selectedItemPath) : null;
    if (selectedNode) {
      treeView.removeNodeByPath(selectedNode.path);
      desktopAPI.remove(selectedNode.path);
    }
  }

  async function handleUpdateContent(content: string) {
    await desktopAPI.debug('Update Content: ' + content);
    await desktopAPI.saveFile(treeView.selectedItemPath, content);
  }

</script>

<main style="zoom: {zoomFactor}">
<MainLayout>
    <Menubar>
      <div class="join">
        <Button onclick={newFile} className={settings.sidebarClass}><Icon name="new-file"></Icon></Button>
        <Button onclick={newFolder} className={settings.sidebarClass}><Icon name="new-folder"></Icon></Button>
        <Button onclick={reloadTreeView} className={settings.sidebarClass}><Icon name="reload"></Icon></Button>
        <Button onclick={() => settings.toggleSidebar()}><Icon name="3bars"></Icon></Button>
      </div>
    </Menubar>
    <div class="flex-1 min-h-0 overflow-auto">
      <PaneGroup direction="horizontal">
        <Pane
          defaultSize={20}
          minSize={20}
          style="overflow:auto"
          class="transform transition-transform duration-300 ease-in-out {settings.sidebarClass}" 
          >
          <TreeView data={treeView.tree} 
            onupdateitem={handleUpdateItem}
            />
        </Pane>
        <PaneResizer class="w-2 hover:bg-base-300 {settings.sidebarClass}" />
        <Pane defaultSize={85} class=" overflow-scroll">
          {#if Object.keys(contentData.content.frontmatter).length > 0}

          {/if}
          {#if contentData.content.markdown}
            <TipTapEditor content={contentData.content.markdown} theme={settings.data.theme} updateContent={handleUpdateContent} />
          {/if}
        </Pane>
      </PaneGroup>
    </div>

    <Statusbar>
      <Button id="menu-btn" onclick={ (event: MouseEvent)=>  { event.preventDefault(); mainMenuVisible = !mainMenuVisible;} }>
        <Icon name="settings" />
      </Button>
      <!-- <button
      onclick={() => (isOpen = true)}
      class="m-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
      Open Modal Form
      </button> -->
      <div class="flex-1 text-center">
        {mainMenuVisible}
        <!-- {mouse.x}, {mouse.y}  {settings.data.zoomLevel} -->
        <!-- {mousePosition.x}, {mousePosition.y} -->
        <!-- {contentData.content.markdown?.slice(0, 50)} -->
      </div>
      <ThemeSwitcher theme={settings.data.theme} {switchTheme} />
    </Statusbar>

    <ModalForm
  title="Contact Form"
  isOpen={isOpen}
  handleSubmit={handleSubmit}
  overlayClass="bg-black/75"
  modalClass="bg-gray-50"
>
  <div class="space-y-4">
    <div>
      <label class="block mb-1">Name</label>
      <input
        class="w-full border rounded p-2"
        bind:value={formData.name}
      />
    </div>
    <div>
      <label class="block mb-1">Email</label>
      <input
        type="email"
        class="w-full border rounded p-2"
        bind:value={formData.email}
      />
    </div>
  </div>
</ModalForm>
  </MainLayout>
  <ContextMenu
  id="main-menu"
  triggerId="menu-btn"
  items={menu}
  {menuItemClick}
  isVisible={mainMenuVisible}
  style={menuStyle}
  alignment={{
    type: 'object',
    target: 'menu-btn',
    align: 'top',
    offset: { x: 0, y: -2 }
  }}
/>
  <ContextMenu
      id="tree-view-menu"
      triggerId="tree-view"
      items={treeMenu}
      menuItemClick={treeMenuItemClick}
      isVisible={treeMenuVisible}
      style={treeMenuStyle}
      alignment={{
        type: 'mouse',
        target: 'tree-view',
        // position: {x: mouse.x, y: mouse.y},
        
        // position: {x: mousePosition.x, y: mousePosition.y},
        // offset: { x: 0, y: 0 },
      }}
    />
</main>

<style>

</style>
