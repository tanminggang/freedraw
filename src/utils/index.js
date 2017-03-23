function Point( x, y ) {
	this.x = x;
	this.y = y;
}

export const lineStageOne = function ({ obj, x, y }) {

  console.log('lineStageONE', 'straightCount', obj.straightCount, 'useFill', obj.useFill, 'x', x, 'y', y)

  obj.canvas.removeEventListener('mousemove', obj.highlightOrigin, false)

  obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)
  obj.fill_chain_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)

  obj.context.beginPath()
  obj.context.arc(x, y, 3, 0, 2*Math.PI, true)
  obj.context.fill()
  obj.context.stroke()

  obj.context.beginPath();
  obj.context.moveTo(x, y);

  obj.started = true;

  obj.textArea.value = obj.textArea.value+`\ncontext.beginPath();\n`
  obj.textArea.value = obj.textArea.value+`context.moveTo(${x}, ${y});\n`

  obj.straightCount = 0

  obj.points = []
  obj.points.push(new Point(x, y))

}

export const lineStageTwo = function ({ obj, x, y }) {

  console.log('lineStageTWO', 'straightCount', obj.straightCount, 'useFill', obj.useFill, 'x', x, 'y', y)
  console.log('lineStageTWO', 'fill_mode', obj.fill_mode, 'fill_flag', obj.fill_flag)

  if (obj.straightCount == 0) {
    obj.context.putImageData(obj.image_buffer, 0, 0)
  }

  if (obj.fill_flag == 0) {
    obj.points.push(new Point(x, y))

    console.log('lineTo', x, y, 'stroke')
    obj.context.lineTo(x, y)
    obj.context.stroke()
  } else {
    console.log('lineTo', obj.points[0].x, obj.points[0].y, 'finalStroke')

    obj.points.push(new Point(obj.points[0].x, obj.points[0].y))

    if (obj.stroke_mode == 0) {
      obj.context.beginPath()
      obj.context.moveTo(obj.points[0].x, obj.points[0].y)

      for (let i=0; i<obj.points.length; i++) {
        console.log('obj.points[i], x, y', obj.points[i].x, obj.points[i].y)
        obj.context.lineTo(obj.points[i].x, obj.points[i].y) 
        if (i == obj.points.length-1) {
          obj.context.stroke()
        }
      }
    }
  }

  if (obj.useFill && obj.fill_mode == 1) {
    obj.context.fill();
  }

  if (!obj.connectLines) {
    obj.started = false;
  } else {
    console.log('lineStageTwo', 'getImageData') 
    obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)		
  }
  
  if (obj.fill_flag == 0) {
    obj.textArea.value = obj.textArea.value+`context.lineTo(${x}, ${y});\n`
  } else {
    obj.textArea.value = obj.textArea.value+`context.lineTo(${obj.points[0].x}, ${obj.points[0].y});\n`
  }
  
  if (!obj.connectLines) {
    obj.textArea.value = obj.textArea.value+`context.stroke();\n`
  }

  obj.straightCount++

  if (obj.connectLines && obj.useFill) {
    if (obj.fill_mode == 1) {
      if (obj.fill_flag == 0) {
        obj.canvas.addEventListener('mousemove', obj.highlightOrigin, false)
      } else if (obj.fill_flag == 1) {
        obj.canvas.removeEventListener('mousemove', obj.highlightOrigin, false)
        obj.handleLastStageClick()
      }
    } else if (obj.fill_mode == 2) {
      if (obj.fill_flag == 0) {
        obj.canvas.addEventListener('mousemove', obj.highlightOrigin, false)
      } else if (obj.fill_flag == 1) {
        obj.canvas.removeEventListener('mousemove', obj.highlightOrigin, false)

        obj.gradient_stage = 0
        obj.pickingGradient = true
        obj.canvas.addEventListener('click', obj.pickGradientDirection, false)
      }
    }
  }

  for (let i=0; i<obj.points.length; i++) {
    console.log('utils', 'lineStageTwo', 'points', obj.points[i].x, obj.points[i].y)
  }

}

export const quadraticStageOne = function ({ obj, x, y }) {

  console.log('quadraticStageONE', 'obj', obj, 'x', x, 'y', y, 'fill_mode', obj.fill_mode, 'points', obj.points)

  obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)
  obj.fill_chain_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)

  let len = obj.points.length
  for (let i=0; i<len; i++ ) {
    obj.points.pop()
  }

  obj.context.beginPath()
  obj.context.arc(x, y, 3, 0, 2*Math.PI, true)
  obj.context.fill()
  obj.context.stroke()

  obj.context.beginPath()
  obj.context.moveTo(x, y)

  obj.quadratic_stage = 1
  //console.log('NOW', 'STAGE', obj.quadratic_stage)

  obj.points.push(new Point(x, y))

}

