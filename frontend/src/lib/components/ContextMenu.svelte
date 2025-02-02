<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Icon from './Icon.svelte';
  // Types for positioning
  interface Position {
    x: number;
    y: number;
  }

  interface MenuAlignment {
    type: 'object' | 'mouse' | 'fixed';
    target?: string;  // ID of target element for object alignment
    align?: 'top' | 'bottom' | 'left' | 'right';
    position?: {x: number; y: number };
    offset?: { x: number; y: number };  // Optional offset from the alignment point
  }

  interface MenuConstraints {
    windowWidth: number;
    windowHeight: number;
    // padding?: number;  // Padding from window edges
  }

  interface Props {
    id: string;
    triggerId: string;
    items?: any[];
    menuItemClick: (item: { action: string; label: string }) => void;
    isVisible: boolean;
    // onVisibilityChange: (visible: boolean) => void;
    style?: string;
    alignment: MenuAlignment;
    constraints?: MenuConstraints;
  }

  let { 
    id, 
    triggerId,
    items = [], 
    menuItemClick, 
    isVisible, 
    // onVisibilityChange,
    style,
    alignment,
    constraints = {
      windowWidth: 1000,
      windowHeight: 800,
      // padding: 10
    }
  }: Props = $props();

  let contextMenu: HTMLDivElement | null = null;
  let mousePosition: Position = { x: 0, y: 0 };

  function handleMouseMove(event: MouseEvent) {
    mousePosition = { x: event.clientX, y: event.clientY };
  }

  function handleClickOutside(event: MouseEvent) {
    const triggerButton = document.getElementById(triggerId);
    const clickedTrigger = triggerButton?.contains(event.target as Node);
    const clickedMenu = contextMenu?.contains(event.target as Node);

    if (!clickedMenu && !clickedTrigger) {
      // onVisibilityChange(false);
    }
  }

  // Watch for visibility changes to update position
  $effect(() => {
  });

  onMount(() => {
 });

  onDestroy(() => {
   });
</script>

<style>
  .context-menu {
    position: fixed;
    z-index: 1000;

  }
  .dropdown-content {
    border-radius: 0.5rem;
  }
</style>

<div 
  id="{id}" 
  bind:this={contextMenu} 
  class="context-menu {isVisible ? 'visible' : 'hidden'}"
  style={style}
>
  <ul class="dropdown-content menu bg-base-300 flex flex-col z-[1] w-52 p-1 shadow overflow-hidden">
    {#each items as item, key}
      <li
        class="context-menu-item "
        role="button"
        tabindex={key}
        onclick={() => {
          menuItemClick(item);
          // onVisibilityChange(false);
        }}
      >
        <a class="p-1">
          <Icon name="{item.action}" />
          <span>{item.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</div>