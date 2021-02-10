import { getContext, onMount, onDestroy } from 'svelte';
import { writable, derived } from 'svelte/store';

// Some props for the app
export const width = writable(window.innerWidth);
export const height = writable(window.innerHeight);
export const pixelRatio = writable(window.devicePixelRatio);
export const context = writable();
export const canvas = writable();
export const time = writable(0);
export const score = writable(0);
export const player = writable({
	position:[window.innerWidth/2, window.innerHeight/2],
	velocity: [0, 0],
	isAlive: false,
	size: 6,
});
export const enemies = writable([]);
export const bullets = writable([]);
export const particles = writable([]);
export const isAlive = writable(false);
export const shells = writable(10);

// A more convenient store for grabbing all game props
export const props = deriveObject({
	context,
	canvas,
	width,
	height,
	pixelRatio,
	time,
	player,
});

export const key = Symbol();

export const getState = () => {
	const api = getContext(key);
	return api.getState();
};

export const renderable = (render) => {
	const api = getContext(key);
	const element = {
		ready: render.ready || false,
		mounted: render.mounted || false,
		data: render.data || {},
	};
	if (typeof render === 'function') element.render = render;
	else if (render) {
		if (render.render) element.render = render.render;
		if (render.setup) element.setup = render.setup;
	}
	api.add(element);
	onMount(() => {
		element.mounted = true;
		return () => {
			api.remove(element);
			element.mounted = false;
		};
	});
}

function deriveObject (obj) {
	const keys = Object.keys(obj);
	const list = keys.map(key => {
		return obj[key];
	});
	return derived(list, (array) => {
		return array.reduce((dict, value, i) => {
			dict[keys[i]] = value;
			return dict;
		}, {});
	});
}