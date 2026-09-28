const passwordOutput = document.querySelector("#password");

const lengthSlider = document.querySelector("#character-length");
const lengthValue = document.querySelector("#length-value");

const uppercaseCheckbox = document.querySelector("#uppercase");
const lowercaseCheckbox = document.querySelector("#lowercase");
const numbersCheckbox = document.querySelector("#numbers");
const symbolsCheckbox = document.querySelector("#symbols");

const generateButton = document.querySelector(".generate-button");

const copyButton = document.querySelector(".copy-button");
const copyMessage = document.querySelector(".copy-message");

const strengthText = document.querySelector("#strength-text");
const strengthBars = document.querySelectorAll(".strength-bar");


// Character sets
const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";


// Checkboxes
const checkboxes = [
    uppercaseCheckbox,
    lowercaseCheckbox,
    numbersCheckbox,
    symbolsCheckbox
];


// Update slider
function updateSlider() {
    const min = Number(lengthSlider.min);
    const max = Number(lengthSlider.max);
    const value = Number(lengthSlider.value);

    const percentage = ((value - min) / (max - min)) * 100;

    lengthValue.textContent = value;

    lengthSlider.style.background = `
        linear-gradient(
            to right,
            var(--green-200) ${percentage}%,
            var(--grey-950) ${percentage}%
        )
    `;
}


// Slider event
lengthSlider.addEventListener("input", () => {
    updateSlider();

    copyMessage.style.display = "none";
});


// Checkbox events
checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        copyMessage.style.display = "none";
    });
});


// Get random character
function getRandomCharacter(characters) {
    const randomIndex = Math.floor(
        Math.random() * characters.length
    );

    return characters[randomIndex];
}


// Shuffle password
function shufflePassword(password) {
    const characters = password.split("");

    for (let i = characters.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(
            Math.random() * (i + 1)
        );

        [characters[i], characters[randomIndex]] =
            [characters[randomIndex], characters[i]];
    }

    return characters.join("");
}


// Calculate password strength
function calculateStrength(length) {
    let selectedOptions = 0;

    if (uppercaseCheckbox.checked) selectedOptions++;
    if (lowercaseCheckbox.checked) selectedOptions++;
    if (numbersCheckbox.checked) selectedOptions++;
    if (symbolsCheckbox.checked) selectedOptions++;

    let strength = 0;

    if (length <= 5) {
        strength = 1;
    } else if (length <= 7 || selectedOptions === 1) {
        strength = 2;
    } else if (length <= 11 || selectedOptions === 2) {
        strength = 3;
    } else {
        strength = 4;
    }

    updateStrength(strength);
}


// Update strength UI
function updateStrength(strength) {
    const strengthLabels = [
        "",
        "TOO WEAK!",
        "WEAK",
        "MEDIUM",
        "STRONG"
    ];

    strengthText.textContent = strengthLabels[strength];

    strengthBars.forEach((bar, index) => {
        // Reset bar
        bar.className = "strength-bar";

        // Activate required bars
        if (index < strength) {
            bar.classList.add(`strength-${strength}`);
        }
    });
}


// Generate password
function generatePassword() {
    const length = Number(lengthSlider.value);

    let availableCharacters = "";
    const requiredCharacters = [];


    // Uppercase
    if (uppercaseCheckbox.checked) {
        availableCharacters += uppercaseChars;

        requiredCharacters.push(
            getRandomCharacter(uppercaseChars)
        );
    }


    // Lowercase
    if (lowercaseCheckbox.checked) {
        availableCharacters += lowercaseChars;

        requiredCharacters.push(
            getRandomCharacter(lowercaseChars)
        );
    }


    // Numbers
    if (numbersCheckbox.checked) {
        availableCharacters += numberChars;

        requiredCharacters.push(
            getRandomCharacter(numberChars)
        );
    }


    // Symbols
    if (symbolsCheckbox.checked) {
        availableCharacters += symbolChars;

        requiredCharacters.push(
            getRandomCharacter(symbolChars)
        );
    }


    // No checkbox selected
    if (availableCharacters === "") {
        passwordOutput.textContent = "Select an option";

        copyMessage.style.display = "none";

        updateStrength(0);

        return;
    }


    // Password is too short for selected options
    if (length < requiredCharacters.length) {
        passwordOutput.textContent = "Increase length";

        copyMessage.style.display = "none";

        updateStrength(0);

        return;
    }


    // Start with one character from each selected category
    let password = requiredCharacters.join("");


    // Fill remaining password length
    while (password.length < length) {
        password += getRandomCharacter(
            availableCharacters
        );
    }


    // Shuffle characters
    password = shufflePassword(password);


    // Hide copied message
    copyMessage.style.display = "none";


    // Show password
    passwordOutput.textContent = password;


    // Calculate strength
    calculateStrength(length);
}


// Generate button
generateButton.addEventListener(
    "click",
    generatePassword
);


// Copy password
copyButton.addEventListener("click", async () => {
    const password = passwordOutput.textContent;

    if (
        !password ||
        password === "Select an option" ||
        password === "Increase length"
    ) {
        return;
    }

    try {
        await navigator.clipboard.writeText(password);

        copyMessage.style.display = "inline";
    } catch (error) {
        console.error(
            "Could not copy password:",
            error
        );
    }
});


// Set correct slider appearance on page load
updateSlider();