<script lang="ts">
	import { Color } from '@tiptap/extension-color';
  import { all, createLowlight } from 'lowlight'
  import css from 'highlight.js/lib/languages/css'
  import js from 'highlight.js/lib/languages/javascript'
  import ts from 'highlight.js/lib/languages/typescript'
  import html from 'highlight.js/lib/languages/xml'
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
	import ListItem from '@tiptap/extension-list-item';
	import TextStyle from '@tiptap/extension-text-style';
	import StarterKit from '@tiptap/starter-kit';
	import { Editor } from '@tiptap/core';
  import { Markdown } from 'tiptap-markdown';
	import { onMount } from 'svelte';

	interface Props {
		content: string | undefined;
		theme: string; // default theme is light
		updateContent: (content: string) => void;
	}

	let { content, theme, updateContent }: Props = $props();
	let previousContent: string | undefined = $state(content);

	let element: HTMLDivElement | null = $state(null);
	let editor: Editor = $state(null);

  // create a lowlight instance
  const lowlight = createLowlight(all)
// you can also register languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
  $effect(() => {
    if (element && editor) {
      console.log('content', content);
      console.log('md', editor.storage.markdown.getMarkdown());
      console.log('prev-md', previousContent );
  }

    if (element && editor && content !== '') {
        previousContent = content;
        editor.commands.setContent(content);
        editor.commands.focus();
        if (element) {
          element.scrollTop = 0;
        }
    }
  });

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
        StarterKit,
        Markdown.configure({
          html: true,                  // Allow HTML input/output
          tightLists: true,            // No <p> inside <li> in markdown output
          tightListClass: 'tight',     // Add class to <ul> allowing you to remove <p> margins when tight
          bulletListMarker: '-',       // <li> prefix in markdown output
          linkify: true,              // Create links from "https://..." text
          breaks: true,               // New lines (\n) in markdown input are converted to <br>
          transformPastedText: true,  // Allow to paste markdown text in the editor
          transformCopiedText: true, 
        }),
        CodeBlockLowlight.configure({lowlight}),
        Color.configure({ types: [TextStyle.name, ListItem.name] }), TextStyle.configure({ types: [ListItem.name] }),],
			content:  content,
      onUpdate({ editor }: { editor: Editor }) {
        if (editor) {
          updateContent(editor.storage.markdown.getMarkdown());
        }
        // The content has changed.
      },
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
		});
	});
</script>

<div bind:this={element} class="p-2 editor-container"/>

<style>
    .editor-container {
      height: 100%;
      width: 100%;
      overflow-y: auto;
      /* border: 1px solid #ccc; */
      border-radius: 4px;
    }
</style>