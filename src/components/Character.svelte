<script>
	import { enemies, shells, particles, bullets, player, renderable, width, height, score } from '../game.js';
  import { randomNum, randomInt } from '../helpers'
	import vec2 from 'gl-vec2';
  import { GAME_VALUES } from '../constants'
  import { onDestroy } from 'svelte';
	
	export let startX = -500;
	export let startY = $height / 2;
  export let size = 6;
	
	let x = startX;
	let y = startY;
	const velocity = [ 0, 0 ];
	
	let mouse = [$width / 2, $height / 2];
	
  let prevTime = performance.now()

  onDestroy(() => {
    const newParticles = []
    const explosionSize = 60
    for (let i = 0; i < explosionSize; i++) {
      newParticles.push({
        id: {}, 
        start: vec2.add([], [x, y], vec2.random([], randomNum(0, size+3))),
        velocity: vec2.scaleAndAdd([], vec2.random([], randomNum(1, 500)), velocity, randomNum(.2, 1.2)),
        sizeAdjust: randomNum(0, 2),
        inertia: .99,
        colors: ['white', 'orange', 'yellow']
      })
    }
    particles.set([...$particles, ...newParticles])
  })

	renderable({
    render: (props, dt) => {
      const { context } = props;
      
      let position = [ x, y ];
      const delta = vec2.sub([], mouse, position);
      const len = vec2.length(delta);
      if (len >= 25) { 
        vec2.normalize(delta, delta);
        vec2.scale(velocity, delta, len * 10/6);
        x += velocity[0] * dt;
        y += velocity[1] * dt;
      } else {
        velocity[0] = 0;
        velocity[1] = 0;
      }
      
      position[0] = x;
      position[1] = y;

      context.lineCap = 'round';

      const angle = Math.atan2(delta[1], delta[0])

      context.save()
      context.translate(x, y)
      context.rotate(angle + (90*Math.PI)/180)
      context.strokeStyle = '#FFF'
      context.fillStyle = '#FFF'
      context.lineWidth = 4
      context.beginPath()
      context.moveTo(0, -9)
      context.lineTo(7, 7)
      context.lineTo(4, 5)
      context.lineTo(-4, 5)
      context.lineTo(-7, 7)
      context.closePath()
      context.fill()
      context.stroke()
      context.restore()
      context.save()
      context.beginPath()
      context.translate(x, y)
      context.fillStyle = '#0f4c75'
      context.strokeStyle = 'white'
      context.arc(0, 0, size, 0, 2 * Math.PI)
      context.lineWidth = 2
      context.fill()
      context.stroke()
      context.restore()

      player.set({ position, velocity, size })

      let time = performance.now();
      if ( time >= prevTime + GAME_VALUES.FIRE_RATE ) {
        shoot()
        prevTime = time;
      }
    },
    mounted: true,
    ready: true,
  });
		
	function handleMouseMove ({ clientX, clientY }) {
		mouse = [ clientX, clientY ];
	}

  function handleMouseDown () {

    const newParticles = []
    const explosionSize = 50
    const delta = vec2.sub([], mouse, $player.position)
    vec2.normalize(delta, delta)
    
    for (let i = 0; i < explosionSize; i++) {
      if ($shells < 1) return
      const randVec = vec2.rotate([], vec2.scale([], delta, randomNum(200, 3000)), randomNum(-.4, .4))
      newParticles.push({
        id: {}, 
        start: $player.position,
        velocity: vec2.scaleAndAdd([], $player.velocity, randVec, 1.2),
        inertia: .95,
        sizeAdjust: randomNum(0, 1),
        colors: ['white', 'yellow']
      })
    }

    particles.set([...$particles, ...newParticles])

    bullets.set([...$bullets, {
      id: {},
      start: $player.position,
      playerVel: $player.velocity,
      mouse,
      deleted: false,
      grow: true,
    }])

    shells.update(shells => shells ? shells - 1 : shells)
  }

  function shoot() {
    bullets.update(bullets => [...bullets, {
        id: {},
        start: $player.position,
        playerVel: $player.velocity,
        mouse,
        deleted: false,
      }
    ])
  }

  function sign(p1, p2, p3) {
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
  }

  function pointInTriangle(p, p1, p2, p3) {

    const d1 = sign(pt, v1, v2);
    const d2 = sign(pt, v2, v3);
    const d3 = sign(pt, v3, v1);

    const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
  }

  function ptInTriangle(p, p0, p1, p2) {
    const A = 1/2 * (-p1[1] * p2[0] + p0[1] * (-p1[0] + p2[0]) + p0[0] * (p1[1] - p2[1]) + p1[0] * p2[1]);
    const sign = A < 0 ? -1 : 1;
    const s = (p0[1] * p2[0] - p0[0] * p2[1] + (p2[1] - p0[1]) * p[0] + (p0[0] - p2[0]) * p[1]) * sign;
    const t = (p0[0] * p1[1] - p0[1] * p1[0] + (p0[1] - p1[1]) * p[0] + (p1[0] - p0[0]) * p[1]) * sign;
    
    return s > 0 && t > 0 && (s + t) < 2 * A * sign;
}

</script>

<svelte:window
	on:mousemove={handleMouseMove}
  on:mousedown={handleMouseDown} />

<!-- The following allows this component to nest children -->
<slot></slot>
