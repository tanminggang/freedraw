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

}

export const lineStageTwo = function ({ obj, x, y }) {

  console.log('lineStageTWO', 'obj', obj, 'x', x, 'y', y)

  obj.context.lineTo(x, y);
  obj.context.stroke();

  if (!obj.connectLines) {
    obj.started = false;
  } else {
    obj.image_buffer = obj.context.getImageData(0, 0, obj.canvas.width, obj.canvas.height)		
  }
  
  obj.textArea.value = obj.textArea.value+`context.lineTo(${x}, ${y});\n`
  obj.textArea.value = obj.textArea.value+`context.stroke();\n`

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
  //obj.canvas.removeEventListener('mousemove', obj.highlight_origin, false)

  if (obj.fill_mode === 0 || obj.points.length === 1) {
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
    //obj.canvas.addEventListener('mousemove', obj.canvas_quadratic_modify, false)

    obj.quadratic_stage = 2;

    obj.points.push(new Point(x, y));
    obj.points.push(new Point(0, 0));
  } else if (obj.fill_mode === 1 || obj.fill_mode === 2) {
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
      points[points.length-2].y,
      x,
      y 
    )
    obj.context.stroke()

    //obj.canvas.addEventListener('mousemove', obj.canvas_quadratic_modify, false)
    obj.quadraticActivated = true

    obj.quadratic_stage = 2

    obj.points.push(new Point(x, y))
    obj.points.push(new Point(x, y))
  }

}

export const quadraticStageThree = function ({ obj, x, y }) {

  console.log('quadraticStageTHREE', 'obj', obj, 'x', x, 'y', y, 'fill_mode', obj.fill_mode, 'points', obj.points)

  if (obj.fill_mode === 0) {
    obj.quadratic_stage = 0
    obj.quadraticActivated = false
  } else if (obj.fill_mode === 1) {
    obj.quadratic_stage = 1

    if ( fill_flag == 0 ) {
      //obj.canvas.addEventListener( 'mousemove', obj.highlight_origin, false)
    } else if ( fill_flag == 1 ) {
      obj.handle_last_stage_click(ev)
    }
  } else if (obj.fill_mode === 2) {
    obj.quadratic_stage = 1

    if (obj.fill_flag === 0) {
      //obj.canvas.addEventListener('mousemove', obj.highlight_origin, false)
    } else if (obj.fill_flag == 1) {
      obj.gradient_stage = 0
      pick_gradient_direction( ev );
      obj.canvas.removeEventListener('click', obj.canvas_click_handler, false)
      obj.canvas.addEventListener('click', obj.pick_gradient_direction, false)
    }
  }

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

  if (obj.fill_mode == 0 || obj.points.length == 3) {
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
  } else if (obj.fill_mode == 1 || obj.fill_mode == 2) {
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

export const highlightOrigin = function ({ obj, ev }) {

  let x, y
  let length = obj.points.length

  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    x = ev.offsetX;
    y = ev.offsetY;
  }

  console.log('highlightOrigin', 'x', x, 'y', y)

  if (Math.abs(x - obj.points[0].x) < 5 && Math.abs(y - obj.points[0].y) < 5) {
    obj.context.beginPath();
    obj.context.arc(obj.points[0].x, obj.points[0].y, 3, 0, 2*Math.PI, true)
    obj.context.fill()
    obj.context.stroke()
    obj.fill_flag = 1
    obj.adj_x = obj.points[0].x
    obj.adj_y = obj.points[0].y
  } else {
    obj.resetToLastFrame()
    obj.fill_flag = 0
  }

}
