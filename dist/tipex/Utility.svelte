<script lang="ts" module>
	import { type Snippet } from 'svelte';
	import EditLinkMenu from '../tipex/link/EditLinkMenu.svelte';
	import type { TipexEditor } from './Tipex.svelte';

	export interface UtilityProps {
		children?: Snippet;
		tipex: TipexEditor;
	}
</script>

<script lang="ts">
	import Fa6SolidCopy from './icons/Fa6SolidCopy.svelte';

	let { children, tipex }: UtilityProps = $props();

	let enableLinkEdit = $state(false);

	// Handle utility clicks without aggressive focus management
	function handleUtilityClick(event: MouseEvent, action: () => void) {
		event.stopPropagation();
		event.preventDefault();

		const editorElement = tipex?.view?.dom;
		const isEditorFocused =
			editorElement &&
			document.activeElement &&
			(editorElement === document.activeElement || editorElement.contains(document.activeElement));

		if (!isEditorFocused) {
			tipex?.chain().focus().run();
		}

		action();
	}

	function copy() {
		navigator.clipboard.writeText(tipex?.getHTML() || '');
	}
</script>

{#if !enableLinkEdit}
	<button
		class="tipex-edit-button tipex-button-extra tipex-button-rigid"
		onclick={(event) => handleUtilityClick(event, copy)}
		type="button"
		aria-label="Copy HTML"
	>
		<Fa6SolidCopy display class="h-4 w-4" />
	</button>
	{@render children?.()}
{/if}

<EditLinkMenu bind:enableLinkEdit {tipex} />
