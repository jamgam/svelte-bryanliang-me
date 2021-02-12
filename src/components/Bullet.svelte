<script>
	import { width, height, renderable } from '../game';
	import vec2 from 'gl-vec2';
  import { onDestroy } from 'svelte';
  import { GAME_VALUES } from '../constants';
import { isOutOfBounds } from '../helpers';
  
  const { BASE_BULLET_SPEED } = GAME_VALUES

	export let color = 'white';
  export let grow = false;
	export let size = 1.5;
	export let thickness = 0;
  export let playerVel = [0, 0]
  export let mouse = [0, 0];
  export let start = [0, 0];
  export let angle = 0;
  export let deleted = false;
	export let x = 0 + start[0];
	export let y = 0 + start[1];
  export let velocity = [0, 0]

  size = grow ? 50 : size
  const delta = vec2.sub([], mouse, [x, y]);
  start = vec2.scaleAndAdd([], [x, y], vec2.normalize([], delta), 8)
  x = start[0]
  y = start[1]
  vec2.normalize(delta, delta);
  vec2.rotate(delta, delta, angle)
  const playerSpeed = vec2.len(playerVel);

	renderable({
    render: (props, dt) => {
      const { context } = props;
      if (isOutOfBounds($width, $height, x, y)){
        deleted = true
        return
      }

      let speed;
      if (!grow) {
        speed = (BASE_BULLET_SPEED + playerSpeed)
      } else {
        speed = (BASE_BULLET_SPEED * 4 + playerSpeed);
        size = vec2.dist(start, [x, y])/2.5
        size = size > 50 ? size : 50
        if(size > 225) {
          deleted = true
          return
        }
      }
      velocity = vec2.scale([], delta, speed);

      x += velocity[0] * dt;
      y += velocity[1] * dt;

      context.beginPath();
      context.fillStyle = color;
      context.strokeStyle = color;
      context.lineWidth = thickness;
      context.arc(x, y, size, 0, Math.PI * 2);
      if (!grow) {
        context.stroke();
        context.fill();
      }
    },
    ready: true,
    mounted: true,
  });
</script>

<!-- The following allows this component to nest children -->
<slot></slot>