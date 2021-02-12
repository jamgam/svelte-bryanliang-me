<script>
  import { shells } from '../game'
  import { fly } from 'svelte/transition'
  import { quartInOut } from 'svelte/easing'
</script>

<style>
  .container {
    position: absolute;
    box-sizing: border-box;
    bottom: 0;
    z-index: 1;
    left: 50%;
    transform: translate(-50%, -0%);
    color: white;
    display: inline-block;
    align-items: center;
    justify-content: center;
    width: 20rem;
    -webkit-user-select: none;      
    -moz-user-select: none; 
    -ms-user-select: none;
    user-select: none; 
    font-size: 12px;
  }

  .shell-container {
    display: flex;
    flex-direction: row;
  }

  .shell {
    height: 2.5rem;
    width: 1rem;
    margin: .5rem;
    background-color: yellow;
  }
</style>

<div 
  class="container"
  in:fly={{ y: 100, duration: 500, easing: quartInOut }}
  out:fly={{ y: 100, duration: 500, easing: quartInOut }}
  >
  <div class="shell-container">
    {#each Array(Math.floor($shells)) as _, i}
      <div class="shell"/>
    {/each}
  </div>
  (left click)
</div>