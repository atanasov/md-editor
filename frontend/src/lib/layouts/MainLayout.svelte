<script lang="ts">
  interface Props {
    leftSidebar?: boolean; // Optional, defaults to false
    rightSidebar?: boolean; // Optional, defaults to false
    header?: boolean; // Optional, defaults to false
    footer?: boolean; // Optional, defaults to false
    children?: import('svelte').Snippet;
  }

  let {
    leftSidebar = false,
    rightSidebar = false,
    header = false,
    footer = false,
    children
  }: Props = $props();
  </script>
  
  <div class="h-screen w-screen flex flex-col">
    <!-- {#if header}
      <header>
        <slot name="header">Default Header Content</slot>
      </header>
    {/if}
  

      {#if leftSidebar}
        <aside class="left-sidebar">
          <slot name="left-sidebar">Default Left Sidebar Content</slot>
        </aside>
      {/if}
  
      <section class="content"> -->
        {#if children}{@render children()}{:else}Default Main Content{/if}
      <!-- </section>
  
      {#if rightSidebar}
        <aside class="right-sidebar">
          <slot name="right-sidebar">Default Right Sidebar Content</slot>
        </aside>
      {/if}
 
  
    {#if footer}
      <footer>
        <slot name="footer">Default Footer Content</slot>
      </footer>
    {/if} -->
  </div>
  
  <style>

  </style>