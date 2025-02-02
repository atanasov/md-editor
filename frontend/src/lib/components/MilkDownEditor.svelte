<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
  // import { Crepe } from '@milkdown/crepe';
  import { insert, replaceAll } from '@milkdown/kit/utils';
  import { commonmark } from '@milkdown/kit/preset/commonmark';
  import { getMarkdown } from '@milkdown/kit/utils'

  // Import common style (these will apply regardless of the theme)
  import '@milkdown/crepe/theme/common/style.css';
  import('@milkdown/crepe/theme/nord-dark.css');
  import('@milkdown/crepe/theme/nord.css');

  let container: HTMLDivElement | null = $state(null);
  let editorInstance: Editor | null = $state(null);

  interface Props {
    content: string | undefined;
    theme: string; // default theme is light
    updateContent: (content: string) => void;
  }

  let { content, theme }: Props = $props();
  let previousContent: string | undefined = $state(content);

  // Function to initialize the editor
  async function createEditor() {
      if (!container) {
          console.warn("Container is not available yet.");
          return;
      }

      // Create the Crepe editor instance
      editorInstance = Editor.make()
        .config((ctx) => {
          ctx.set(rootCtx, container);
        })
        .create();
        if (editorInstance) {
          console.log('MilkDown Editor has been created.');
          editor.action(replaceAll(content));
          editor.action(commonmark);
        }
      
      // try {
      //     await editorInstance.create();
      // } catch (error) {
      //     console.error('Error creating Crepe Editor:', error);
      // }
  }

  function destroyEditor() {
    if (editorInstance) {
        editorInstance.destroy();
          console.log('MilkDown Editor has been destroyed.');
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
    // if (editorInstance && content !== previousContent && content !== '') {
    //     previousContent = content;
    //     editorInstance.action(replaceAll(content));
    //     if (container) {
    //       container.scrollTop = 0;
    //     }
    // }
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
