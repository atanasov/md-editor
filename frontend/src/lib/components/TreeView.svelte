<script lang="ts">
  import TreeItem from "./TreeItem.svelte";
  import type { TreeItemData } from "../../types/types";

  interface Props {
    id?: string;
    data: TreeItemData[];
    onupdateitem: (path: string, operation: string, item?: TreeItemData) => void;
  }

  let { id, data, onupdateitem }: Props = $props();
</script>

<div class="treeview" id={id} role="tree" 
  oncontextmenu={(e) => { e.preventDefault(); onupdateitem('', 'contextmenu'); }}
  onclick={(e) => { e.stopPropagation(); onupdateitem('', 'select'); }} tabindex={1}>
  {#each data as item (item.path)}
    <TreeItem {item} {onupdateitem} />
  {/each}
</div>

<style lang="postcss">
  /* Optional: Custom styles for the TreeView */
  .treeview {
    @apply border-r p-2 overflow-hidden h-full transition-all select-none;
  }
  .treeview:hover {
    @apply overflow-auto;
  }
</style>
