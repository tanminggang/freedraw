<template>
<div id="innerWrapper" @mouseup="onBodyMouseUp" @click="onBodyClick">

<table id="canvasTable" width="800" height="740">
  <tr>
    <td>
      <canvas id="editorCanvas" width="390" height="620" @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove" @click="onCanvasClick"></canvas>
    </td>
    <td>
      <textarea id="editorTextArea"></textarea>
    </td>
  </tr>
</table>    

<table id="buttonTable" width="800" height="180">
  <tr>
    <td>
      <slider id="picker" v-model="lineColor" @change-color="onStrokeChange"></slider>
    </td>
    <td>
      <a id="noFill" class="button">no fill</a>
    </td>
    <td>
    </td>
    <td>
      <a id="scribble" @click="onScribbleClick" class="button">scribble</a>
      <a id="clear" @click="onClearClick" class="button">CLEAR</a>
    </td>
  </tr>

  <tr>
    <td>
      <slider id="fill_picker" v-model="fillColor" @change-color="onFillChange"></slider>
    </td>
    <td>
      <a id="fill" class="button">fill</a>
    </td>
    <td>
    </td>
    <td>
      <a id="quadratic" class="button" @click="onQuadraticClick">Quadratic</a>
      <a id="line" class="button" @click="onLineClick">Straight Line</a>
      <div class="field">
        <p class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="connectLines">
            Connect Lines
          </label>
        </p>
      </div>
      <div class="field">
        <p class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="useFill" @click="onFillCheckboxClick">
            Use Fill
          </label>
        </p>
      </div>
    </td>
  </tr>

  <tr>
    <td>
      <slider id="gradient_picker" v-model="gradientColor" @change-color="onGradientChange"></slider>
    </td>
    <td>
      <a id="gradient" class="button">gradient</a>
    </td>
    <td>
    </td>
    <td>
    </td>
    <td>
    </td>
  </tr>

  <tr>
    <td>
      <canvas id="gradientCanvas" width="200" height="50"></canvas>
    </td>
    <td>
      <a id="addStop" class="button">add stop</a>
    </td>
    <td>
      <a id="clearGradient" class="button">clear gradient</a>
    </td>
    <td>
    </td>
    <td>
      <a id="execute" class="button">execute</a>
    </td>
  </tr>
</table>

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
      stroke_mode: 2,
      fill_mode: 0,
      drawing: false,
      lineThickness: 1,
      gradientCanvas: null,
      gradientContext: null,
      gradient_stops: [],
      picker: null,
      fill_picker: null,
      gradient_picker: null,
      oldX: 0,
      oldY: 0,
      textArea: null,
      started: false,
      connectLines: true,
      useFill: false,
      quadratic_stage: 0,
      points: [],
      fill_flag: 0,
      adj_x: 0,
      adj_y: 0,
      quadraticActivated: false,
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
      this.gradient_picker = document.getElementById('gradient_picker');

      this.gradientCanvas = document.getElementById('gradientCanvas'),
      this.gradientContext = gradientCanvas.getContext('2d');
      this.gradientContext.fillStyle = '#eeeeee';
      this.gradientContext.fillRect(0, 0, this.gradientCanvas.width, this.gradientCanvas.height);

      this.canvas = document.getElementById('editorCanvas')
      if (!this.canvas) {
        alert('Error: I cannot find the canvas element!')
        return
      }
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
      console.log('MainView', 'methods', 'onFillChange', val.hex)
      this.fillColor = val
      this.textArea.value = this.textArea.value+`\ncontext.fillStyle = '${this.fillColor.hex}';\n`
    },
    onGradientChange(val) {
      console.log('MainView', 'methods', 'onGradientChange', val)
      this.gradientColor = val
    },
    onCanvasMouseDown(ev) {
      if (this.stroke_mode !== 1 || this.drawing) {
        return
      }

      console.log('MainView', 'methods', 'onCanvasMouseDown', 'stroke_mode', this.stroke_mode)
      console.log('MainView', 'methods', 'onCanvasMouseDown', 'ev.pageX', ev.pageX, 'ev.pageY', ev.pageY)
      let x = ev.pageX - this.canvasLeft
      let y = ev.pageY - this.canvasTop

      console.log('MainView', 'methods', 'onCanvasMouseDown', 'x', x, 'y', y)
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
      if (this.stroke_mode !== 1 || !this.drawing) {
        //console.log('MainView', 'methods', 'onCanvasMouseMove', 'quadraticActivated', this.quadraticActivated)
        if (this.quadraticActivated) {
          quadraticMoveStage({ obj: this, ev })
        }
        return
      }

      console.log('MainView', 'methods', 'onCanvasMouseMove')


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
      if (this.stroke_mode !== 1) {
        return
      }

      console.log('MainView', 'methods', 'onBodyMouseUp')

      this.drawing = false
      this.textArea.value = this.textArea.value+`\n`
    },
    onClearClick() {
      console.log('MainView', 'methods', 'onClearClick')
      this.clearCanvas()
    },
    clearCanvas() {
      console.log('MainView', 'methods', 'clearCanvas')
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.image_buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)		

      this.canvas.width = this.canvas.width

      this.context.fillStyle = '#bbbbbb'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.fillStyle = '#000000'

      this.textArea.value = ``
      this.textArea.value = `let canvas = document.getElementById('editorCanvas');\nlet context = canvas.getContext('2d');\n\ncontext.lineWidth = 1;\n\ncontext.strokeStyle = '${this.lineColor.hex}';\ncontext.fillStyle = '${this.fillColor.hex}';\n`

      this.quadraticActivated = false
      this.quadratic_stage = 0
      this.started = false;
      this.points = [];
    },
    onLineClick() {
      console.log('methods', 'onLineClick')
      this.stroke_mode = 0;
    },
    onScribbleClick() {
      console.log('methods', 'onScribbleClick')
      this.stroke_mode = 1;
    },
    onQuadraticClick() {
      console.log('methods', 'onQuadraticClick')
      this.stroke_mode = 2;
    },
    onCanvasClick(ev) {
      console.log('methods', 'onCanvasClick')

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

      switch (this.stroke_mode) {
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
      console.log('methods', 'onBodyClick', 'id', id, 'quadratic_stage', this.quadratic_stage)
      if (id !== 'editorCanvas' && id !== 'clear' ) {
        this.resetToLastFrame() 
        this.quadraticActivated = false
        this.points = []
        this.quadratic_stage = 0
        this.started = false
      }
    }
  }

}
</script>

<style>
</style>
