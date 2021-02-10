<script>
  import { renderable } from '../game.js';
  import { randomNum, randomInt } from '../helpers';
  import vec2 from 'gl-vec2';

  export let start = [0, 0]
  let x = 0 + start[0];
	let y = 0 + start[1];
  export let deleted = false;
  export let inertia = 0.98;
  export let colors = ['orange', 'orange', 'yellow']
  
  let color = colors[randomInt(0, colors.length)]

  export let velocity = [0, 0]
  export let sizeAdjust = 0;
  export let adjustVelocity = [0, 0];
  let size = randomNum(1, 3) + sizeAdjust

  vec2.scaleAndAdd(velocity, velocity, adjustVelocity, .6)

  renderable({
    render: (props, dt) => {
      const { context } = props;
      if(size === 0){
        deleted = true
        return
      }
      
      size -= 6 * dt
      if(size < 0) {
        size = 0
      }
      
      context.beginPath();
      context.fillStyle = color;
      context.arc(x, y, size, 0, 2 * Math.PI);
      context.fill();

      x += (velocity[0] * dt);
      y += (velocity[1] * dt);
      velocity[0] *= (inertia ** (dt*60));
      velocity[1] *= (inertia ** (dt*60));
    },
    ready: true,
    mounted: true,
  });
</script>

<slot />