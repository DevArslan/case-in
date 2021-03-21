import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import * as CANNON from 'cannon';
import { threeToCannon } from 'three-to-cannon';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Clock } from 'three/src/core/Clock.js';
import CannonDebugRenderer from './../../utils/cannonDebugRenderer';

@Component({
  selector: 'trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css'],
})
export class TrainerComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') private canvasRef: ElementRef;
  title = 'bunker';
  clock;
  scene;
  world;
  camera;
  renderer;
  controls;
  cubesOverhang: Array<any> = [];
  cubes: Array<any> = [];
  modelsOverhang: Array<any> = [];
  models: Array<any> = [];
  wagons: Array<any> = [];
  wagonsOverhang: Array<any> = [];
  latch;
  latchOverhang;
  cannonDebugRenderer;
  currentWagonNumber = 0;
  cubesQueue = 0;
  latchIsOpen: boolean = false;

  constructor(
    private _mqttService: MqttService,
    private ngRenderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.createScene();
    this.initSettings();
    this.createLight();
    this.initCannon();
    this.createBunker();
    this.createLatch(2.9, 2.9, 0.1);
    this.createWagon();

    setInterval(() => this.createCube(), 200);

    this.cannonDebugRenderer = new CannonDebugRenderer(this.scene, this.world);
    this.openLatch();
    this.renderScene();
  }

  ngOnInit(): void {
    // this.subscribeOnBroker();
  }

  initSettings() {
    this.camera.position.z = 5;
  }

  subscribeOnBroker() {
    this._mqttService.observe('xbee').subscribe((message: IMqttMessage) => {
      console.log(message.payload.toString());
      this.latchIsOpen ? this.closeLatch() : this.openLatch();
    });
  }

  createScene() {
    this.clock = new Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#ffffff');
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.camera.position.set(100, 100, 100);
    console.log(this.canvasRef.nativeElement);
    this.renderer = new THREE.WebGLRenderer(this.canvasRef.nativeElement);
    this.canvasRef.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.setSize(
      this.canvasRef.nativeElement.offsetWidth,
      this.canvasRef.nativeElement.offsetHeight,
    );
    // this.canvasRef.nativeElement.append(this.renderer.domElement);
    // this.ngRenderer.setStyle(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createLight() {
    const light = new THREE.PointLight(0xffffff, 1, 500);
    light.position.set(15, 15, 15);
    this.scene.add(light);
  }

  createLatch(height, width, thickness) {
    const geometry = new THREE.BoxGeometry(width, thickness, height);
    const material = new THREE.MeshPhongMaterial({ color: '#f4a460' });
    this.latch = new THREE.Mesh(geometry, material);
    this.latch.position.y = 10.5;
    this.scene.add(this.latch);
    this.latchOverhang = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(
        new CANNON.Vec3(width / 2, thickness / 2, height / 2),
      ),
    });
    this.latchOverhang.position.set(0, 10.5, 0);
    this.world.addBody(this.latchOverhang);
  }

  createCube(width: number = 10, height: number = 10, depth: number = 10) {
    const geometry = new THREE.SphereGeometry(0.3);
    const material = new THREE.MeshPhongMaterial({ color: '#f4a460' });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(3, 35, 0);
    this.scene.add(cube);
    this.cubes.push(cube);
    this.cubesQueue += 1;

    // const shape = new CANNON.Box(
    //   new CANNON.Vec3(width / 2, height / 2, depth / 2),
    // );
    let mass = 250;
    const body = new CANNON.Body({ mass, shape: new CANNON.Sphere(0.3) });
    body.position.set(
      Math.random() > 0.5 ? Math.random() * 4 : -Math.random() * 4,
      30,
      Math.random() > 0.5 ? Math.random() * 4 : -Math.random() * 4,
    );
    this.cubesOverhang.push(body);

    this.world.addBody(body);
  }

  createWagon(width: number = 3, height: number = 7.5, thickness = 1) {
    const loader = new GLTFLoader();

    loader.load(
      `assets/models/railway_carriage/railway_carriage.gltf`,
      (model) => {
        this.scene.add(model.scene);
        const downShape = new CANNON.Box(
          new CANNON.Vec3(width, thickness, height),
        );
        const leftShape = new CANNON.Box(
          new CANNON.Vec3(height / 2, width, thickness),
        );
        const frontShape = new CANNON.Box(
          new CANNON.Vec3(thickness, width, height),
        );

        const body = new CANNON.Body({ mass: 0 });
        body.addShape(downShape);
        body.addShape(leftShape, new CANNON.Vec3(0, width, height));
        body.addShape(leftShape, new CANNON.Vec3(0, width, -height));
        body.addShape(frontShape, new CANNON.Vec3(width, width, 0));
        body.addShape(frontShape, new CANNON.Vec3(-width, width, 0));
        body.position.set(0, 3, -6);
        this.wagonsOverhang.push(body);
        this.world.addBody(body);
        this.wagons.push(model.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );
  }

  createBunker() {
    const loader = new GLTFLoader();

    loader.load(
      `assets/models/bunker/bunker.gltf`,
      (model) => {
        this.scene.add(model.scene);

        model.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            var material = new THREE.MeshPhongMaterial({
              color: 0x999999,
            });
            child.material = material;
            (child.material as any).metalness = 0;

            let shape = threeToCannon(child, {
              type: threeToCannon.Type.MESH,
            });

            const body = new CANNON.Body({
              mass: 10000,
              shape,
            });
            console.log(body);
            this.models.push(model.scene);
            this.modelsOverhang.push(body);
            this.world.addBody(body);
          }
        });
      },
      undefined,
      function (error) {
        console.error(error);
      },
    );
  }

  moveCarriage() {
    this.wagonsOverhang.forEach((wagon, index) => {
      wagon.position.set(0, 3, wagon.position.z + 0.15);
    });
  }

  openLatch() {
    this.latchOverhang.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      Math.PI / 2,
    );
    this.latchOverhang.position.set(
      0,
      this.latchOverhang.position.y - 1.45,
      this.latchOverhang.position.z - 1.45,
    );
    this.latchIsOpen = true;
  }

  closeLatch() {
    this.latchOverhang.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0);
    this.latchOverhang.position.set(
      0,
      this.latchOverhang.position.y + 1.45,
      this.latchOverhang.position.z + 1.45,
    );
    this.latchIsOpen = false;
  }

  fallAnimation() {
    this.modelsOverhang.forEach((cube, index) => {
      this.models[index].position.copy(this.modelsOverhang?.[index].position);
      this.models[index].position.y += 41;
      this.models[index].quaternion.copy(
        this.modelsOverhang?.[index].quaternion,
      );
    });
    this.cubesOverhang.forEach((cube, index) => {
      this.cubes[index].position.copy(this.cubesOverhang?.[index].position);
      this.cubes[index].quaternion.copy(this.cubesOverhang?.[index].quaternion);
    });
    this.wagonsOverhang.forEach((cube, index) => {
      this.wagons[index].position.copy(this.wagonsOverhang?.[index].position);
      this.wagons[index].position.y += 39;
      this.wagons[index].quaternion.copy(
        this.wagonsOverhang?.[index].quaternion,
      );
    });

    this.latch.position.copy(this.latchOverhang?.position);
    this.latch.quaternion.copy(this.latchOverhang?.quaternion);
  }

  renderScene() {
    requestAnimationFrame(this.renderScene.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();

    if (!this.latchIsOpen) {
      this.moveCarriage();
    }

    if (
      this.wagonsOverhang[this.wagonsOverhang.length - 1]?.position.z -
        this.modelsOverhang[0]?.position.z >=
        15 &&
      this.wagonsOverhang[this.wagonsOverhang.length - 1]?.position.z -
        this.modelsOverhang[0]?.position.z <=
        15.05
    ) {
      // this.openLatch();
      this.createWagon();
    }
    if (
      this.wagonsOverhang[this.wagonsOverhang.length - 1]?.position.z -
        this.modelsOverhang[0]?.position.z >=
        4 &&
      this.wagonsOverhang[this.wagonsOverhang.length - 1]?.position.z -
        this.modelsOverhang[0]?.position.z <=
        4.05
    ) {
      // this.closeLatch();
    }

    this.world.step(1 / 60);
    this.fallAnimation();
    // this.cannonDebugRenderer.update();
  }

  initCannon() {
    // Setup our world
    this.world = new CANNON.World();
    // const helper = new CannonHelper(this.scene, this.world);
    this.world.quatNormalizeSkip = 0;
    this.world.quatNormalizeFast = false;

    var solver = new CANNON.GSSolver();

    this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    this.world.defaultContactMaterial.contactEquationRelaxation = 4;

    solver.iterations = 10;
    solver.tolerance = 0.1;
    var split = true;
    if (split) this.world.solver = new CANNON.SplitSolver(solver);
    else this.world.solver = solver;

    this.world.gravity.set(0, -10, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    const physicsMaterial = new CANNON.Material('slipperyMaterial');
    var physicsContactMaterial = new CANNON.ContactMaterial(
      physicsMaterial,
      physicsMaterial,
      0.0, // friction coefficient
      0.3, // restitution
    );

    this.world.addContactMaterial(physicsContactMaterial);

    // Create a plane

    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.position.set(0, 0, 0);

    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2,
    );

    // helper.addVisual(groundBody, 'ccc');
    this.world.addBody(groundBody);
  }
}
