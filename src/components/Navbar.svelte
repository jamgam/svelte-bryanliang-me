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
    margin-left: 3rem;
    margin-right: 1rem;
  }
</style>

<header transition:fly={{ y: -100, duration: 1000, easing: quartInOut }} class="Navbar">
  <span class="Navbar-text">Bryan Liang</span>
  <a href="https://linkedin.com/in/bryanliang1995">
    <img class="Navbar-icon" src="/linkedin-icon.png" alt="github logo"/>
  </a>
  <a href="https://github.com/jamgam">
    <img class="Navbar-icon" src="/github-icon.png" alt="github logo"/>
  </a>
</header>