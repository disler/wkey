let cx = document.querySelector("canvas").getContext("2d");
let wrapper = document.querySelector(".wrapper")

cx.canvas.height = wrapper.scrollHeight;
cx.canvas.width = wrapper.scrollWidth;

console.log(`cx`, cx)

const settings = {
	BLOCKS_PER_ROW: 10,
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function createBlock(color, x, y, width, height) {
	cx.fillStyle = color
	cx.fillRect(x, y, width, height)
}

function createCurve() {
	cx.beginPath();
	cx.moveTo(10, 90);
	cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
	cx.lineTo(90, 10);
	cx.lineTo(10, 10);
	cx.closePath();
	cx.stroke();
}

function setup() {

	const blockHeight = cx.canvas.height / settings.BLOCKS_PER_ROW
	const blockWidth = cx.canvas.width / settings.BLOCKS_PER_ROW
	const totalRows = cx.canvas.height / blockHeight
	const totalColumns = cx.canvas.width / blockWidth

	return {
		blockHeight,
		blockWidth,
		totalRows,
		totalColumns,
	}
}

function generate(blockHeight, blockWidth, totalRows, totalColumns) {
	for (let i = 0; i < totalColumns; i++) {

		const x = i * blockWidth

		for (let j = 0; j < totalRows; j++) {

			const y = j * blockHeight

			createBlock(getRandomColor(), x, y, blockWidth, blockHeight)
		}
	}
}

function main() {


	setInterval(() => {

		settings.BLOCKS_PER_ROW *= 1

		const {
			blockHeight,
			blockWidth,
			totalRows,
			totalColumns,
		} = setup()

		generate(blockHeight, blockWidth, totalRows, totalColumns)
	}, 1000);

}

main()
