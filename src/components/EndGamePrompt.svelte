<script>
  import { onDestroy, onMount } from 'svelte';
  import { fly } from 'svelte/transition'
  import { quartInOut } from 'svelte/easing'
  import Button from './Button.svelte'
  import { isAboutMeVisible } from '../store'
  import { getHighscores, uploadScore, updateUsername } from '../requests'
  import { score, time } from '../game'
  import { GAME_VALUES } from '../constants'

  let highscores = null;
  let error = null;
  let value = '';
  let rank = -1;
  let id = null;
  let submitting = false;
  const currentScore = $score;

  onMount(async () => {
    await getScores()
    if (getRank() > 0) {
      const entry = await uploadScore({score: currentScore, duration: $time.toFixed(2)})
      id = entry.id
      await getScores()
    }
  })

  onDestroy(() => {
    handleOnSubmit()
  })

  async function getScores() {
    try {
      highscores = await getHighscores();
    } catch(e) {
      error = e;
    }
    return highscores;
  }

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function init(e) {
    e.focus();
  }

  function onAboutMe() {
    isAboutMeVisible.set(true);
  }

  async function handleOnSubmit() {
    if (value && id) {
      submitting = true
      await updateUsername({id, username: value})
      submitting = false
      rank = -1
      id = null
      await getScores()
    }
  }

  function fill(highscores) {
    return [
      ...highscores,
      ...Array(10-highscores.length).fill({id: {}, username: '-', score: '-'})
    ]
  }

  function getRank() {
    rank = highscores.length < 10 ? highscores.length + 1 : -1
    for (let i = highscores.length - 1; i >= 0; i--) {
      if(highscores[i]?.score < currentScore) {
        rank = i + 1
      }
    }
    return rank
  }
</script>

<style>
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1; 
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: calc(12px + .2vw);
  }

  .leaderboard {
    display: flex;
    flex-direction: column;
    margin: 1.5rem 1.5rem;
    width: 25rem;
  }

  .header {
    padding-bottom: .2rem;
    font-size: calc(12px + .3vw);
    border-bottom: var(--light-blue) solid 2px;
    margin-bottom: .4rem;
  }

  .entry {
    color: var(--light-blue);
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .highlight {
    background-color: var(--red);
  }

  .submitting {
    background-color: darkgreen;
  }

  .username {
    width: 100%;
    float: left;
    text-align: left;
  }

  p {
    color: var(--light-blue);
    font-size: calc(12px + .2vw);
    font-family: Consolas, monaco, monospace;
  }

  form {
    margin-left: 1rem;
  }

  input {
    border: var(--light-blue) solid 1px;
    background-color: transparent;
    color: var(--light-blue);
    font-size: calc(12px + .2vw);
    font-family: Consolas, monaco, monospace;
  }
  
  .divider {
    height: 1rem;
    width: 100%;
    margin: .2rem;
    display: inline-block;
    position: relative;
  }
  
  span.col{
    min-width: 2rem;
    padding: 0rem 1rem;
  }

  @keyframes dots-1 { from { opacity: 0; } 25% { opacity: 1; } }
  @keyframes dots-2 { from { opacity: 0; } 50% { opacity: 1; } }
  @keyframes dots-3 { from { opacity: 0; } 75% { opacity: 1; } }
  @-webkit-keyframes dots-1 { from { opacity: 0; } 25% { opacity: 1; } }
  @-webkit-keyframes dots-2 { from { opacity: 0; } 50% { opacity: 1; } }
  @-webkit-keyframes dots-3 { from { opacity: 0; } 75% { opacity: 1; } }

  .dots span {
      animation: dots-1 1s infinite steps(1);
      -webkit-animation: dots-1 1s infinite steps(1);
  }

  .dots span:first-child + span {
      animation-name: dots-2;
      -webkit-animation-name: dots-2;
  }

  .dots span:first-child + span + span {
      animation-name: dots-3;
      -webkit-animation-name: dots-3;
  }

</style>

<div 
  class="container" 
  in:fly={{ y: -200, duration: 500, easing: quartInOut }}
  out:fly={{ y: 200, duration: 500, easing: quartInOut }}
>
  <div 
    class="leaderboard" >
    {#if rank > 0}
      <p>You ranked: #{rank}</p>
    {:else}
      <p>You scored: {currentScore} pt{currentScore === 1 ? '' : 's'} {currentScore === 0 ? ':(' : ''}</p>
    {/if}
    {#if highscores}
      <div class="entry header">
        <span class="col">#</span>
        <span class="username col">name</span>
        <span class="col">pts</span>
      </div>
      {#each fill(highscores) as {id, username, score}, i}
      <div 
        class={
          i + 1 === rank 
          ? submitting 
            ? "highlight entry submitting" 
            : "highlight entry" 
          : "entry "}
      >
        <span class="col">{i+1}</span>
        {#if (i + 1 === rank) && submitting}
          <span class="username col">submitting<span class="dots"><span>.</span><span>.</span><span>.</span></span></span>
        {:else if i + 1 === rank}
          <form class="username" on:submit|preventDefault={handleOnSubmit}>
            <input bind:value use:init type="text" placeholder={GAME_VALUES.USERNAME_PLACEHOLDER}/>
          </form>
        {:else}
          <span class="username col">{username}</span>
        {/if}
        <span class="col">{score}</span>
      </div>
      {/each}
    {:else if error}
      <p>Couldn't fetch highscores :/</p>
    {:else}
      <p>Fetching highscores<span class="dots"><span>.</span><span>.</span><span>.</span></span></p>
    {/if}
  </div>
  <Button on:click>Try Again</Button>
  <div class="divider" />
  <Button class="small round" on:click={onAboutMe}>About Me</Button>
</div>
