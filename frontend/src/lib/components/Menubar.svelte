<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="h-12 shrink-0">
    {@render children?.()}
</div>
