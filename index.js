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

let ctx = document.querySelector("canvas").getContext("2d");
let wrapper = document.querySelector(".wrapper")

ctx.canvas.height = wrapper.scrollHeight;
ctx.canvas.width = wrapper.scrollWidth;

//
const COLOR_MAX = 256

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
  redMaxRandomness: 0,
  greenMaxRandomness: 0,
  blueMaxRandomness: 0,
  alphaMaxRandomness: 0, // TODO: Put into the UI

  rotation: {
	  // Rotation randomness appliable to each box
	  rotationMaxRandomness: 0, // TODO: Implement

	},

	// WIDTH/HEIGHT variation appliable to each box
	sizeMaxRandomness: 0, // TODO: Implement

	blocksPerRow: 50,

	// Animate the screen (true/false)
	rerenderBlocks: true,

	// Interval in miliseconds to update screen (animation)
	rerenderBlocksInterval: 1000,

	// if we should automatically randomize if rerendreBlocks is true
	autoRandomize: false,
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
function createBlock(color, x, y, width, height, extraParams) {

	const {rotationMaxRandomness} = extraParams

	ctx.save()

	if (rotationMaxRandomness) {
		ctx.rotate(random(rotationMaxRandomness) * (Math.PI / 180))
	}

	ctx.fillStyle = color
	ctx.fillRect(x, y, width, height)

	// draw your object
	ctx.restore();
}

/**
 * Setup the canvas. Determine the block width/height based on the width/height
 * of the canvas.
 */
function setup() {

	const blockHeight = ctx.canvas.height / settings.blocksPerRow
	const blockWidth = ctx.canvas.width / settings.blocksPerRow
	const totalRows = ctx.canvas.height / blockHeight
	const totalColumns = ctx.canvas.width / blockWidth

	const rotationMaxRandomness = settings.rotation.rotationMaxRandomness


	return {
		blockHeight,
		blockWidth,
		totalRows,
		totalColumns,

		rotationMaxRandomness,
	}
}

/**
 * Generate the full canvas area full of blocks.
 * @param {Object} params - generation parameters
 * @param {Number} params.blockHeight Height of the block
 * @param {Number} params.blockWidth Width of the block
 * @param {Number} params.totalRows Total number of blocks across the x-axis
 * @param {Number} params.totalColumns Total number of blocks across the y-axis
 */
function generate(params) {
	const {
		blockHeight,
		blockWidth,
		totalRows,
		totalColumns,
	} = params

	console.assert(blockHeight && blockWidth && totalRows && totalColumns, `missing required params`)



	for (let i = 0; i < totalColumns; i++) {

		const x = i * blockWidth

		for (let j = 0; j < totalRows; j++) {

			const y = j * blockHeight

      if(settings.mode == 'DEFAULT') {
        createBlock(getRandomColor(), x, y, blockWidth, blockHeight, params)
      } else if(settings.mode == 'FROM-UI') {
        createBlock(getsettingsRandomColor(), x, y, blockWidth, blockHeight, params)
      }

		}
	}
}

/**
 * Applys scripting state to ui
 */
function applyScriptState() {
	document.querySelector('#red-offset').value = settings.redValue
	document.querySelector('#red-randomness').value = settings.redMaxRandomness
	document.querySelector('#green-offset').value = settings.greenValue
	document.querySelector('#green-randomness').value = settings.greenMaxRandomness
	document.querySelector('#blue-offset').value = settings.blueValue
	document.querySelector('#blue-randomness').value = settings.blueMaxRandomness
	document.querySelector('#rerender-cb').checked = settings.rerenderBlocks
	document.querySelector('#rerender-cb').checked = settings.rerenderBlocks


}

/**
 * Applys UI state to scripting state
 */
function applyUIState() {

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


}

function generateBtnClick(mouseEvent) {
	applyUIState()
  generate(setup())
}

function hideUIBtnClick(mouseEvent) {
  toggleUIVisibility()
}

function rerenderCbChangeHandler(changeEvent) {
  settings.rerenderBlocks = changeEvent.target.checked
}

/**
 * Dynamically update setting
 * NOTE: does not handle nested objects
 */
function updateSetting(key, value) {
	settings[key] = value
}

function randomizeState() {
	settings.redValue = random(COLOR_MAX)
	settings.redMaxRandomness = random(COLOR_MAX)
	settings.greenValue = random(COLOR_MAX)
	settings.greenMaxRandomness = random(COLOR_MAX)
	settings.blueValue = random(COLOR_MAX)
	settings.blueMaxRandomness = random(COLOR_MAX)
	applyScriptState()
}

function randomizeBtnClick() {
	randomizeState()
	generate(setup())
}

function setupUI() {
  document.querySelector("#generate").onclick = generateBtnClick
  document.querySelector("#hide").onclick = hideUIBtnClick
  document.querySelector("#randomBtn").onclick = randomizeBtnClick
  document.querySelector("#rerender-cb").onchange = rerenderCbChangeHandler
  document.querySelector("#red-offset").oninput = (e) => updateSetting('redValue', parseInt(e.target.value))
  document.querySelector("#green-offset").oninput = (e) => updateSetting('greenValue', parseInt(e.target.value))
  document.querySelector("#blue-offset").oninput = (e) => updateSetting('blueValue', parseInt(e.target.value))
  document.querySelector("#auto-randomize-checkbox").oninput = (e) => updateSetting('autoRandomize', e.target.checked)

  wrapper.onclick = toggleUIVisibility
}

function toggleUIVisibility() {

  let UIDisplayStyle = document.querySelector(".ui-wrapper").style.display
  document.querySelector(".ui-wrapper").style.display = ((UIDisplayStyle != 'none') ? 'none' : 'flex')

}

function clearScreen() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * Init application. Set block and total row/column settings and populate the
 * canvas with blocks.
 */
function main() {
	applyScriptState()

	rerenderInterval = setInterval(() => {

		if(settings.rerenderBlocks) {
			if (settings.autoRandomize) {
				randomizeState()
			}
			clearScreen()
			applyUIState()
			generate(setup())
		}

	}, settings.rerenderBlocksInterval);

  generate(setup())
}

// Apply listeners to user interface (todo: update front-end based on internal state
// at start-time)
setupUI()

// Generate the screen with cool boxes
main()
