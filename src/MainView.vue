<template>
<div id="innerWrapper" @mouseup="onBodyMouseUp">

<table id="canvasTable" width="800" height="740">
  <tr>
    <td>
      <canvas id="editorCanvas" width="390" height="620" @mousedown="onCanvasMouseDown" @mousemove="onCanvasMouseMove"></canvas>
    </td>
    <td>
      <textarea id="editorTextArea"></textarea>
    </td>
  </tr>
</table>    

<table id="buttonTable" width="800" height="180">
  <tr>
    <td>
      <slider id="picker" v-model="colors" @change-color="onStrokeChange"></slider>
    </td>
    <td>
      <button id="noFill">no fill</button>
    </td>
    <td>
    </td>
    <td>
      <button id="scribble" @click="onScribbleClick">scribble</button>
    </td>
    <td>
      <button id="clear" @click="onClearClick">CLEAR</button>
    </td>
  </tr>

  <tr>
    <td>
      <slider id="fill_picker" v-model="colors" @change-color="onFillChange"></slider>
    </td>
    <td>
      <button id="fill">fill</button>
    </td>
    <td>
    </td>
    <td>
      <button id="quadratic">quadratic</button>
    </td>
  </tr>

  <tr>
    <td>
      <slider id="gradient_picker" v-model="colors" @change-color="onGradientChange"></slider>
    </td>
    <td>
      <button id="gradient">gradient</button>
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
      <button id="addStop">add stop</button>
    </td>
    <td>
      <button id="clearGradient">clear gradient</button>
    </td>
    <td>
    </td>
    <td>
      <button id="execute">execute</button>
    </td>
  </tr>
</table>

</div>
</template>

<script>
import { Slider } from 'vue-color'

export default {

  name: 'main',
  components: {
    Slider
  },
  data () {
    return {
      colors: {
        hex: '#194d33', a: 1
      },
      canvas: null,
      context: null,
      image_buffer: null,
      fill_change_buffer: null,
      stroke_mode: 0,
      fill_mode: 0,
      stroke_color: '#ff0000',
      fill_color: '#0000ff',
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
      this.textArea.value = `let canvas = document.getElementById('editorCanvas')\nlet context = canvas.getContext('2d')\n\ncontext.lineWidth = 1\n\ncontext.strokeStyle = ${this.stroke_color}\ncontext.fillStyle = ${this.fill_color}\n`

      context.lineWidth = 1
      this.image_buffer = context.createImageData(this.canvas.width, this.canvas.height)
    },
    onStrokeChange(val) {
      console.log('MainView', 'methods', 'onStrokeChange', val.hex)
      this.stroke_color = val.hex
    },
    onFillChange(val) {
      console.log('MainView', 'methods', 'onFillChange', val.hex)
      this.fill_color = val.hex
    },
    onGradientChange(val) {
      console.log('MainView', 'methods', 'onGradientChange', val)
      //this.fill_color = val
    },
    onCanvasMouseDown(ev) {
      console.log('MainView', 'methods', 'onCanvasMouseDown', 'stroke_mode', this.stroke_mode)
      if (this.stroke_mode !== 1) {
        return
      }

      console.log('MainView', 'methods', 'onCanvasMouseDown', 'ev.pageX', ev.pageX, 'ev.pageY', ev.pageY)
      let x = ev.pageX - this.canvasLeft
      let y = ev.pageY - this.canvasTop

      console.log('MainView', 'methods', 'onCanvasMouseDown', 'x', x, 'y', y)
      this.drawing = true
      this.context.lineWidth = this.lineThickness

      this.oldX = x
      this.oldY = y

      this.context.beginPath()
      this.textArea.value = this.textArea.value+`context.beginPath();\n`
    },
    onCanvasMouseMove(ev) {
      console.log('MainView', 'methods', 'onCanvasMouseMove')

      if (this.stroke_mode !== 1) {
        return
      }

      let x = ev.pageX - this.canvasLeft
      let y = ev.pageY - this.canvasTop

      this.context.strokeStyle = this.stroke_color
      this.context.fillStyle = this.fill_color
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
      console.log('MainView', 'methods', 'onBodyMouseUp')

      this.drawing = false
      if (this.stroke_mode !== 1) {
        return
      }

      this.textArea.value = this.textArea.value+`\n`
    },
    onClearClick() {
      console.log('MainView', 'methods', 'onClearClick')
      this.clearCanvas()
    },
    clearCanvas() {
      console.log('MainView', 'methods', 'clearCanvas')
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.canvas.width = this.canvas.width

      this.context.fillStyle = '#bbbbbb'
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.context.fillStyle = '#000000'

      this.textArea.value = ``
    },
    onScribbleClick() {
      console.log('MainView', 'methods', 'onScribbleClick')
      this.stroke_mode = 1;
    }
  }

}
</script>

<style>
</style>
