<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="h-13 shrink-0 flex justify-between">
    {@render children?.()}    
</div>
