import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

const PS2Console3DModel = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentMountRef = mountRef.current;

    if (currentMountRef) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, currentMountRef.offsetWidth / currentMountRef.offsetHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(currentMountRef.offsetWidth, currentMountRef.offsetHeight);
      currentMountRef.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 3);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(5, 0, 5).normalize();
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      pointLight.position.set(0, 5, 0);
      scene.add(pointLight);

      const loader = new GLTFLoader();
      loader.load('/3dModels/playstation_2.glb', (glb) => {
        scene.add(glb.scene);
        glb.scene.scale.set(2, 2, 2);
        glb.scene.rotation.z = Math.PI / 3;
        glb.scene.rotation.y = Math.PI / 2;
        glb.scene.position.set(0, 0, 0);
      });
      

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
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

export default PS2Console3DModel;
