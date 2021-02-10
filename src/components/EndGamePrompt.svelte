<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition'
  import { quartInOut } from 'svelte/easing'
  import Button from './Button.svelte'
  import { isAboutMeVisible } from '../store'
  function onAboutMe() {
    isAboutMeVisible.set(true)
  }
</script>

<style>
  div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1; 
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .divider {
    height: 1rem;
    width: 100%;
    display: inline-block;
    position: relative;
  }

</style>

<div 
  class=".parent" 
  in:fly={{ y: -200, duration: 500, easing: quartInOut }}
  out:fly={{ y: 200, duration: 500, easing: quartInOut }}
>
  <Button on:click>Try Again</Button>
  <div class="divider" />
  <Button class="small round" on:click={onAboutMe}>About Me</Button>
</div>
