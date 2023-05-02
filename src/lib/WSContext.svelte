<script lang="ts">
	import { createEventDispatcher, onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';

	let ws: WebSocket | undefined;

	export let room = '1';
	export let useruid = Math.floor(Math.random() * 1000);

	const dispatch = createEventDispatcher();

	setContext('ws', {
		getWs: () => ws,
		send: (data: any) => {
			if (ws) {
				ws.send(JSON.stringify({ room, payload: { ...data, useruid } }));
			}
		}
	});

	onMount(() => {
		if (!browser) {
			return;
		}

		const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
		ws = new WebSocket(`${protocol}://${window.location.host}`);

		ws.onmessage = ({ data }) => {
			const parsedData = JSON.parse(data);
			if (parsedData.useruid !== useruid) {
				dispatch('message', parsedData);
			}
		};

		ws.onopen = function (e) {
			this.send(JSON.stringify({ join: room }));
		};
	});
</script>

{#if browser}
	<slot />
{/if}
