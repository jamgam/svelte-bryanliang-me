<script>
  import { onMount, onDestroy, setContext } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { randomInt, randomNum } from '../helpers'
  import { GAME_VALUES } from '../constants';
  import Character from './Character.svelte';
  import Bullet from './Bullet.svelte'
  import Enemy from './Enemy.svelte';
  import FPS from './FPS.svelte'
  import EndGamePrompt from './EndGamePrompt.svelte';
  import Particle from './Particle.svelte'
  import ShotgunDisplay from './ShotgunDisplay.svelte';
  import vec2 from 'gl-vec2'

  import {
		key,
		width,
		height,
		canvas as canvasStore,
		context as contextStore,
		pixelRatio,
		props,
		time,
    player,
    bullets,
    particles,
    isAlive,
    score,
    shells,
    enemies,
	} from '../game.js';

  import { isAboutMeVisible } from '../store';

	export let killLoopOnError = true;
	export let attributes = { alpha: false, desynchronized: true };

  const { ENEMY_MAX_SIZE, INITIAL_SPAWN_RATE, MAX_SPAWN_RATE, SECONDS_TO_MAX_SPAWN } = GAME_VALUES

  let listeners = [];
	let canvas;
	let context;
	let frame;
  let spawnrate = INITIAL_SPAWN_RATE;
  let spawnInterval;

  onMount(() => {
    // prepare canvas stores
		context = canvas.getContext('2d', attributes);
		canvasStore.set(canvas);
		contextStore.set(context);

    // setup entities
		listeners.forEach(async entity => {
			if (entity.setup) {
				let p = entity.setup($props);
				if (p && p.then) await p;
			}
			entity.ready = true;
		});

		// start game loop
		return createLoop((elapsed, dt) => {
			// time.set(elapsed);
      cleanUpEntities();
			render(dt);
		});
  });
  
  setContext(key, {
    add (fn) {
      this.remove(fn);
      listeners.push(fn);
    },
    remove (fn) {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  });

  $: !$isAboutMeVisible && startGame()
  $: !$isAlive && endGame()
  	
	function render (dt) {
		context.save();
		context.scale($pixelRatio, $pixelRatio);
    let renderAtEnd = [];
		listeners.forEach(entity => {
			try {
				if (entity.mounted && entity.ready && entity.render) {
          if (entity?.data?.alwaysOnTop) {
            renderAtEnd.push(entity)
          } else {
            entity.render($props, dt)
          }
				}
			} catch (err) {
				console.error(err);
				if (killLoopOnError) {
					cancelAnimationFrame(frame);
					console.warn('Animation loop stopped due to an error');
				}
			}
		});
    for(let entity of renderAtEnd) {
      entity.render($props, dt)
    }
		context.restore();
	}
  
  function handleResize () {
    width.set(window.innerWidth);
		height.set(window.innerHeight);
		pixelRatio.set(window.devicePixelRatio);
	}
  
  function cleanUpEntities () {
    bullets.set($bullets.filter(({deleted}) => !deleted))
    enemies.set($enemies.filter(({deleted}) => !deleted))
    particles.set($particles.filter(({deleted}) => !deleted))
  }

  function createLoop (fn) {
		let elapsed = 0;
		let lastTime = performance.now();
    let spawnEnemy = enemySpawner();
		(function loop() {
			frame = requestAnimationFrame(loop);
			const beginTime = performance.now();
			const dt = (beginTime - lastTime) / 1000;
			lastTime = beginTime;
      time.update(time => time + dt)
			elapsed += dt;
			fn(null, dt);
      spawnEnemy(spawnrate);
		})();
		return () => {
			cancelAnimationFrame(frame);
		};
	}

  function generateEnemy() {
    const uuid = uuidv4();
    const { ENEMY_MAX_SIZE } = GAME_VALUES;
    const spawnLocations = [
      {x: randomInt(0, $width), y: -ENEMY_MAX_SIZE},
      {x: $width + ENEMY_MAX_SIZE, y: randomInt(0, $height)}, 
      {x: randomInt(0, $width), y: $height + ENEMY_MAX_SIZE}, 
      {x: -ENEMY_MAX_SIZE, y: randomInt(0, $height)}, 
    ];
    const spawnLocation = spawnLocations[randomInt(0, 4)];
    enemies.set([...$enemies, {
      id: uuid,
      x: spawnLocation.x,
      y: spawnLocation.y,
      target: $isAboutMeVisible || !$isAlive ? [randomInt(0, $width), randomInt(0, $height)] : $player.position,
      ...($isAboutMeVisible || !$isAlive ? {speed: randomInt(50, 75)} : {}),
    }])
  }

  function enemySpawner() {
    let prevTime = performance.now();
    return (spawnrate) => {
      let time = performance.now();
      if ( time >= prevTime + spawnrate ) {
        for (let i = 0; i < Math.round(($width*$height) * 0.0000025) + 1; i++) {
          setTimeout(() => generateEnemy(), 500)
        }
        prevTime = time;
      }
    }
  }

  function startGame() {
    enemies.set([])
    score.set(0)
    isAlive.set(true)
    shells.set(10)
    time.set(0)
    spawnInterval = setInterval(() => {
      if (!$isAlive) {
        spawnrate = INITIAL_SPAWN_RATE
      } else {
        spawnrate -= (INITIAL_SPAWN_RATE - MAX_SPAWN_RATE)/SECONDS_TO_MAX_SPAWN
        if (spawnrate <= MAX_SPAWN_RATE) {
          clearInterval(spawnInterval)
          spawnrate = MAX_SPAWN_RATE
        }
      }
    }, 1000)
  }

  function endGame () {
    clearInterval(spawnInterval)
    spawnrate = INITIAL_SPAWN_RATE
  }

  function createExplosion({size, position, velocity = [0, 0]}) {
    for (let i = 0; i < size; i++) {
      particles[particles.length] = {
        id: uuidv4(), 
        x: position[0] + randomNum(-(size*1.2), size*1.2), 
        y: position[1] + randomNum(-(size*1.2), size*1.2),
        velocity: vec2.scaleAndAdd([], [randomNum(-100, 100), randomNum(-100, 100)], velocity, 20),
      }
    }
  }

</script>

<style>
  canvas {
    position: absolute;
    background-color: black;
    top: 0px;
    left: 0px;
  }
</style>

{#if !$isAlive && !$isAboutMeVisible}
  <EndGamePrompt on:click={startGame} />
{/if}
{#if !$isAboutMeVisible}
  <ShotgunDisplay />
{/if}

<canvas
  bind:this={canvas}
  width={$width * $pixelRatio}
	height={$height * $pixelRatio}
	style="width: {$width}px; height: {$height}px;"
/>
<svelte:window 
  on:resize|passive={handleResize} 
/>
<slot/>

{#each $bullets as {id, deleted, velocity, size, x, y, ...props}(id)}
  <Bullet bind:velocity bind:deleted bind:size bind:x bind:y {...props} />
{/each}
{#each $enemies as {id, size, velocity, deleted, x, y, ...props}(id)}
  <Enemy bind:size bind:velocity bind:deleted bind:x bind:y {...props} />
{/each}
{#each $particles as {id, deleted, ...props}(id)}
  <Particle bind:deleted {...props} />
{/each}

{#if !$isAboutMeVisible}
  <FPS />
  {#if $isAlive}
    <Character />
  {/if}
{/if}


<!-- {@debug width, height} -->
