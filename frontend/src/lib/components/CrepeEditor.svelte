<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Crepe } from '@milkdown/crepe';
  import { insert, replaceAll } from '@milkdown/kit/utils';
  import { getMarkdown } from '@milkdown/kit/utils'

  // Import common style (these will apply regardless of the theme)
  import '@milkdown/crepe/theme/common/style.css';
  import('@milkdown/crepe/theme/nord-dark.css');
  import('@milkdown/crepe/theme/nord.css');

  let container: HTMLDivElement | null = $state(null);
  let crepeInstance: Crepe | null = $state(null);

  interface Props {
    content: string | undefined;
    theme: string; // default theme is light
    updateContent: (content: string) => void;
  }

  let { content, theme, updateContent }: Props = $props();
  let previousContent: string | undefined = $state(content);

  // Function to initialize the editor
  async function createEditor() {
      if (!container) {
          console.warn("Container is not available yet.");
          return;
      }

      // Create the Crepe editor instance
      crepeInstance = new Crepe({
          root: container,
          defaultValue: content,
      });

      try {
          await crepeInstance.create();
      } catch (error) {
          console.error('Error creating Crepe Editor:', error);
      }
  }

  function destroyEditor() {
    if (crepeInstance) {
          crepeInstance.destroy();
          console.log('Crepe Editor has been destroyed.');
    }
  }

  onMount(async () => {
      await createEditor();
  });

  onDestroy(() => {
    destroyEditor;
  });

  // Watch for content changes
  $effect(() => {
    if (crepeInstance && content !== previousContent && content !== '') {
        previousContent = content;
        crepeInstance.editor.action(replaceAll(content));
        if (container) {
          container.scrollTop = 0;
        }
    }
  });
</script>
  
  <style>
    /* Default styles for the editor container */
    .editor-container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      /* border: 1px solid #ccc; */
      border-radius: 4px;
    }
  </style>
  
  <!-- Apply a class dynamically based on the current theme -->

  <div
    bind:this={container}
    class="editor-container {theme === 'dark' ? 'dark-theme' : 'light-theme'}"
  ></div>
