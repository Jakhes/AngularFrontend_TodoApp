import {
  AfterContentInit,
  AfterViewInit,
  Component,
  computed,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

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
export class ThreeComponent implements OnInit {
  /* @ViewChild('canvas', { static: false })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private camera!: THREE.PerspectiveCamera;

  private canvas!: HTMLCanvasElement;

  private loader = new THREE.TextureLoader();
  private geometry = new THREE.BoxGeometry(1, 1, 1);
  private material = new THREE.MeshBasicMaterial();

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  @Input() public rotationSpeedX: number = 0.05;
  @Input() public rotationSpeedY: number = 0.01;

  @Input() public cameraZ: number = 400;
  @Input() public fieldOfView: number = 1;
  @Input('nearClipping') public nearClippingPlane: number = 1;
  @Input('farClipping') public farClippingPlane: number = 1000;

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.add(this.cube);

    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  ngOnDestroy(): void {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    let component: ThreeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    });
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.createScene();
    this.startRenderingLoop();
  }
 */

  ngOnInit(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const render = new THREE.WebGLRenderer({ antialias: true });
    render.setSize(w, h);
    document
      .querySelector<HTMLElement>('app-three')
      ?.appendChild(render.domElement);

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
