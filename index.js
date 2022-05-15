window.addEventListener('DOMContentLoaded', () => {
	const avatars = document.querySelector('.icons');

	Array.from(avatars.children).forEach((element) => {
		element.setAttribute('draggable', true);
	});

	const divs = document.querySelectorAll('.avatar-container');

	let dropzOne = divs[0];
	let dropzTwo = divs[1];

	avatars.addEventListener('dragstart', (event) => {
		event.dataTransfer.setData('text', event.target.dataset.item);
	});

	const dropz = (dropzone) => {
		['dragover', 'dragenter', 'dragleave', 'drop'].forEach((eventType) => {
			dropzone.addEventListener(eventType, (event) => event.preventDefault(), false);
		});

		dropzone.addEventListener('drop', (event) => {
			event.preventDefault();

			if (dropzone.childElementCount < 1) {
				let data = event.dataTransfer.getData('text');

				event.target.append(document.querySelector(`[data-item="${data}"]`));
			}
		});
	};

	dropz(dropzOne);
	dropz(dropzTwo);

	const container = document.querySelector('.container');
	const resetBtn = document.querySelector('#reset');
	const playerDisplay = document.querySelector('.display-player');
	const notifier = document.querySelector('.announcer');

	let table = ['', '', '', '', '', '', '', '', ''];
	let currentPlayer = 'X';
	let isGameActive = true;

	const PLAYERX = 'PLAYERX';
	const PLAYERO = 'PLAYERO';
	const TIE = 'TIE';

	const getElement = (tag, classN, attribute) => {
		let elem = document.createElement(tag);
		elem.classList.add(classN);
		elem.setAttribute('num', attribute);
		return elem;
	};

	for (let index = 0; index < 9; index++) {
		const cell = getElement('div', 'tile', index);
		container.append(cell);
	}

	const winningConditions = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	const isValidAction = (elem) => {
		if (elem.innerText === 'X' || elem.innerText === 'O') {
			return false;
		}

		return true;
	};

	const changePlayer = () => {
		playerDisplay.classList.remove(`player${currentPlayer}`);
		currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
		playerDisplay.innerText = currentPlayer;
		playerDisplay.classList.add(`player${currentPlayer}`);
	};

	const updateTable = (index) => {
		table[index] = currentPlayer;
	};

	const game = (elem) => {
		let index = elem.getAttribute('num');
		if (isValidAction(elem) && isGameActive) {
			elem.innerText = currentPlayer;
			elem.classList.add(`player${currentPlayer}`);

			changePlayer();

			updateTable(index);

			let roundWon = false;
			for (let i = 0; i <= 7; i++) {
				const winCondition = winningConditions[i];
				const a = table[winCondition[0]];
				const b = table[winCondition[1]];
				const c = table[winCondition[2]];

				if (a === '' || b === '' || c === '') {
					continue;
				}

				if (a === b && b === c) {
					roundWon = true;
					break;
				}
			}

			const notify = (type) => {
				switch (type) {
					case PLAYERO:
						notifier.innerHTML = 'Player <span class="playerO">O</span> Won';
						break;
					case PLAYERX:
						notifier.innerHTML = 'Player <span class="playerX">X</span> Won';
						break;
					case TIE:
						notifier.innerText = 'Tie';
				}

				notifier.classList.remove('hide');
			};

			if (roundWon) {
				notify(currentPlayer === 'X' ? PLAYERO : PLAYERX);
				isGameActive = false;
				return;
			}

			if (!table.includes('')) {
				notify(TIE);
			}
		}
	};

	container.addEventListener('mouseup', (event) => {
		game(event.target);
	});

	let count = -1;
	let cell = container.children;

	document.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowRight') {
			if (count < 8) {
				cell[count++];
				cell[count].style.background = 'grey';
				if (count !== 0) {
					cell[count].previousSibling.style.background = '#12181B';
				}
			}
		}

		if (event.key === 'ArrowLeft' && count > 0) {
			cell[count--];
			cell[count].style.background = 'grey';
			cell[count].nextSibling.style.background = '#12181B';
		}

		if (event.key === 'Enter') {
			game(cell[count]);
		}
	});

	resetBtn.addEventListener('click', () => {
		document.location.reload();
	});
});
