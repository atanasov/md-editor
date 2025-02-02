import './app.css';
import './ts/window';
import App from './App.svelte';
import { init } from '@neutralinojs/lib';
import { mount } from "svelte";

init();

const app = mount(App, {
	// @ts-expect-error
	target: document.getElementById('app'),
});

export default app;
