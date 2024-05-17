document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get('category');

    // Об'єкт з категоріями слів
    const categories = {
        animals: ['кіт', 'собака', 'олень', 'крокодил', 'жираф','ведмідь','вовк','лисиця','заєць','сова','тигр','акула','їжак'],
        fruits: ['яблуко', 'апельсин', 'банан', 'киві', 'виноград', 'ананас','манго','вишня','груша','персик','хурма','авокадо'],
        colors: ['червоний', 'синій', 'жовтий', 'зелений', 'оранжевий', 'фіолетовий','рожевий','сірий','чорний','білий','коричневий'],
        professions: ['лікар','вчитель','програміст','актор','музикант','продавець','художник','кухар','механік','фермер','водій','військовий','поліцейський','пожежник']
    };

    let selectedWord = '';
    let guessedLetters = [];
    let remainingAttempts = 6;
    let gameEnded = false;

    const wordDisplay = document.getElementById('word-display');
    const letterButtonsContainer = document.getElementById('letter-buttons');
    const hangmanImage = document.getElementById('hangman-img');
    const message = document.getElementById('message');
    const newGameButton = document.getElementById('new-game-btn');
    const changeCategoryButton = document.getElementById('change-category-btn');

    // Вибір випадкового слова з обраної категорії
    selectedWord = getRandomWordFromCategory(categories[selectedCategory]);

    // Ініціалізація гри
    initializeGame();

    function getRandomWordFromCategory(categoryWords) {
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }

    function initializeGame() {
        displayWord();
        createLetterButtons();
    }

    function displayWord() {
        wordDisplay.innerHTML = selectedWord
            .split('')
            .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
            .join(' ');

        if (!wordDisplay.innerHTML.includes('_')) {
            endGame(true); // Гравець виграв
        }
    }

    function createLetterButtons() {
        letterButtonsContainer.innerHTML = '';

        const alphabet = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';
        alphabet.split('').forEach(letter => {
            const button = document.createElement('button');
            button.textContent = letter;
            button.addEventListener('click', () => handleLetter(letter));
            letterButtonsContainer.appendChild(button);
        });
    }

    function handleLetter(letter) {
        if (!gameEnded && !guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            if (!selectedWord.includes(letter)) {
                remainingAttempts--;
                updateHangmanImage();
                if (remainingAttempts === 0) {
                    endGame(false); // Гравець програв
                }
            }
            displayWord();
            disableLetterButton(letter);
        }
    }

    function disableLetterButton(letter) {
        const buttons = letterButtonsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === letter) {
                button.disabled = true;
                button.style.backgroundColor = '#ccc'; // Змінити колір на сірий
            }
        });
    }

    function updateHangmanImage() {
        hangmanImage.src = `images/hangman_${6 - remainingAttempts}.png`;
    }

    function endGame(playerWon) {
        gameEnded = true;
        const messageText = playerWon ? 'Вітаємо! Ви відгадали слово.' : `Гра закінчилась! Слово було "${selectedWord}".`;
        message.textContent = messageText;

        // Показати кнопки "Нова гра" і "Змінити категорію"
        newGameButton.style.display = 'block';
        changeCategoryButton.style.display = 'block';
    }

    newGameButton.addEventListener('click', () => {
        window.location.href = `game.html?category=${selectedCategory}`; // Перезапуск гри в обраній категорії
    });

    changeCategoryButton.addEventListener('click', () => {
        window.location.href = 'select-category.html'; // Перенаправлення на сторінку вибору категорії
    });
});
