<script>
  import { fly } from 'svelte/transition'
  import { quartInOut } from 'svelte/easing';
</script>
<style>
  .Navbar {
    box-sizing: border-box;
    position: absolute;
    min-width: 100vw;
    z-index: 1;  
    align-items: center;
    height: 50;
    padding: 1rem 1rem;
    background-color: transparent;
  }

  .Navbar-text {
    float: left;
    color: white;
  }

  .Navbar-icon {
    float: right;
    padding-left: 3rem;
    padding-right: 1rem;
  }
</style>

<header transition:fly={{ y: -100, duration: 1000, easing: quartInOut }} class="Navbar">
  <span class="Navbar-text">Bryan Liang</span>
  <img class="Navbar-icon" src="/github-icon.png" alt="github logo"/>
  <img class="Navbar-icon" src="/linkedin-icon.png" alt="github logo"/>
</header>