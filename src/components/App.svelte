<script>
  import Navbar from './Navbar.svelte';
  import Button from './Button.svelte';
  import Canvas from './Canvas.svelte';
  import Background from './Background.svelte';
  import { fly } from 'svelte/transition';
  import { quartInOut } from 'svelte/easing';
  import { onMount } from 'svelte';

  import { isAboutMeVisible } from '../store'
  onMount(() => {
    isAboutMeVisible.set(true);
  })

  function handleOnClick() {
    isAboutMeVisible.set(false)
  }

  function transitionFlyParams(offset) {
    return {delay: offset, duration: 800, x: -500, opacity: 0, easing: quartInOut}
  }

</script>

<style>
  :global(:root){
    --dark-grey: #1b262c;
    --dark-blue: #0f4c75;
    --blue: #3282b8;
    --light-blue: #bbe1fa;
    --red: #e94560;
  }
  * {
    box-sizing: border-box;
  }

  div {
    display: flex;
  }

  :global(body) {
    overflow: hidden;
    margin: 0;
    font-family: Consolas, monaco, monospace;
  }

  .App {
    text-align: center;
    z-index: 1;
    background-color: transparent;
  }
  .App-main {
    z-index: 1;
    color: var(--light-blue);
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: absolute;
    background-color: transparent;
    font-size: calc(10px + 4vmin);
    padding: 12vw 12vh;
    text-align: left;
    pointer-events: none;
  }
  .App-main span {
    margin: 1.5rem 0rem;
    display: flex;
    flex-direction: row;
  }
  .App-maintext {
    font-size: calc(10px + 4vmin);
  }
  .App-subtext {
    font-size: calc(8px + 1.5vmin);
  }

  .bar {
    background-color: var(--blue);
    height: .25rem;
    width: 8rem;
    margin: .5rem .5rem;
    border-radius: 1rem;
  }

</style>

<div class="App">
  {#if $isAboutMeVisible}
    <Navbar />
    <main class="App-main">
      <span 
        transition:fly={transitionFlyParams(0)}
        class="App-maintext">Hello, <br/>
      I'm Bryan
      </span>
      <div transition:fly={transitionFlyParams(25)} class="bar" />
      <div transition:fly={transitionFlyParams(50)} class="bar" style="margin-left: 6rem"/>
      <span transition:fly={transitionFlyParams(75)} class="App-subtext">Software Engineer / Gamer</span>
      <div transition:fly={transitionFlyParams(100)}>
        <Button on:click={handleOnClick}>Play</Button>
      </div>
    </main>
  {/if}
  <Canvas>
    <Background color="#1b262c" />
  </Canvas>
</div>
