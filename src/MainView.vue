<template>
<div class="tile is-ancestor" @mouseup="onBodyMouseUp" @click="onBodyClick">
  <div class="tile is-vertical is-3">

    <div class="tile">
      <div class="tile is-vertical">

        <div class="tile is-parent notification is-primary">
          <div class="tile is-child">
            <label class="label">Line Color</label>
            <slider id="picker" v-model="lineColor" @change-color="onStrokeChange"></slider>
          </div>
        </div>

        <div class="tile is-parent notification is-primary" v-show="fill_mode == 1 && useFill && connectLines">
          <div class="tile is-child">
            <label class="label">Fill Color</label>
            <slider id="fill_picker" v-model="fillColor" @change-color="onFillChange"></slider>
          </div>
        </div>

        <div class="tile is-parent notification is-primary" v-show="fill_mode == 2 && useFill">
          <div class="tile is-child">
            <label class="label">Gradient Color</label>
            <div class="level">
              <slider id="gradient_picker" v-model="gradientColor" @change-color="onGradientChange"></slider>
            </div>
            <div class="level">
              <canvas id="gradientCanvas" height="50" class="level-item"></canvas>
            </div>
            <div class="level">
              <!--<a id="gradient" class="button level-item" @click="onGradientModeClick">gradient</a>-->
              <p class="control">
                <a id="addStop" class="button level-item" @click="onAddStopClick">Add Color Stop</a>
              </p>
              <p class="control">
                <a id="clearGradient" class="button level-item" @click="onClearGradientClick">Clear Gradient</a>
              </p>
            </div>
          </div>
        </div>

        <div class="tile is-parent notification is-primary" style="height:200px">
          <div class="tile is-child">
            <div class="field">
              <label class="label">Line Type</label>
              <p class="control">
                <label class="radio">
                  <input type="radio" name="strokeType" value="0" v-model="stroke_mode">
                  Straight
                </label>
              </p>
              <p class="control">
                <label class="radio">
                  <input type="radio" name="strokeType" value="1" v-model="stroke_mode">
                  Scribble
                </label>
              </p>
              <p class="control">
                <label class="radio">
                  <input type="radio" name="strokeType" value="2" v-model="stroke_mode">
                  Quadratic
                </label>
              </p>
            </div>
          </div>

          <div class="tile is-child" v-show="stroke_mode != 1">
            <label class="label">Options</label>
            <div class="field">
              <p class="control">
                <label class="checkbox">
                  <input type="checkbox" v-model="connectLines">
                  Link lines
                </label>
              </p>
              <p class="control" v-show="connectLines">
                <label class="checkbox">
                  <input type="checkbox" v-model="useFill" @click="onFillCheckboxClick">
                  Use fill
                </label>
              </p>
            </div>
          </div>

          <div class="tile is-child" v-show="stroke_mode != 1 && useFill && connectLines">
            <div class="field">
              <label class="label">Fill Type</label>
              <p class="control">
                <label class="radio">
                  <input type="radio" name="fillType" value="1" v-model="fill_mode">
                  Solid
                </label>
              </p>
              <p class="control">
                <label class="radio">
                  <input type="radio" name="fillType" value="2" v-model="fill_mode">
                  Gradient
                </label>
              </p>
            </div>
          </div>
        </div>

        <div class="tile is-parent notification is-primary">
          <div class="tile is-child">
            <label class="label">Commands</label>
            <div class="level">
              <p class="control">
                <a id="execute" class="button" @click="onClickExecute">RUN CODE</a>
              </p>
              <p class="control">
                <a id="clear" @click="onClearClick" class="button">ERASE ALL</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="tile is-parent is-vertical">
        <div class="tile is-child">
          <label class="label">Drawing Canvas</label>
          <canvas id="editorCanvas" width="600" height="300" @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove" @click="onCanvasClick" class="level-item"></canvas>
        </div>
        <div class="tile is-child">
          <label class="label">Drawing Code</label>
          <div class="level">
            <textarea id="editorTextArea" class="textarea level-item"></textarea>
          </div>
        </div>
      </div>

    </div>

  </div>
</div>
</template>

<script>
import {
  lineStageOne,
  lineStageTwo,
  quadraticStageOne,
  quadraticStageTwo,
  quadraticStageThree,
  quadraticMoveStage,
  execute,
} from './utils'

