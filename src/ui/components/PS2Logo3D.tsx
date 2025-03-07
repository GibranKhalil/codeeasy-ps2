import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader, OrbitControls } from 'three-stdlib';

const PS2Logo3DModel = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentMountRef = mountRef.current;

    if (currentMountRef) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, currentMountRef.offsetWidth / currentMountRef.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(currentMountRef.offsetWidth, currentMountRef.offsetHeight);
      currentMountRef.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 10);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(5, 0, 5).normalize();
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      pointLight.position.set(0, 5, 0);
      scene.add(pointLight);

      const loader = new GLTFLoader();
      loader.load('/3dModels/playstation_2_logo.glb', (glb) => {
        scene.add(glb.scene);
        glb.scene.scale.set(0.007, 0.007, 0.007);
        glb.scene.position.set(0, 0, 0);

        const applyMetallicMaterial = (object: THREE.Object3D | undefined, color: number) => {
          if (object && object instanceof THREE.Mesh) {
            object.material = new THREE.MeshStandardMaterial({
              color: color,
              metalness: 1,
              roughness: 0.2,
              envMapIntensity: 1,
            });
          }
        };

        const logo2 = glb.scene.getObjectByName('Logo_02_-_Default_0');
        const logo3 = glb.scene.getObjectByName('Logo_03_-_Default_0');
        const logo7 = glb.scene.getObjectByName('Logo_07_-_Default_0');
        const logo8 = glb.scene.getObjectByName('Logo_08_-_Default_0');
        const logo9 = glb.scene.getObjectByName('Logo_09_-_Default_0');

        applyMetallicMaterial(logo2, 0xE5484D);
        applyMetallicMaterial(logo3, 0x30A46C);
        applyMetallicMaterial(logo7, 0xFFD60A);
        applyMetallicMaterial(logo8, 0x197CAE);
        applyMetallicMaterial(logo9, 0xFFFFFF);
      });

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.maxPolarAngle = Math.PI / 2;

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);

        controls.update();
        scene.rotation.y += 0.01;

        renderer.render(scene, camera);
      };
      animate();

      return () => {
        currentMountRef?.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={mountRef} className="h-96 w-96 flex justify-center items-center" />;
};

export default PS2Logo3DModel;
