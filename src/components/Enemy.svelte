<script>
	import { time, enemies, score, player, isAlive, particles, bullets, renderable } from '../game';
  import { randomInt, randomNum, isOutOfBounds } from '../helpers'
  import { GAME_VALUES } from '../constants'
	import vec2 from 'gl-vec2';
  import { onDestroy } from 'svelte';
    
  const { 
    ENEMY_MIN_SIZE,
    ENEMY_MAX_SIZE, 
    ENEMY_MIN_SPEED, 
    ENEMY_MAX_SPEED, 
    ENEMY_TARGET_OFFSET,
   } = GAME_VALUES

	export const color = '#e94560';
	export const size = randomInt(ENEMY_MIN_SIZE, ENEMY_MAX_SIZE);
	export let x = 0;
	export let y = 0;
  export let target = [0, 0];
  export let speed = randomInt(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED) + Math.floor($time*1.2);
  export let velocity = [0, 0]
  export let deleted = false;
  let explode = true;

  target = target.map(e => e + randomInt(-ENEMY_TARGET_OFFSET, ENEMY_TARGET_OFFSET))
  const delta = vec2.sub([], target, [x, y])
  vec2.normalize(delta, delta);

  onDestroy(() => {
    explode && createExplosion()
  })

  function createExplosion(props = {}) {
    const numEntities = $bullets.length + $enemies.length + $particles.length
    const particleRatio = numEntities > 200 ? 100/numEntities : 1
    const newParticles = []
    const numParticles = size * particleRatio
    for (let i = 0; i < numParticles; i++) {
      newParticles.push({
        id: {}, 
        start: vec2.add([], [x, y], vec2.random([], randomNum(0, size*1.5))),
        adjustVelocity: velocity,
        velocity: vec2.random([], 100),
        ...props
      })
    }
    particles.set([...$particles, ...newParticles])
  }

  function checkCollisions() {
    const dist = vec2.dist([x, y], $player.position)
    if (dist <= size + $player.size && $isAlive) {
      isAlive.set(false)
      deleted = true;
      return;
    }

    for (let bullet of $bullets) {
      const {x: eX, y: eY, size: eSize} = bullet
      const dist = vec2.dist([x, y], [eX, eY])
      if (dist <= size + eSize) {
        deleted = true;
        if (eSize > 1.5) {
          const sub = vec2.sub([], [x, y], [eX, eY])
          const adjustVelocity = vec2.add([], bullet.velocity, sub)
          const distFromPlayerRatio = 100/vec2.len(vec2.sub([], [x,y], $player.position))
          explode = false
          createExplosion({ colors: ['#e94560', 'yellow', 'orange'], adjustVelocity: vec2.scale([], adjustVelocity, randomNum(-.07, .07) + distFromPlayerRatio), inertia: .98})
        } else {
          bullet.deleted = true;
        }
        $isAlive && score.update(score => score + 1)
        break;
      }
    }
  }
	
	renderable({
    render: (props, dt) => {
      const offset = ENEMY_MAX_SIZE + 20
      const { context, width, height } = props;

      checkCollisions()

      if (isOutOfBounds(width, height, x, y, offset)) {
        explode = false
        deleted = true
      }
      if (deleted) {
        return
      }

      velocity = vec2.scale(velocity, delta, speed);

      x += velocity[0] * dt;
      y += velocity[1] * dt;

      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    },
    ready: true,
    mounted: true,
  });
</script>

<!-- The following allows this component to nest children -->
<slot></slot>