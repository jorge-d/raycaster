function Camera() {
  // Initial camera position
  this.x = 0
  this.y = 5

  // Camera angle
  this.angle = 0

  // Field of view, in degree.
  this.fov = 60

  // Max distance to draw
  this.maxDistance = 15
}

Camera.prototype.project = function(map, canvas) {
  var context = canvas.getContext("2d")

  // Loop over each ray angles to cast
  var angle = this.angle - (this.fov / 2)
  var angleIncrement = this.fov / canvas.width

  // Distance from projection plane
  var distanceFromPlane = canvas.width / 2 / Math.tan(this.fov / 2 * DEG)

  for (var x = 0; x < canvas.width; x++) {
    var distance = this.castRay(angle, map)

    // Correct fish eye distortion
    // Ray angle (angle) need to be made relative to the camera angle.
    distance = distance * Math.cos((this.angle - angle) * DEG)

    var sliceHeight = 1 / distance * distanceFromPlane

    // Center column vertically
    var y = canvas.height / 2 - sliceHeight / 2

    // Draw column slice
    context.fillStyle = '#f0f'
    context.fillRect(x, y, 1, sliceHeight)

    // Shade it based on distance
    context.fillStyle = '#000'
    context.globalAlpha = distance / this.maxDistance
    context.fillRect(x, y, 1, sliceHeight)
    context.globalAlpha = 1

    angle += angleIncrement
  }
}

Camera.prototype.castRay = function(angle, map) {
  var x = this.x
  var y = this.y

  var increment = 0.01
  var xIncrement = Math.cos(angle * DEG) * increment
  var yIncrement = Math.sin(angle * DEG) * increment

  for (var length = 0; length < this.maxDistance; length += increment) {
    x += xIncrement
    y += yIncrement

    var hit = map.get(x, y)

    if (hit) return length
  }
}

Camera.prototype.move = function(distance) {
  this.x += Math.cos(this.angle * DEG) * distance
  this.y += Math.sin(this.angle * DEG) * distance
}
