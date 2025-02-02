<script lang="ts">
    import Icon from './Icon.svelte';
  
  interface Props {
    theme?: 'light' | 'dark';
    switchTheme: () => void;
  }

  let { theme = 'light', switchTheme }: Props = $props();
  </script>
  
  <div class="relative flex flex-wrap items-center">
    <button
      type="button"
      class="btn btn-sm h-auto variant-filled m-1 p-1"
      onclick={switchTheme}
    >
      {#if theme === 'light'}
        <Icon name="light" />
      {:else}
        <Icon name="dark" />
      {/if}
    </button>
  </div>