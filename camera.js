function Camera(map) {
  // Initial camera position
  this.x = 0
  this.y = 500

  this.map = map

  // Camera angle
  this.angle = 0

  // Field of view, in degree.
  this.fov = 60

  // Max distance to draw
  this.maxDistance = 1500
}

Camera.prototype.project = function(map, canvas) {
  var angle = this.angle - (this.fov / 2)
  var angleIncrement = this.fov / canvas.width

  var distanceFromScreen = canvas.width / 2 / Math.tan(this.fov / 2 * DEG)

  var context = canvas.getContext("2d")

  for (var x = 0; x < canvas.width; x++) {
    var distance = this.castRay(angle, map)

    distance = distance * Math.cos((this.angle - angle) * DEG)

    var sliceHeight = map.wallHeight / distance * distanceFromScreen

    var y = canvas.height / 2 - sliceHeight / 2

    context.fillStyle = '#11AE79'
    context.fillRect(x, y, 1, sliceHeight)

    // apply shade
    context.fillStyle = '#000'
    context.globalAlpha = distance / this.maxDistance
    context.fillRect(x, y, 1, sliceHeight)
    context.globalAlpha = 1

    angle += angleIncrement
  }
}

function distance(xa, xb, ya, yb) {
  return Math.sqrt(Math.pow(xb - xa, 2) + Math.pow(yb - ya, 2))
}

Camera.prototype.horizontalIntersection = function(alpha, map) {
  var Ya, Xa, point = {x: 0, y: 0}

  if (alpha > 180) { // facing up
    Ya = -map.blockSize
    point.y = Math.floor(this.x / map.blockSize) * (map.blockSize) - 1
  }
  else { // facing down
    Ya = map.blockSize
    point.y = Math.floor(this.y / map.blockSize) * (map.blockSize) + map.blockSize
  }

  Xa = map.blockSize / Math.tan(alpha * DEG)
  point.x = this.x + (this.y - point.y) / Math.tan(alpha * DEG)

  while (true) {
    var hit = map.get(point.x, point.y)

    if (hit) {
      // console.log(length)
      return distance(this.x, point.x, this.y, point.y)
    }

    point.x += Xa
    point.y += Ya
  }
}

Camera.prototype.verticalIntersection = function(alpha, map) {
  var Ya, Xa, point = {x: 0, y: 0}

  if (alpha > 270 || alpha < 90) { // facing right
    Xa = map.blockSize
    point.x = Math.floor(this.x / map.blockSize) * (map.blockSize) + map.blockSize
  }
  else { // facing left
    Xa = -map.blockSize
    point.x = Math.floor(this.x / map.blockSize) * (map.blockSize) - 1
  }

  Ya = map.blockSize * Math.tan(alpha * DEG)
  point.y = this.y + (this.x - point.x) * Math.tan(alpha * DEG)

  while (true) {
    var hit = map.get(point.x, point.y)

    if (hit) {
      // console.log(length)
      return distance(this.x, point.x, this.y, point.y)
    }

    point.x += Xa
    point.y += Ya
  }
}

Camera.prototype.castRay = function(alpha, map) {
  // Ensure angle is positive and < 360 to simplify facing up or down checks
  var alpha = 360 - Math.abs(alpha % 360)

  var hdist = this.horizontalIntersection(alpha, map),
      vdist = this.verticalIntersection(alpha, map)

  return Math.min(Math.min(hdist, vdist), this.maxDistance)
}

Camera.prototype.move = function(distance) {
  x = this.x + Math.cos(this.angle * DEG) * distance
  y = this.y + Math.sin(this.angle * DEG) * distance

  if (this.map.get(Math.ceil(x), Math.ceil(y)) != 1) {
    this.x = Math.floor(x)
    this.y = Math.floor(y)
  }
}

Camera.prototype.strafe = function(distance) {
  if (this.angle >= 0)
    strafe_angle = 90 - this.angle
  else
    strafe_angle = this.angle + 90

  x = this.x + Math.cos(strafe_angle * DEG) * distance
  y = this.y + Math.sin(strafe_angle * DEG) * distance

  if (this.map.get(Math.ceil(x), Math.ceil(y)) != 1) {
    this.x = Math.floor(x)
    this.y = Math.floor(y)
  }
}
