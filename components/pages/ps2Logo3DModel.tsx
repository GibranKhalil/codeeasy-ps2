import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';

const PS2Logo3DModel = () => {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentMountRef = mountRef.current;

        if (currentMountRef) {
            const scene = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(75, currentMountRef.offsetWidth / currentMountRef.offsetHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(currentMountRef.offsetWidth, currentMountRef.offsetHeight);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.5;
            currentMountRef.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);

            const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
            mainLight.position.set(0, 0, 5);
            scene.add(mainLight);

            const rimLight = new THREE.DirectionalLight(0xffffff, 1);
            rimLight.position.set(5, 5, -5);
            scene.add(rimLight);

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
            fillLight.position.set(0, -5, 0);
            scene.add(fillLight);

            const modelGroup = new THREE.Group();
            scene.add(modelGroup);

            const loader = new GLTFLoader();
            loader.load('/3d/playstation_2_logo.glb', (glb) => {
                modelGroup.add(glb.scene);
                glb.scene.scale.set(0.007, 0.007, 0.007);
                glb.scene.position.set(0, 0, 0);

                const applyMetallicMaterial = (object: THREE.Object3D | undefined, color: number) => {
                    if (object && object instanceof THREE.Mesh) {
                        object.material = new THREE.MeshStandardMaterial({
                            color: color,
                            metalness: 0.8,
                            roughness: 0.1,
                            envMapIntensity: 1.2,
                            emissive: new THREE.Color(color).multiplyScalar(0.1)
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

            camera.position.z = 5;

            const animate = () => {
                requestAnimationFrame(animate);

                modelGroup.rotation.y += 0.01;

                renderer.render(scene, camera);
            };
            animate();

            const handleResize = () => {
                if (currentMountRef) {
                    camera.aspect = currentMountRef.offsetWidth / currentMountRef.offsetHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(currentMountRef.offsetWidth, currentMountRef.offsetHeight);
                }
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                currentMountRef?.removeChild(renderer.domElement);
            };
        }
    }, []);

    return <div ref={mountRef} className="overflow-visible min-h-[500px] h-full w-full min-w-[500px] flex justify-center items-center" />;
};

export default PS2Logo3DModel;