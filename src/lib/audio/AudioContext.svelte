<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const audioContext = writable<AudioContext | null>(null);
	const destination = writable<AudioDestinationNode | null>(null);

	setContext('audioCtx', audioContext);
	setContext('destination', destination);

	onMount(() => {
		if (browser) {
			$audioContext = new window.AudioContext();
			$destination = $audioContext.destination;
		}
	});
</script>

{#if browser}
	<slot />
{/if}
