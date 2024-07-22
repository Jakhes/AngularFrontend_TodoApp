import { AfterViewInit, Component } from '@angular/core';

// three.js imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-three',
  standalone: true,
  imports: [],
  templateUrl: './three.component.html',
  styleUrl: './three.component.scss',
})
export class ThreeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const render = new THREE.WebGLRenderer({ antialias: true });
    render.setSize(w, h);
    document.body.appendChild(render.domElement);

    const fov = 70;
    const aspect = w / h;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    const scene = new THREE.Scene();

    const controls = new OrbitControls(camera, render.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const geo = new THREE.IcosahedronGeometry(1.0, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.scale.setScalar(1.001);
    mesh.add(wireMesh);

    const hemiLight = new THREE.HemisphereLight(0xd6542c, 0x124c81);
    scene.add(hemiLight);

    const matrerial = new THREE.PointsMaterial({
      color: 0xffffcc,
      size: 0.008,
    });

    const geometry = new THREE.BufferGeometry();
    const particleCnt = 1000;

    const posArray = new Float32Array(particleCnt * 3);
    for (let index = 0; index < particleCnt * 3; index++) {
      posArray[index] = Math.random() * 8 - 4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const pointsMesh1 = new THREE.Points(geometry, matrerial);
    const pointsMesh2 = new THREE.Points(geometry, matrerial);
    scene.add(pointsMesh1);
    scene.add(pointsMesh2);

    const rotationSpeed = 0.0002;

    pointsMesh1.translateX(1);
    camera.rotateZ(1);
    camera.translateY(1);
    camera.rotateY(-1);
    function animate(t = 0) {
      mesh.rotateY(0.005);
      pointsMesh1.rotateY(rotationSpeed * 2);
      pointsMesh1.rotateX(-rotationSpeed * 2);
      pointsMesh2.rotateY(-rotationSpeed);
      pointsMesh2.rotateX(rotationSpeed);
      requestAnimationFrame(animate);
      render.render(scene, camera);
      controls.update();
    }
    animate();
  }
}
