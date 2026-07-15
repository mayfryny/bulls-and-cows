const secretNumberInput = document.querySelector("#secretNumber");
const toggleSecretButton = document.querySelector("#toggleSecretButton");
const secretError = document.querySelector("#secretError");

const opponentAttemptForm = document.querySelector("#opponentAttemptForm");
const opponentAttemptInput = document.querySelector("#opponentAttempt");
const opponentError = document.querySelector("#opponentError");

const calculatedResult = document.querySelector("#calculatedResult");
const calculatedBulls = document.querySelector("#calculatedBulls");
const calculatedCows = document.querySelector("#calculatedCows");

const opponentHistory = document.querySelector("#opponentHistory");
const opponentHistoryEmpty = document.querySelector("#opponentHistoryEmpty");

const myAttemptForm = document.querySelector("#myAttemptForm");
const myAttemptInput = document.querySelector("#myAttempt");
const myBullsSelect = document.querySelector("#myBulls");
const myCowsSelect = document.querySelector("#myCows");
const myAttemptError = document.querySelector("#myAttemptError");

const myHistory = document.querySelector("#myHistory");
const myHistoryEmpty = document.querySelector("#myHistoryEmpty");

const digitNotes = document.querySelectorAll(".digit-note");

const resetGameButton = document.querySelector("#resetGameButton");
const resetDialog = document.querySelector("#resetDialog");
const confirmResetButton = document.querySelector("#confirmResetButton");

function keepOnlyDigits(event) {
    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 4);
}

secretNumberInput.addEventListener("input", keepOnlyDigits);
opponentAttemptInput.addEventListener("input", keepOnlyDigits);
myAttemptInput.addEventListener("input", keepOnlyDigits);

function validateNumber(value) {
    if (value.length !== 4) {
        return "Число повинно містити рівно 4 цифри.";
    }

    const uniqueDigits = new Set(value);

    if (uniqueDigits.size !== 4) {
        return "У числі не повинно бути однакових цифр.";
    }

    return "";
}

function calculateBullsAndCows(secret, attempt) {
    let bulls = 0;
    let cows = 0;

    for (let index = 0; index < secret.length; index += 1) {
        if (attempt[index] === secret[index]) {
            bulls += 1;
        } else if (secret.includes(attempt[index])) {
            cows += 1;
        }
    }

    return { bulls, cows };
}

function getBullsText(amount) {
    if (amount === 1) {
        return "1 бик";
    }

    if (amount >= 2 && amount <= 4) {
        return `${amount} бики`;
    }

    return `${amount} биків`;
}

function getCowsText(amount) {
    if (amount === 1) {
        return "1 корова";
    }

    if (amount >= 2 && amount <= 4) {
        return `${amount} корови`;
    }

    return `${amount} корів`;
}

function createHistoryItem(attempt, bulls, cows) {
    const item = document.createElement("div");
    item.className = "history-item";

    if (bulls === 4) {
        item.classList.add("winner");
    }

    const number = document.createElement("span");
    number.className = "attempt-number";
    number.textContent = attempt;

    const bullsBadge = document.createElement("span");
    bullsBadge.className = "score-pill";
    bullsBadge.textContent = `${bulls} Б`;

    const cowsBadge = document.createElement("span");
    cowsBadge.className = "score-pill";
    cowsBadge.textContent = `${cows} К`;

    item.append(number, bullsBadge, cowsBadge);

    return item;
}

toggleSecretButton.addEventListener("click", () => {
    const isHidden = secretNumberInput.type === "password";

    secretNumberInput.type = isHidden ? "text" : "password";
    toggleSecretButton.textContent = isHidden ? "Сховати" : "Показати";
});

opponentAttemptForm.addEventListener("submit", (event) => {
    event.preventDefault();

    secretError.textContent = "";
    opponentError.textContent = "";

    const secret = secretNumberInput.value;
    const attempt = opponentAttemptInput.value;

    const secretValidationMessage = validateNumber(secret);
    const attemptValidationMessage = validateNumber(attempt);

    if (secretValidationMessage) {
        secretError.textContent = secretValidationMessage;
        return;
    }

    if (attemptValidationMessage) {
        opponentError.textContent = attemptValidationMessage;
        return;
    }

    const { bulls, cows } = calculateBullsAndCows(secret, attempt);

    calculatedBulls.textContent = getBullsText(bulls);
    calculatedCows.textContent = getCowsText(cows);
    calculatedResult.classList.remove("hidden");

    const historyItem = createHistoryItem(attempt, bulls, cows);
    opponentHistory.prepend(historyItem);

    opponentHistoryEmpty.classList.add("hidden");

    opponentAttemptInput.value = "";
    opponentAttemptInput.focus();
});

myAttemptForm.addEventListener("submit", (event) => {
    event.preventDefault();

    myAttemptError.textContent = "";

    const attempt = myAttemptInput.value;
    const bulls = Number(myBullsSelect.value);
    const cows = Number(myCowsSelect.value);

    const validationMessage = validateNumber(attempt);

    if (validationMessage) {
        myAttemptError.textContent = validationMessage;
        return;
    }

    if (bulls + cows > 4) {
        myAttemptError.textContent =
            "Сума биків і корів не може бути більшою за 4.";

        return;
    }

    if (bulls === 4 && cows !== 0) {
        myAttemptError.textContent =
            "Якщо вказано 4 бики, кількість корів повинна бути 0.";

        return;
    }

    const historyItem = createHistoryItem(attempt, bulls, cows);
    myHistory.prepend(historyItem);

    myHistoryEmpty.classList.add("hidden");

    myAttemptInput.value = "";
    myBullsSelect.value = "0";
    myCowsSelect.value = "0";

    myAttemptInput.focus();
});

digitNotes.forEach((digitButton) => {
    digitButton.addEventListener("click", () => {
        const isIncluded = digitButton.classList.contains("included");
        const isPossible = digitButton.classList.contains("possible");
        const isExcluded = digitButton.classList.contains("excluded");
        if (!isIncluded && !isPossible && !isExcluded) {
            digitButton.classList.add("included");
            return;
        }
        if (isIncluded) {
            digitButton.classList.remove("included");
            digitButton.classList.add("possible");
            return;
        }
        if (isPossible) {
            digitButton.classList.remove("possible");
            digitButton.classList.add("excluded");
            return;
        }
        digitButton.classList.remove("excluded");
    });
});

resetGameButton.addEventListener("click", () => {
    resetDialog.showModal();
});

confirmResetButton.addEventListener("click", () => {
    resetGame();
});

function resetGame() {
    secretNumberInput.value = "";
    secretNumberInput.type = "password";

    opponentAttemptInput.value = "";
    myAttemptInput.value = "";

    toggleSecretButton.textContent = "Показати";

    myBullsSelect.value = "0";
    myCowsSelect.value = "0";

    secretError.textContent = "";
    opponentError.textContent = "";
    myAttemptError.textContent = "";

    calculatedResult.classList.add("hidden");

    opponentHistory.innerHTML = "";
    myHistory.innerHTML = "";

    opponentHistoryEmpty.classList.remove("hidden");
    myHistoryEmpty.classList.remove("hidden");

    digitNotes.forEach((digitButton) => {
        digitButton.classList.remove("included", "excluded");
    });
}