<script lang="ts">
    import Icon from './Icon.svelte';
  
  interface Props {
    menu?: { action: string; label: string }[];
    menuItemClick: (item: { action: string; label: string }) => void;
  }

  let { menu = [], menuItemClick }: Props = $props();
  </script>
  
  <div class="dropdown dropdown-top">
    <div tabindex="0" role="button" class="btn btn-sm m-1">
      <Icon name="settings" />
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      {#each menu as item, key}
        <li
          class="context-menu-item"
          role="button"
          tabindex={key}
          onclick={() => menuItemClick(item)}
        >
          <a>
            <Icon name="{item.action}" />
            <span>{item.label}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>