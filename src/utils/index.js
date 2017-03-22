function Point( x, y ) {
	this.x = x;
	this.y = y;
}

export const lineStageOne = function ({ obj, x, y }) {

  console.log('lineStageONE', 'obj', obj, 'x', x, 'y', y)

  obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)

  obj.context.beginPath()
  obj.context.arc(x, y, 2, 0, 2*Math.PI, true)
  obj.context.fill()
  obj.context.stroke()

  obj.context.beginPath();
  obj.context.moveTo(x, y);

  obj.started = true;

  obj.textArea.value = obj.textArea.value+`\ncontext.beginPath();\n`
  obj.textArea.value = obj.textArea.value+`context.moveTo(${x}, ${y});\n`

  obj.straightCount = 0

}

export const lineStageTwo = function ({ obj, x, y }) {

  console.log('lineStageTWO', 'obj', obj, 'x', x, 'y', y)

  if (obj.straightCount == 0) {
    obj.context.putImageData(obj.image_buffer, 0, 0)
  }

  obj.context.lineTo(x, y);
  obj.context.stroke();

  if (!obj.connectLines) {
    obj.started = false;
  } else {
    obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)		
  }
  
  obj.textArea.value = obj.textArea.value+`context.lineTo(${x}, ${y});\n`
  obj.textArea.value = obj.textArea.value+`context.stroke();\n`

  obj.straightCount++

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
  obj.context.arc(x, y, 2, 0, 2*Math.PI, true)
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
