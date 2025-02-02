<script lang="ts">
    interface Props {
        id?: string;
        className?: string;
        children?: import('svelte').Snippet;
        onclick?: null | ((event:MouseEvent) => void);
    }

        // Internal function to handle click
    function handleClick(event: MouseEvent) {
        if (onclick) {
            onclick(event); // Call the provided `onclick` if it exists
        }
    }

    let { id = '', className = '', children, onclick }: Props = $props();
</script>

<button type="button" id="{id}" class="btn btn-sm h-auto variant-filled m-1 p-1 {className}" onclick={handleClick}>
    {@render children?.()}
</button>
