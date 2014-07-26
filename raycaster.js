var DEG = Math.PI / 180 // 1 deg == pi/180 radian

var canvas = document.getElementById("screen")
var map = new Map()
var camera = new Camera(map)
var game = new Game(canvas)

var context = canvas.getContext("2d")

var STRAFE_DISTANCE = 10,
    MOVEMENT_DISTANCE = 10,
    ANGLE_MOVEMENT = 1

game.onFrame(function() {
  if (game.keyPressed.up || game.keyPressed.w) {
    camera.move(MOVEMENT_DISTANCE)
  } else if (game.keyPressed.down || game.keyPressed.s) {
    camera.move(-MOVEMENT_DISTANCE)
  }

  if (game.keyPressed.a) {
    camera.strafe(-STRAFE_DISTANCE);
  } else if (game.keyPressed.d) {
    camera.strafe(STRAFE_DISTANCE);
  }

  if (game.keyPressed.left  || game.keyPressed.q ) {
    camera.angle -= ANGLE_MOVEMENT
  } else if (game.keyPressed.right  || game.keyPressed.e ) {
    camera.angle += ANGLE_MOVEMENT
  }

  context.fillStyle = '#fff'
  context.fillRect(0, 0, canvas.width, canvas.height)

  camera.project(map, canvas)

  // Draw the mini-map
  map.draw(canvas, camera)
})
