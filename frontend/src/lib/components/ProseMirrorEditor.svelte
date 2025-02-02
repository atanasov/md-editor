<script lang="ts">
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
  import { schema } from "prosemirror-schema-basic";
  import { exampleSetup } from "prosemirror-example-setup";

  import { onMount } from "svelte";

  let editorContainer: HTMLDivElement | null = null;
  let content: string = "<p>Hello, ProseMirror!</p>"; // Initial content for the editor

  let editorView: EditorView | null = null;

  onMount(() => {
    if (editorContainer) {
      const doc = ProseMirrorDOMParser.fromSchema(schema).parse(
        new DOMParser().parseFromString(content, "text/html")
      );

      const state = EditorState.create({
        doc,
        plugins: exampleSetup({ schema }),
      });

      editorView = new EditorView(editorContainer, {
        state,
        dispatchTransaction(transaction) {
          const newState = editorView?.state.apply(transaction);
          editorView?.updateState(newState!);

          // Update content
          content = editorView?.state.doc.toJSON();
        },
      });
    }

    return () => {
      editorView?.destroy();
    };
  });
</script>

<div bind:this={editorContainer} class="prosemirror-container"></div>

<style>
  .prosemirror-container {
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 200px;
    background: white;
  }

  .ProseMirror {
    outline: none;
  }
</style>