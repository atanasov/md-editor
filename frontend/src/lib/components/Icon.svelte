<script lang="ts">
    import { onMount } from "svelte";
  
    
  interface Props {
    // Define the prop type for the icon name
    name: string;
  }

  let { name }: Props = $props();
  
    // Hold the SVG content as a string
    let svgContent: string | null = $state(null);
  
    // Dynamically load the SVG file
    onMount(async () => {
      try {
        // Dynamically import the SVG as a raw string
        const module = await import(`./../../assets/icons/${name}.svg?raw`);
        svgContent = module.default;
      } catch (error) {
        console.error(`SVG "${name}" not found`, error);
        svgContent = null;
      }
    });
  </script>
  
  {#if svgContent}
    <!-- Render the SVG content -->
    {@html svgContent}
  {:else}
    <!-- Render a placeholder if the SVG is not found -->
    <div class="icon-placeholder">Icon not found</div>
  {/if}