export const quadraticStageTwo = function ({ obj, x, y }) {

  console.log('quadraticStageTWO', 'obj', obj, 'x', x, 'y', y, 'fill_mode', obj.fill_mode, 'points', obj.points)
  obj.canvas.removeEventListener('mousemove', obj.highlightOrigin, false)

  if (!obj.useFill || obj.points.length === 1) {
    obj.resetToLastFrame()

    obj.context.quadraticCurveTo(
      obj.points[0].x,
      obj.points[0].y,
      x,
      y 
    )
    obj.context.stroke()

    obj.quadraticActivated = true
    console.log('fill_mode', obj.fill_mode, 'canvas', obj.canvas, 'quadraticActivated', obj.quadraticActivated)
    obj.canvas.addEventListener('mousemove', obj.canvasQuadraticModify, false)

    obj.quadratic_stage = 2;

    obj.points.push(new Point(x, y));
    obj.points.push(new Point(0, 0));
  } else { // (obj.fill_mode === 1 || obj.fill_mode === 2)
    if (obj.fill_flag === 1) {
      x = obj.adj_x
      y = obj.adj_y
    }

    obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)		
    obj.resetToLastFrame()

    obj.context.beginPath()
    obj.context.moveTo(
      obj.points[obj.points.length-2].x, 
      obj.points[obj.points.length-2].y
    )
    obj.context.quadraticCurveTo(
      obj.points[obj.points.length-2].x,
      obj.points[obj.points.length-2].y,
      x,
      y 
    )
    obj.context.stroke()

    obj.canvas.addEventListener('mousemove', obj.canvasQuadraticModify, false)
    obj.quadraticActivated = true

    obj.quadratic_stage = 2

    obj.points.push(new Point(x, y))
    obj.points.push(new Point(x, y))
  }

}

export const quadraticStageThree = function ({ obj, x, y }) {

  console.log('quadraticStageTHREE', 'obj', obj, 'x', x, 'y', y, 'fill_mode', obj.fill_mode, 'points', obj.points)

  if (!obj.useFill) {
    obj.quadratic_stage = 0
  } else {
    if (obj.fill_mode == 1) {
      obj.quadratic_stage = 1

      if (obj.fill_flag == 0) {
        obj.canvas.addEventListener('mousemove', obj.highlightOrigin, false)
      } else if (obj.fill_flag == 1) {
        obj.handleLastStageClick()
      }
    } else if (obj.fill_mode == 2) {
      obj.quadratic_stage = 1

      if (obj.fill_flag == 0) {
        obj.canvas.addEventListener('mousemove', obj.highlightOrigin, false)
      } else if (obj.fill_flag == 1) {
        obj.gradient_stage = 0
        obj.pickingGradient = true
        obj.canvas.addEventListener('click', obj.pickGradientDirection, false)
      }
    }
  }

  obj.image_buffer = obj.context.getImageData( 0, 0, obj.canvas.width, obj.canvas.height );		
  obj.canvas.removeEventListener('mousemove', obj.canvasQuadraticModify, false)

  obj.quadraticActivated = false

}

export const quadraticMoveStage = function ({ obj, ev }) {

  console.log('quadraticMoveStage') 

  let x, y;
  let length = obj.points.length;

  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }

  obj.resetToLastFrame()

  if (!obj.useFill || obj.points.length == 3) {
    obj.context.beginPath()
    obj.context.moveTo(obj.points[0].x, obj.points[0].y)
    obj.context.quadraticCurveTo(
      x,
      y,
      obj.points[1].x,
      obj.points[1].y 
    )
    obj.context.stroke()

    obj.points[2].x = x;
    obj.points[2].y = y;
  } else {
    obj.context.beginPath()
    obj.context.moveTo(obj.points[length-4].x, obj.points[length-4].y);
    obj.context.quadraticCurveTo(
      x,
      y,
      obj.points[length-2].x,
      obj.points[length-2].y 
    )
    obj.context.stroke()

    obj.points[length-1].x = x;
    obj.points[length-1].y = y;
  }

}

export const execute = function({ obj }) {

  console.log('utils', 'execute', obj.textArea.value.length)

	obj.clearCanvas();

  window.eval(obj.textArea.value);
  
  obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)		

}
