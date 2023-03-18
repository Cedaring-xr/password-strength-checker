

const strengthMeter = document.getElementById('strength-meter')
const passwordInput = document.getElementById('password-input')
const passwordTips = document.getElementById('password-tips')

const characterAmountRange = document.getElementById('characterAmountRange')
const characterAmountNumber = document.getElementById('characterAmountNumber')
const includeUppercaseElement = document.getElementById('includeUppercase')
const includeNumbersElement = document.getElementById('includeNumber')
const includeSpecialCharactersElement = document.getElementById('includeSpecialCharacter')
const passwordDisplay = document.getElementById('passwordDisplay')
const form = document.getElementById('generatePasswordForm')

const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122)
const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90)
const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57)
const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47).concat(arrayFromLowToHigh(58, 64)).concat(arrayFromLowToHigh(91, 96)).concat(arrayFromLowToHigh(123, 126))

characterAmountNumber.addEventListener('input', syncCharacterAmount)
characterAmountRange.addEventListener('input', syncCharacterAmount)
form.addEventListener('submit', e => {
    e.preventDefault()
    const characterAmount = characterAmountNumber.value
    const includeUppercase = includeUppercaseElement.checked
    const includeNumbers = includeNumbersElement.checked
    const includeSpecialCharacters = includeSpecialCharactersElement.checked
    const password = generatePassword(characterAmount, includeUppercase, includeNumbers, includeSpecialCharacters)
    passwordDisplay.innerText = password
})

//calls everytime input is changed
passwordInput.addEventListener('input', updateStrengthMeter)
updateStrengthMeter()


function updateStrengthMeter() {
    const weaknesses = calcStrength(passwordInput.value)
    let strength = 100
    passwordTips.innerHTML = ''
    weaknesses.forEach(weakness => {
        if(!weakness) return
        strength -= weakness.deduction
        const messageElement = document.createElement('div')
        messageElement.innerText = weakness.message
        passwordTips.appendChild(messageElement)
    })
    strengthMeter.style.setProperty('--strength', strength)
}

function calcStrength(password) {
    const weaknesses = []
    weaknesses.push(lengthWeakness(password))
    weaknesses.push(lowercaseWeakness(password))
    weaknesses.push(uppercaseWeakness(password))
    weaknesses.push(numberWeakness(password))
    weaknesses.push(repeatCharactersWeakness(password))
    return weaknesses
}

function lengthWeakness(password) {
    const length = password.length
    if(length <= 5) {
        return {
            message: 'Your password needs to be longer',
            deduction: 40
        }
    } else if(length <= 12) {
        return {
            message: 'Your password could be a bit longer for better security',
            deduction: 10
        }
    }
}

function lowercaseWeakness(password) {
    return characterTypeWeakness(password, /[a-z]/g, 'lowercase letters')
}

function uppercaseWeakness(password) {
    return characterTypeWeakness(password, /[A-Z]/g, 'uppercase letters')
}

function numberWeakness(password) {
    return characterTypeWeakness(password, /[1-9]/g, 'number characters')
}

function specialCharacterWeakness(password) { //regex for not anything specified
    return characterTypeWeakness(password, /[^0-9a-zA-Z\s]/g, 'special characters') 
}

function characterTypeWeakness(password, regex, type) {
    const matches = password.match(regex) || []

    if(matches.length === 0) {
        return {
            message: `Your password needs at least two ${type}`,
            deduction: 20
        }
    }

    if(matches.length <= 1) {
        return {
            message: `Your password should have more ${type}`,
            deduction: 5
        }
    }
}

function repeatCharactersWeakness(password) { //regex for matching duplicate characters in a row
    const matches = password.match(/(.)\1/g) || []
    if( matches.length > 1) {
        return {
            message: 'Your password should not have more than two repeat characters in a row',
            deduction: matches.length * 10
        }
    }
}

//generator section
function syncCharacterAmount(e) {
    const value = e.target.value
    characterAmountNumber.value = value
    characterAmountRange.value = value
}

function generatePassword(characterAmount, includeNumbers, includeUppercase, includeSpecialCharacters) {
    let charCodes = LOWERCASE_CHAR_CODES
    if(includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES)
    if(includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES)
    if(includeSpecialCharacters) charCodes = charCodes.concat(SYMBOL_CHAR_CODES)

    const passwordCharacters = []
    for(let i = 0; i < characterAmount; i ++) {
        const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)]
        passwordCharacters.push(String.fromCharCode(characterCode))
    }
    return passwordCharacters.join('')
}

function arrayFromLowToHigh(low, high) {
    const array = []
    for(let i = low; i <= high; i++) {
        array.push(i)
    }
    return array
}