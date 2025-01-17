import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

// three.js imports

import p5, { Vector } from 'p5';
import { Vector3 } from 'three';

@Component({
  selector: 'app-mold',
  standalone: true,
  imports: [],
  templateUrl: './mold.component.html',
  styleUrl: './mold.component.scss',
})
export class MoldComponent implements AfterViewInit, OnDestroy {
  private p5Instance: p5 | undefined;
  @ViewChild('canvasContainer', { static: false }) container:
    | ElementRef
    | undefined;
  constructor() {
    this.container = undefined;
  }
  ngAfterViewInit() {
    this.createCanvas();
  }

  ngOnDestroy(): void {
    this.p5Instance?.noLoop();
    this.p5Instance?.remove();
  }
  private createCanvas() {
    this.p5Instance = new p5((p: p5) => {
      class Mold {
        x: number;
        y: number;
        radius: number;
        speed: number;
        heading: number;
        vx: number;
        vy: number;
        rotAngle: number;
        rSensorPos: p5.Vector;
        lSensorPos: p5.Vector;
        fSensorPos: p5.Vector;
        sensorAngle: number;
        sensorDist: number;
        constructor() {
          let offset = 5;
          this.x = p.random(width / 2 - offset, width / 2 + offset);
          this.y = p.random(height / 2 - offset, height / 2 + offset);
          this.radius = p.random(0.2, 1);

          this.speed = p.random(0.5, 5);

          this.heading = p.random(360);
          this.vx = p.cos(this.heading);
          this.vy = p.sin(this.heading);
          this.rotAngle = p.random(10, 90);

          this.rSensorPos = p.createVector(0, 0);
          this.lSensorPos = p.createVector(0, 0);
          this.fSensorPos = p.createVector(0, 0);
          this.sensorAngle = p.random(10, 90);
          this.sensorDist = p.random(2, 30);
        }

        update() {
          this.vx = p.cos(this.heading) * this.speed;
          this.vy = p.sin(this.heading) * this.speed;

          this.x = (this.x + this.vx + width) % width;
          this.y = (this.y + this.vy + height) % height;

          this.getSensorPos(this.rSensorPos, this.heading + this.sensorAngle);
          this.getSensorPos(this.lSensorPos, this.heading - this.sensorAngle);
          this.getSensorPos(this.fSensorPos, this.heading);

          let index, l, r, f;
          index =
            4 * (d * p.floor(this.rSensorPos.y)) * (d * width) +
            4 * (d * p.floor(this.rSensorPos.x));
          r = p.pixels[index];

          index =
            4 * (d * p.floor(this.lSensorPos.y)) * (d * width) +
            4 * (d * p.floor(this.lSensorPos.x));
          l = p.pixels[index];

          index =
            4 * (d * p.floor(this.fSensorPos.y)) * (d * width) +
            4 * (d * p.floor(this.fSensorPos.x));
          f = p.pixels[index];

          if (f > l && f > r) {
            this.heading += 0;
          } else if (f < l && f < r) {
            if (p.random(1) < 0.5) {
              this.heading += this.rotAngle;
            } else {
              this.heading -= this.rotAngle;
            }
          } else if (l > r) {
            this.heading += -this.rotAngle;
          } else if (r > l) {
            this.heading += this.rotAngle;
          }
          /*
    if(f == 0 ) {
      if (p.random(1) < 0.5) {
        this.heading += this.rotAngle;
      } else {
        this.heading -= this.rotAngle;
      }
    }
    if (l > r) {
      this.heading += -this.rotAngle;
    } else if (r > l) {
      this.heading += this.rotAngle;
    }
    */
        }

        display(rgbVec: Vector) {
          p.noStroke();

          p.fill(rgbVec.array());
          p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        }

        getSensorPos(sensor: p5.Vector, angle: number) {
          sensor.x = (this.x + this.sensorDist * p.cos(angle) + width) % width;
          sensor.y =
            (this.y + this.sensorDist * p.sin(angle) + height) % height;
        }
      }

      let molds: {
        display(rgbVec: p5.Vector): unknown;
        update(): unknown;
      }[] = [];
      let num = 6000;
      let d: number;

      let rgb: p5.Vector[] = [];
      let rgbVec: p5.Vector;
      let frameNum = 0;

      let width = window.innerWidth;
      let height = window.innerHeight;

      p.setup = () => {
        if (this.container) {
          // reduce the number of particles for smaller screens
          if (width < 500) {
            num = 2000;
          }
          p.createCanvas(width, height).parent(this.container.nativeElement);

          // limit framerate to a consistent speed
          // Todo: make the rgb effect framerate independent
          p.frameRate(40);

          p.background(20);
          p.angleMode('degrees');
          d = p.pixelDensity();

          for (let i = 0; i < num; i++) {
            molds[i] = new Mold();
          }

          // the Vectors will go through all primary and secondary RGB colors like an animation.
          rgbVec = p.createVector(0, 0, 255);

          // the vector represent the R/x G/y B/z values and the 6 phases when they go up or down.
          rgb[0] = p.createVector(1, 0, 0);
          rgb[1] = p.createVector(0, 0, -1);
          rgb[2] = p.createVector(0, 1, 0);
          rgb[3] = p.createVector(-1, 0, 0);
          rgb[4] = p.createVector(0, 0, 1);
          rgb[5] = p.createVector(0, -1, 0);
        }
      };
      p.draw = () => {
        p.background(0, 6);
        p.loadPixels();

        updateRGBVector();

        for (let i = 0; i < num; i++) {
          molds[i].update();
          molds[i].display(rgbVec);
        }
      };

      function updateRGBVector() {
        // loop the frames between 0 and 1530 for all 6 steps with 255 frames each
        frameNum = frameNum % 1530;
        let index = p.int(frameNum / 255);

        rgbVec.add(rgb[index]);

        frameNum++;
      }
    });
  }
}
