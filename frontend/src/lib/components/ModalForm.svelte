<!--- ModalForm.svelte --->
<script lang="ts">
    interface Props {
      children?: import('svelte').Snippet;
      title: string;
      isOpen?: boolean;
      submitText?: string;
      cancelText?: string;
      handleSubmit?: () => void;
      overlayClass?: string;
      modalClass?: string;
    }
  
    let {
      children,
      title,
      isOpen = false,
      submitText = 'Submit',
      cancelText = 'Cancel',
      handleSubmit,
      overlayClass = 'bg-black/50',
      modalClass = 'bg-white'
    } = $props();
  
    function closeModal(): void {
      isOpen = false;
    }
  
    function handleKeydown(event: KeyboardEvent): void {
      if (event.key === 'Escape') closeModal();
    }
  
    $effect(() => {
      if (isOpen) {
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
      }
    });
  </script>
  
  {#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 {overlayClass}"
      onclick={closeModal}
      role="dialog"
      aria-modal="true"
    >
      <div class="max-w-md w-full {modalClass} rounded-lg p-6 shadow-xl">
        <div class="mb-4">
          <h2 class="text-xl font-bold mb-4">{title}</h2>
          
          <form
            id="modalForm"
            onsubmit={(e) => {
              e.preventDefault();
              handleSubmit?.();
              closeModal();
            }}
          >
          {@render children?.()}
          </form>
        </div>
  
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            onclick={closeModal}
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="modalForm"
            class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  {/if}