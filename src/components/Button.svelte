<script>
  export { className as class };
  let className = '';
</script>

<style>
  button {
    font-family: Consolas, monaco, monospace;
    padding: .4rem 1rem;
    border: solid var(--light-blue);
    border-width: 2px;
    background-color: transparent;
    color: var(--light-blue);
    font-size: calc(5px + 1vmin);
    pointer-events: all;
    -webkit-user-select: none;         
    -moz-user-select: none; 
    -ms-user-select: none; 
    user-select: none;
  }

  .small {
    font-size: calc(5px + .6vmin);
  }

  .round {
    border-radius: 10rem;
  }

  button:hover {
    border-width: 4px;
    margin: -2px;
    cursor: pointer;
  }
</style>

<button class={className} on:click>
  <slot/>
</button>