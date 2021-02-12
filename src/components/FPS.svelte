<script>
	import Text from './Text.svelte';
	import { shells, score, renderable } from '../game';
	
	let text = '';

	let frames = 0;
	let prevTime = performance.now();
	renderable({
    render: (state, dt) => {
      let time = performance.now();
      frames++;
      if ( time >= prevTime + 1000 ) {
        const fps = ((frames * 1000) / (time - prevTime));
        text = `Score: ${$score} | ${fps.toFixed(1)} FPS`;
        prevTime = time;
        frames = 0;
        shells.update(shells => shells < 10 ? shells + .5 : shells)
      }
    },
    ready: true,
    mounted: true,
    data: {
      alwaysOnTop: true,
    }
  });
</script>

<Text
	{text}
	fontSize=20
	fontFamily='Courier New'
	align='left'
	baseline='top'
	x={20}
	y={20} />

<!-- The following allows this component to nest children -->
<slot></slot>