/**
 * index.js
 * Populates the canvas element with dynamic 2d content.
 * 
 * @see
 *  https://dma.hamline.edu/~risler01/tools/generate/
 * 
 * @todo
 *  [ ] Dropdown that changes mode
 *  [ ] Rotation
 *  [ ] Size
 *  [ ] Fullscreen functionality
 *  [ ] Other features from generate.fla (randomize-all, unfiltered(?), offset XY, Draw, Grayscale)
 */

let cx = document.querySelector("canvas").getContext("2d");
let wrapper = document.querySelector(".wrapper")

cx.canvas.height = wrapper.scrollHeight;
cx.canvas.width = wrapper.scrollWidth;

// console.log(`cx`, cx)

var settings = {

  // Sets the behavior of the generation. This is the 'choose function' setting 
  // in the generate.fla: Choose Function, Randomize, Unfiltered, Randomize All, 
  // Offset XY, Draw, Grayscale
  // OPTIONS: 'DEFAULT' (completely random), 'FROM-UI' (based on UI values)
  mode: 'FROM-UI',

  // Color of boxes
  redValue: 126,
  greenValue: 126,
  blueValue: 126,
  alphaValue: 1.0, // TODO: Put into the UI
  redMaxRandomness: 46,
  greenMaxRandomness: 46,
  blueMaxRandomness: 46,
  alphaMaxRandomness: 0, // TODO: Put into the UI

  // Rotation randomness appliable to each box
  rotationMaxRandomness: 0, // TODO: Implement

  // WIDTH/HEIGHT variation appliable to each box
  sizeMaxRandomness: 0, // TODO: Implement

  blocksPerRow: 50,

  // Animate the screen (true/false)
  rerenderBlocks: false,

  // Interval in miliseconds to update screen (animation)
  rerenderBlocksInterval: 1000

}

// global value from setInterval for when interval will be changed by user (todo).
var rerenderInterval

/**
 * Returns a random color in HEX format.
 * @example
 *  #02AD3F
 */
function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/**
 * Gets a random number from 0 - maximumValue.
 * @param {Number} maximumValue The highest the random number can be
 */
function random(maximumValue) {
  return Math.round( Math.random() * maximumValue )
}

function getsettingsRandomColor() {

  let redOutput = settings.redValue + ( -Math.round(settings.redMaxRandomness) + random(settings.redMaxRandomness) )
  let greenOutput = settings.greenValue + ( -Math.round(settings.greenMaxRandomness) + random(settings.greenMaxRandomness) )
  let blueOutput = settings.blueValue + ( -Math.round(settings.blueMaxRandomness) + random(settings.blueMaxRandomness) )
  let alphaOutput = settings.alphaValue + ( -Math.round(settings.alphaMaxRandomness) + random(settings.alphaMaxRandomness) )

  return `rgba(${redOutput}, ${greenOutput}, ${blueOutput}, ${alphaOutput})`

}

/**
 * Creates and places a new block in the canvas element and colors it.
 * 
 * @param {String} color Hex value for block fill color
 * @param {Number} x X coordinate of block
 * @param {Number} y Y coordinate of block
 * @param {Number} width Width of the block
 * @param {Number} height Height of the block
 */
function createBlock(color, x, y, width, height) {
	cx.fillStyle = color
	cx.fillRect(x, y, width, height)
}

/**
 * Create a bezier curve and add it to the canvas
 */
function createCurve() {
	cx.beginPath();
	cx.moveTo(10, 90);
	cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
	cx.lineTo(90, 10);
	cx.lineTo(10, 10);
	cx.closePath();
	cx.stroke();
}

/**
 * Setup the canvas. Determine the block width/height based on the width/height
 * of the canvas.
 */
function setup() {

	const blockHeight = cx.canvas.height / settings.blocksPerRow
	const blockWidth = cx.canvas.width / settings.blocksPerRow
	const totalRows = cx.canvas.height / blockHeight
	const totalColumns = cx.canvas.width / blockWidth

	return {
		blockHeight,
		blockWidth,
		totalRows,
		totalColumns,
	}
}

/**
 * Generate the full canvas area full of blocks.
 * 
 * @param {Number} blockHeight Height of the block
 * @param {Number} blockWidth Width of the block
 * @param {Number} totalRows Total number of blocks across the x-axis
 * @param {Number} totalColumns Total number of blocks across the y-axis
 */
function generate(blockHeight, blockWidth, totalRows, totalColumns) {
	for (let i = 0; i < totalColumns; i++) {

		const x = i * blockWidth

		for (let j = 0; j < totalRows; j++) {

			const y = j * blockHeight

      if(settings.mode == 'DEFAULT') {
        createBlock(getRandomColor(), x, y, blockWidth, blockHeight)
      } else if(settings.mode == 'FROM-UI') {
        createBlock(getsettingsRandomColor(), x, y, blockWidth, blockHeight)
      }

		}
	}
}

function generateBtnClick(mouseEvent) {
  
  let newRedOffset = parseInt(document.querySelector('#red-offset').value)
  let newRedRandom = parseInt(document.querySelector('#red-randomness').value)
  let newGreenOffset = parseInt(document.querySelector('#green-offset').value)
  let newGreenRandom = parseInt(document.querySelector('#green-randomness').value)
  let newBlueOffset = parseInt(document.querySelector('#blue-offset').value)
  let newBlueRandom = parseInt(document.querySelector('#blue-randomness').value)

  settings.redValue = newRedOffset
  settings.redMaxRandomness = newRedRandom
  settings.greenValue = newGreenOffset
  settings.greenMaxRandomness = newGreenRandom
  settings.blueValue = newBlueOffset
  settings.blueMaxRandomness = newBlueRandom

  // Generate Output
  const {
    blockHeight,
    blockWidth,
    totalRows,
    totalColumns,
  } = setup()

  generate(blockHeight, blockWidth, totalRows, totalColumns)

}

function hideUIBtnClick(mouseEvent) {
  toggleUIVisibility()
}

function rerenderCbChangeHandler(changeEvent) {
  settings.rerenderBlocks = changeEvent.target.checked
}

function setupUI() {
  document.querySelector("#generate").onclick = generateBtnClick
  document.querySelector("#hide").onclick = hideUIBtnClick
  document.querySelector("#rerender-cb").onchange = rerenderCbChangeHandler 
  wrapper.onclick = toggleUIVisibility
}

function toggleUIVisibility() {

  let UIDisplayStyle = document.querySelector(".ui-wrapper").style.display
  document.querySelector(".ui-wrapper").style.display = ((UIDisplayStyle != 'none') ? 'none' : 'block')

}

/**
 * Init application. Set block and total row/column settings and populate the 
 * canvas with blocks.
 */
function main() {

	rerenderInterval = setInterval(() => {

    if(settings.rerenderBlocks) {

      settings.blocksPerRow *= 1

      const {
        blockHeight,
        blockWidth,
        totalRows,
        totalColumns,
      } = setup()

      generate(blockHeight, blockWidth, totalRows, totalColumns)

    }
    
	}, settings.rerenderBlocksInterval);

  // TODO: Put this into a function; it gets repeated several times
  const {
    blockHeight,
    blockWidth,
    totalRows,
    totalColumns,
  } = setup()

  generate(blockHeight, blockWidth, totalRows, totalColumns)

}

// Apply listeners to user interface (todo: update front-end based on internal state
// at start-time)
setupUI()

// Generate the screen with cool boxes
main()