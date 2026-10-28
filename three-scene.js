import * as THREE from './vendor/three.module.js';

const canvas = document.querySelector('#motionCanvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

if (canvas && !reducedMotion) {
  try {
    const contextOptions = { alpha: true, antialias: !coarsePointer, powerPreference: 'low-power' };
    const context = canvas.getContext('webgl2', contextOptions) || canvas.getContext('webgl', contextOptions);
    if (!context) throw new Error('WebGL is unavailable');
    const renderer = new THREE.WebGLRenderer({ canvas, context, ...contextOptions });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, 0, 12);

    const world = new THREE.Group();
    scene.add(world);

    const acid = new THREE.Color(0xe8ff57);
    const paper = new THREE.Color(0xeee9df);
    const rust = new THREE.Color(0xb9452f);

    const helix = new THREE.Group();
    world.add(helix);

    const coverGeometry = new THREE.BoxGeometry(.62, .92, .055);
    const coverMaterial = new THREE.MeshBasicMaterial({ color: paper, transparent: true, opacity: .075, wireframe: true });
    const accentMaterial = new THREE.MeshBasicMaterial({ color: acid, transparent: true, opacity: .16, wireframe: true });

    const coverCount = coarsePointer ? 14 : 24;
    for (let index = 0; index < coverCount; index += 1) {
      const angle = index * .66;
      const radius = 3.1 + Math.sin(index * .8) * .35;
      const cover = new THREE.Mesh(coverGeometry, index % 6 === 0 ? accentMaterial : coverMaterial);
      cover.position.set(Math.cos(angle) * radius, (index - coverCount / 2) * .42, Math.sin(angle) * 1.2);
      cover.rotation.set(angle * .08, -angle, Math.sin(angle) * .16);
      cover.userData.phase = angle;
      helix.add(cover);
    }

    const ringMaterial = new THREE.MeshBasicMaterial({ color: acid, transparent: true, opacity: .07, wireframe: true });
    [2.1, 3.65, 5.2].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .012, 3, 120), ringMaterial);
      ring.rotation.set(Math.PI / 2 + index * .18, index * .28, index * .12);
      world.add(ring);
    });

    const pointCount = coarsePointer ? 90 : 180;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    for (let index = 0; index < pointCount; index += 1) {
      const radius = 2.8 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi) * .6;
      const color = index % 11 === 0 ? rust : index % 4 === 0 ? acid : paper;
      colors.set(color.toArray(), index * 3);
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ size: .026, transparent: true, opacity: .48, vertexColors: true, sizeAttenuation: true }));
    world.add(points);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    let scrollTarget = 0;
    let frame = 0;
    let visible = !document.hidden;

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      world.scale.setScalar(width < 720 ? .68 : width < 1100 ? .84 : 1);
    }

    function onPointerMove(event) {
      pointerTarget.set((event.clientX / window.innerWidth - .5) * 2, (event.clientY / window.innerHeight - .5) * 2);
    }

    function onScroll() {
      scrollTarget = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    }

    function render(time) {
      if (!visible) return;
      const elapsed = time * .001;
      pointer.lerp(pointerTarget, .045);
      world.rotation.x += ((pointer.y * .12 + scrollTarget * .34) - world.rotation.x) * .035;
      world.rotation.y += ((pointer.x * .16 + scrollTarget * Math.PI * .7) - world.rotation.y) * .026;
      helix.rotation.y = elapsed * .035;
      helix.position.y = Math.sin(elapsed * .28) * .2;
      points.rotation.y = -elapsed * .012;
      points.rotation.z = elapsed * .006;
      helix.children.forEach((cover, index) => {
        cover.position.x += Math.sin(elapsed * .42 + cover.userData.phase) * .0007;
        cover.rotation.z += Math.sin(elapsed * .3 + index) * .00012;
      });
      camera.position.x += ((pointer.x * .28) - camera.position.x) * .025;
      camera.position.y += ((-pointer.y * .22) - camera.position.y) * .025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    }

    function setVisibility() {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(render);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!coarsePointer) window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', setVisibility);
    resize();
    onScroll();
    frame = requestAnimationFrame(render);
  } catch (error) {
    canvas.hidden = true;
    console.info('Three.js scene unavailable; continuing without the decorative layer.', error);
  }
}
