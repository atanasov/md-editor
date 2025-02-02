<script lang="ts">
  import TreeItem from './TreeItem.svelte'; // Recursive import
  import type { TreeItemData } from '../../types/types';
	import Icon from './Icon.svelte';
  
  interface Props {
    item: TreeItemData;
    onupdateitem: (path: string, operation: string, item?: TreeItemData) => void;
  }

  let { item, onupdateitem }: Props = $props();

  let itemName: string = $state(item.name)

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { 
      if (item.type === 'folder') {
        if (itemName != item.name) {
          let path = item.parentPath + '/' + itemName;
          onupdateitem(item.path, 'rename', { ...item, name: itemName, path: path, editable: false });
        } else {
          onupdateitem(item.parentPath, 'create', { ...item, name: itemName, editable: false });
        }
      } else {
        if (itemName != item.name) {
          let path = item.parentPath + '/' + itemName + '.md';
          onupdateitem(item.path, 'rename', { ...item, name: itemName, path: path, editable: false });  
        } else {
          onupdateitem(item.path, 'create', { ...item, name: itemName, editable: false });
        }
      }
    } else if (event.key === 'Escape') { 
      onupdateitem(item.path, 'cancel');
    }
    // if (event.key === 'Enter') {
    //   console.log('Enter key pressed');
    //   // let el: EventTarget | null = event.target as HTMLInputElement;
    //   if (itemName !== item.name) {
    //     let path = item.parentPath + '/' + itemName;
    //     let fileName = itemName;
    //     if (item.type === 'folder') {
    //       path = path;
    //     } else {
    //       path = path + '.md';
    //       fileName = fileName + '.md';
    //     }
        
    //     onupdateitem(item.path, 'create', { ...item, name: itemName, path: path, file: fileName, editable: false });
    //   }
    //   // Add your logic for the Enter key
    // } else if (event.key === 'Escape') {
    //   console.log('Escape key pressed');
    //   onupdateitem(item.path, 'cancel');
    //   // Add your logic for the Escape key
    // }
  }
</script>

<!-- svelte-ignore a11y_role_has_required_aria_props -->
<div style="py-1 px-1" aria-expanded={item.type === 'folder' ? item.expanded : undefined} id={item.path} role="treeitem" aria-selected={item.selected} aria-label={item.name} aria-setsize={item.children ? item.children.length : undefined} tabindex="0">
  {#if item.type === 'folder'}
    <!-- Folder Item -->
    <div role="button" tabindex="0" 
      onclick={(e) => { e.stopPropagation(); onupdateitem(item.path, 'select');}} 
      oncontextmenu={(e) => { e.preventDefault(); onupdateitem(item.path, 'contextmenu'); }}
      onkeydown={(e) => { handleKeyDown(e); }}
      class="flex cursor-pointer py-2 px-3 rounded items-center space-x-2" class:bg-base-300={item.selected === true}>
      {#if item.expanded}
        <Icon name="open-folder"></Icon>
      {:else}
        <Icon name="closed-folder"></Icon>
      {/if}
      {#if item.editable == true}
        <input class="ml-2 w-full border border-gray-500 font-medium"   bind:value={itemName} />
      {:else}
        <span class="ml-1 truncate min-w-0 flex-1">{item.name}</span>
      {/if}
      <!-- <span class="ml-1 font-medium truncate min-w-0 flex-1">{item.name}</span> -->
    </div>
  {:else}
    <!-- File Item -->
    <div role="button" tabindex="0" 
      onclick={(e) => { onupdateitem(item.path, 'select') }} 
      oncontextmenu={(e) => { e.preventDefault(); onupdateitem(item.path, 'contextmenu'); }}
      onkeydown={(e) => { handleKeyDown(e); }}
      class="flex cursor-pointer py-2 px-3 rounded items-center space-x-2" class:bg-base-300={item.selected === true}>
      <Icon name="md-file"></Icon>      
      {#if item.editable == true}
        <input class="ml-2 w-full border border-gray-500 font-medium"   bind:value={itemName} />
      {:else}
        <span class="ml-1 truncate min-w-0 flex-1">{item.name}</span>
      {/if}
    </div>
  {/if}

  {#if item.expanded && item.type === 'folder' && item.children}
      <div class="ml-4 border-l border-gray-300">
        {#each item.children as child (child.name)}
          <TreeItem item={child} {onupdateitem} />
        {/each}
      </div>
  {/if}
</div>

<style>

  /* Optional: Additional styles if needed */
</style>