import { Slider } from 'vue-color'

function Point( x, y ) {
	this.x = x;
	this.y = y;
}

export default {

  name: 'main',
  components: {
    Slider
  },
  data () {
    return {
      lineColor: {
        hex: '#194d33', a: 1
      },
      fillColor: {
        hex: '#599d33', a: 1
      },
      gradientColor: {
        hex: '#294d93', a: 1
      },
      canvas: null,
      context: null,
      image_buffer: null,
      fill_change_buffer: null,
      stroke_mode: "0",
      fill_mode: "1",
      drawing: false,
      lineThickness: 1,
      gradientCanvas: null,
      gradientContext: null,
      gradient_stops: [],
      gradient: null,
      picker: null,
      fill_picker: null,
      gradient_picker: null,
      oldX: 0,
      oldY: 0,
      textArea: null,
      started: false,
      connectLines: true,
      useFill: true,
      quadratic_stage: 0,
      points: [],
      fill_flag: 0,
      adj_x: 0,
      adj_y: 0,
      quadraticActivated: false,
      gradient_point_1: new Point(0, 0),
      gradient_point_2: new Point(0, 0),
      gradient_stage: 0,
      pickingGradient: false,
      straightCount: 0,
    }
  },
  created () {
  },
  mounted () {
    console.log('MainView', 'mounted')
    this.init()
  },
  computed: {
    canvasLeft() {
      let left = 0
      let ptr = this.canvas

      do {
        left += ptr.offsetLeft || 0
        ptr = ptr.offsetParent
      } while(ptr)

      return left
    },
    canvasTop() {
      let top = 0
      let ptr = this.canvas

      do {
        top += ptr.offsetTop || 0
        ptr = ptr.offsetParent
      } while(ptr)

      return top
    }
  },
  methods: {
    init() {
      console.log('MainView', 'methods', 'init')

      this.picker = document.getElementById('picker');
      this.fill_picker = document.getElementById('fill_picker');
      this.gradient_picker = document.getElementById('gradient_picker')

      this.gradientCanvas = document.getElementById('gradientCanvas')
      console.log('MainView', 'methods', 'init', document.getElementById('gradientCanvas'))

      this.gradientContext = this.gradientCanvas.getContext('2d')
      this.gradientContext.fillStyle = '#ffffff';
      this.gradientContext.fillRect(0, 0, this.gradientCanvas.width, this.gradientCanvas.height);

      this.canvas = document.getElementById('editorCanvas')
      if (!this.canvas) {
        alert('Error: I cannot find the canvas element!')
        return
      }
      console.log('MainView', 'methods', 'init', 'canvas.width', this.canvas.width, 'canvas.height', this.canvas.height)

      if (!this.canvas.getContext) {
        alert('Error: no canvas.getContext!');
        return;
      }

      this.context = this.canvas.getContext('2d');
      if (!this.context) {
        alert('Error: failed to getContext!')
        return
      }

      this.textArea = document.getElementById('editorTextArea')
      this.textArea.value = `let canvas = document.getElementById('editorCanvas');\nlet context = canvas.getContext('2d');\n\ncontext.lineWidth = 1;\n\ncontext.strokeStyle = '${this.lineColor.hex}';\ncontext.fillStyle = '${this.fillColor.hex}';\n`

      this.context.lineWidth = 1
      this.image_buffer = this.context.createImageData(this.canvas.width, this.canvas.height)
    },
    onStrokeChange(val) {
      console.log('methods', 'onStrokeChange', val.hex, this.lineColor)
      this.lineColor = val
      this.textArea.value = this.textArea.value+`\ncontext.strokeStyle = '${this.lineColor.hex}';\n`
    },
    onFillChange(val) {
      console.log('methods', 'onFillChange', val.hex)
      this.fillColor = val
      this.textArea.value = this.textArea.value+`\ncontext.fillStyle = '${this.fillColor.hex}';\n`
    },
    onGradientChange(val) {
      console.log('methods', 'onGradientChange', val)
      this.gradientColor = val
    },
    onCanvasMouseDown(ev) {
      if (this.stroke_mode != 1 || this.drawing) {
        return
      }

      console.log('methods', 'onCanvasMouseDown', 'stroke_mode', this.stroke_mode)
      console.log('methods', 'onCanvasMouseDown', 'ev.pageX', ev.pageX, 'ev.pageY', ev.pageY)
      let x = ev.pageX - this.canvasLeft
      let y = ev.pageY - this.canvasTop

      console.log('methods', 'onCanvasMouseDown', 'x', x, 'y', y)
      this.drawing = true

      this.context.strokeStyle = this.lineColor.hex;
      this.context.fillStyle = this.lineColor.hex;
      this.context.lineWidth = this.lineThickness

      this.oldX = x
      this.oldY = y

      this.context.beginPath()
      this.textArea.value = this.textArea.value+`context.beginPath();\n`
    },
    onCanvasMouseMove(ev) {
      if (this.stroke_mode != 1 || !this.drawing) {
        //console.log('MainView', 'methods', 'onCanvasMouseMove', 'quadraticActivated', this.quadraticActivated)
        if (this.quadraticActivated) {
          quadraticMoveStage({ obj: this, ev })
        }
        return
      }

      console.log('methods', 'onCanvasMouseMove')

      let x = ev.pageX - this.canvasLeft
      let y = ev.pageY - this.canvasTop

      this.context.strokeStyle = this.lineColor.hex
      this.context.fillStyle = this.fillColor.hex

      if (this.drawing) {
        this.context.moveTo(this.oldX, this.oldY)
        this.context.lineTo(x, y)
        this.context.stroke()

        this.textArea.value = this.textArea.value+`context.lineTo( ${this.oldX}, ${this.oldY} );\n`
        this.textArea.value = this.textArea.value+`context.lineTo( ${x}, ${x} );\n`
        this.textArea.value = this.textArea.value+`context.stroke();\n`
      }

      this.oldX = x
      this.oldY = y
    },
    onBodyMouseUp() {
      if (this.stroke_mode != 1) {
        return
      }

      console.log('methods', 'onBodyMouseUp')

      this.drawing = false
      this.textArea.value = this.textArea.value+`\n`
    },
    onClearClick() {
      console.log('methods', 'onClearClick')
      this.clearCanvas()
      this.clearTextArea()
    },
    onClearGradientClick() {
      console.log('methods', 'onClearGradientClick')

      this.gradient_stops.length = 0;

      this.gradientContext.fillStyle = '#ffffff';
      this.gradientContext.fillRect(0, 0, this.gradientCanvas.width, this.gradientCanvas.height);
    },
    clearTextArea() {
      this.textArea.value = ``
      this.textArea.value = `let canvas = document.getElementById('editorCanvas');\nlet context = canvas.getContext('2d');\n\ncontext.lineWidth = 1;\n\ncontext.strokeStyle = '${this.lineColor.hex}';\ncontext.fillStyle = '${this.fillColor.hex}';\n`
    },
    clearCanvas() {
      console.log('methods', 'clearCanvas')
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.image_buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)		

      this.canvas.width = this.canvas.width

      this.context.fillStyle = '#bbbbbb'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.fillStyle = this.fillColor.hex

      this.quadraticActivated = false
      this.quadratic_stage = 0
      this.started = false;
      this.points = [];
    },
    onCanvasClick(ev) {
      if (this.pickingGradient) {
        return
      }

      console.log('methods', 'onCanvasClick', 'stroke_mode', this.stroke_mode, 'started', this.started)
      console.log('methods', 'onCanvasClick', 'quadratic_stage', this.quadratic_stage)
      console.log('methods', 'onCanvasClick', 'fill_mode', this.fill_mode, 'fill_flag', this.fill_flag)

      let x, y;
      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) {
        x = ev.offsetX;
        y = ev.offsetY;
      }

      this.context.strokeStyle = this.lineColor.hex;
      this.context.fillStyle = this.fillColor.hex;

      switch (parseInt(this.stroke_mode)) {
        case 0:
          if (!this.started) {
            lineStageOne({ obj: this, x, y })
          } else {
            lineStageTwo({ obj: this, x, y })
          }
          break
        case 2:
          switch (this.quadratic_stage) {
            case 0:
              quadraticStageOne({ obj: this, x, y })
              break
            case 1:
              quadraticStageTwo({ obj: this, x, y })
              break
            case 2:
              quadraticStageThree({ obj: this, x, y })
              break
          }

          //this.image_buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)		
          //this.canvas.removeEventListener('mousemove', this.canvas_quadratic_modify, false)
          //this.quadraticActivated = false
          //console.log('quadraticActivated', this.quadraticActivated)
          break
      }
    },
    onFillCheckboxClick() {
      console.log('MainView', 'methods', 'onFillCheckboxClick', fill_picker)
    },
    resetToLastFrame() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.putImageData(this.image_buffer, 0, 0);
      this.context.beginPath()
    },
    onBodyClick(ev) {
      let id = ev.target.id
      console.log('methods', 'onBodyClick', 'id', id, 'quadratic_stage', this.quadratic_stage, 'fill_mode', this.fill_mode)
      if (id !== 'editorCanvas' && id !== 'clear' && id !== 'execute') {
        this.resetToLastFrame() 
        this.quadraticActivated = false
        this.points = []
        this.quadratic_stage = 0
        this.started = false
      }
    },
    onAddStopClick(ev) {
      console.log('methods', 'onAddStopClick', 'gradientColor', this.gradientColor.hex)

      this.gradient_stops.push(this.gradientColor.hex)

      this.gradient = this.gradientContext.createLinearGradient(0, 0, 200, 0)
      for (let i=0; i<this.gradient_stops.length; i++) {
        if (i == 0) {
          this.gradient.addColorStop(0.0, this.gradient_stops[0])
        } else {
          this.gradient.addColorStop(i*(1.0/(this.gradient_stops.length-1)), this.gradient_stops[i])
        }
      }

      this.gradientContext.fillStyle = this.gradient
      this.gradientContext.fillRect(0, 0, this.gradientCanvas.width, this.gradientCanvas.height)
    },
    canvasQuadraticModify(ev) {
      var x, y;
      var length = this.points.length;

      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX;
        y = ev.layerY;
      } else if (ev.offsetX || ev.offsetX == 0) {
        x = ev.offsetX;
        y = ev.offsetY;
      }

      //console.log('methods', 'canvasQuadraticModify', 'x', x, 'y', y)

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.putImageData(this.image_buffer, 0, 0)

      if (!this.useFill || this.points.length == 3) {
        this.context.beginPath();
        this.context.moveTo(this.points[0].x, this.points[0].y)
        this.context.quadraticCurveTo(x, y, this.points[1].x, this.points[1].y)
        this.context.stroke()

        this.points[2].x = x;
        this.points[2].y = y;
      } else if (this.points.length > 3) {
        this.context.beginPath()
        this.context.moveTo(this.points[length-4].x, this.points[length-4].y)
        this.context.quadraticCurveTo(x, y, this.points[length-2].x, this.points[length-2].y)
        this.context.stroke()

        this.points[length-1].x = x
        this.points[length-1].y = y
      }
    },
    highlightOrigin(ev) {
      //console.log('methods', 'highlightOrigin', 'ev', ev)

        let x, y
        let length = this.points.length

        if (ev.layerX || ev.layerX == 0) {
          x = ev.layerX;
          y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) {
          x = ev.offsetX;
          y = ev.offsetY;
        }

      //console.log('methods', 'highlightOrigin', 'x', x, 'y', y)

        if (Math.abs(x - this.points[0].x) < 5 && Math.abs(y - this.points[0].y) < 5) {
          this.context.beginPath()
            this.context.arc(this.points[0].x, this.points[0].y, 3, 0, 2*Math.PI, true)
            this.context.fill()
            this.context.stroke()
            this.fill_flag = 1
            this.adj_x = this.points[0].x
            this.adj_y = this.points[0].y
        } else {
          this.resetToLastFrame()
          this.fill_flag = 0
        }
    },
    handleLastStageClick() {

      console.log('methods', 'handleLastStageClick', 'fill_chain_buffer', this.fill_chain_buffer)

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.putImageData(this.fill_chain_buffer, 0, 0)

      this.context.beginPath()
      this.context.moveTo(this.points[0].x, this.points[0].y)

      for (let i=0; i<(this.points.length-1)/2; i++) {
        this.context.quadraticCurveTo( 
          this.points[(i*2)+2].x,
          this.points[(i*2)+2].y,
          this.points[(i*2)+1].x,
          this.points[(i*2)+1].y 
        )
      }

      if (this.fill_mode == 2) {
        this.context.fillStyle = this.fill_gradient
        /*
        this.fill_gradient = this.context.createLinearGradient( 
            this.gradient_point_1.x, 
            this.gradient_point_1.y, 
            this.gradient_point_2.x,
            this.gradient_point_2.y
        )
        */

        this.textArea.value = this.textArea.value+`\nlet gradient = context.createLinearGradient(${this.gradient_point_1.x}, ${this.gradient_point_1.y}, ${this.gradient_point_2.x}, ${this.gradient_point_2.y});\n`;
        for (let i=0; i<this.gradient_stops.length; i++) {
          if (i == 0) {
            this.textArea.value = this.textArea.value+`gradient.addColorStop(0.0, '${this.gradient_stops[0]}');\n`;
          } else {
            this.gradient.addColorStop(i*(1.0/(this.gradient_stops.length-1)), this.gradient_stops[i])
            this.textArea.value = this.textArea.value+`gradient.addColorStop(${i*(1.0/(this.gradient_stops.length-1))}, '${this.gradient_stops[1]}');\n`;
          }
        }
        this.textArea.value = this.textArea.value+`context.fillStyle = gradient;\n`;

      }

      this.context.fill()
      this.context.stroke()

      this.textArea.value = this.textArea.value+`\ncontext.beginPath();\n`;
      this.textArea.value = this.textArea.value+`context.moveTo(${this.points[0].x}, ${this.points[0].y});\n`;

      for (let i=0; i<(this.points.length-1)/2; i++) {
        this.textArea.value = this.textArea.value+`context.quadraticCurveTo(${this.points[(i*2)+2].x}, ${this.points[(i*2)+2].y}, ${this.points[(i*2)+1].x}, ${this.points[(i*2)+1].y});\n`;
      }

      this.textArea.value = this.textArea.value+`context.fill();\n`;
      this.textArea.value = this.textArea.value+`context.stroke();\n`;

      this.quadratic_stage = 0
      this.fill_flag = 0
      this.pickingGradient = false
      //this.canvas.addEventListener('click', canvas_click_handler, false );

    },
    pickGradientDirection(ev) {

      console.log('editor', 'pick_gradient_direction', 'fill_mode', this.fill_mode)

      if (this.fill_mode != 2) {
        return
      }

      var x, y

      if (ev.layerX || ev.layerX == 0) {
        x = ev.layerX
        y = ev.layerY
      } else if (ev.offsetX || ev.offsetX == 0) {
        x = ev.offsetX
        y = ev.offsetY
      }

      this.context.strokeStyle = this.lineColor.hex
      this.context.fillStyle = this.gradientColor.hex

      if (this.gradient_stage == 0) {
        this.context.beginPath()
        this.context.arc(x, y, 2, 0, 2*Math.PI, true)
        this.context.fill()
        this.context.stroke()

        this.context.beginPath()
        this.context.moveTo(x, y)

        this.gradient_point_1.x = x
        this.gradient_point_1.y = y

        this.gradient_stage = 1
      } else if (this.gradient_stage == 1) {
        this.context.lineTo(x, y)
        this.context.stroke()

        this.gradient_point_2.x = x
        this.gradient_point_2.y = y

        this.fill_gradient = this.context.createLinearGradient( 
            this.gradient_point_1.x, 
            this.gradient_point_1.y, 
            this.gradient_point_2.x,
            this.gradient_point_2.y
        )

        for (let i=0; i<this.gradient_stops.length; i++) {
          if (i == 0) {
            this.fill_gradient.addColorStop(0.0, this.gradient_stops[0])
          } else {
            this.fill_gradient.addColorStop(i*(1.0/(this.gradient_stops.length-1)), this.gradient_stops[i])
          }
        }

        this.gradient_stage = 0

        this.handleLastStageClick()

        //this.canvas.addEventListener('click', canvas_click_handler, false)
        this.canvas.removeEventListener('click', this.pickGradientDirection, false)
      } 

    },
    onClickExecute() {
      console.log('methods', 'onClickExecute')
      execute({ obj: this })
    }
  }

}
</script>

<style>
</style>
