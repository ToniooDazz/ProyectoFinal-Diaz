const display = document.getElementById("display");
const numButtons = document.querySelectorAll(".num-btn");
const opButtons = document.querySelectorAll(".op-btn");
const clearButton = document.getElementById("borrar");
const equalsButton = document.getElementById("igual");
const historyDiv = document.getElementById("history");
const locationName = 'America/Argentina/Buenos_Aires';

let currentInput = "0";
let currentOperator = "";
let previousValue = 0;
let currentExpression = "";

fetchTimeAndDate(locationName)
  .then(dateTime => {
    console.log(`Fecha y hora en ${locationName}: ${dateTime}`);
  })
  .catch(error => {
    console.error('Error al obtener la fecha y hora:', error);
  });

// Función para agregar el resultado al historial
function addToHistory(operation) {
    historyDiv.innerHTML += `<div>${operation}</div>`;
}

//Funciones para guardar resultado
function updateDisplay() {
    display.value = currentInput;
}
function loadState() {
    const savedState = localStorage.getItem("calculatorState");
    if (savedState) {
        const state = JSON.parse(savedState);
        currentInput = state.currentInput;
        currentOperator = state.currentOperator;
        previousValue = state.previousValue;
        updateDisplay();
    }
}
function saveState() {
    const state = {
        currentInput: currentInput,
        currentOperator: currentOperator,
        previousValue: previousValue
    };
    localStorage.setItem("calculatorState", JSON.stringify(state));
}
loadState();

// Función para obtener la fecha y hora
function fetchTimeAndDate(location) {
    const apiUrl = `http://worldtimeapi.org/api/timezone/${location}`;
  
    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        return data.datetime;
      })
      .catch(error => {
        console.error(`Error: ${error.message}`);
        throw error;
      });
  }

// Agregando evento a los botones
numButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentInput === "0") {
            currentInput = button.textContent;
        } else {
            currentInput += button.textContent;
        }
        updateDisplay();
    });
});
opButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentOperator !== "") {
            performCalculation();
        }
        currentOperator = button.textContent;
        previousValue = parseFloat(currentInput);
        currentInput = "0";
    });
});
equalsButton.addEventListener("click", () => {
    if (currentOperator !== "") {
        performCalculation();
        currentInput = previousValue.toString();
        currentOperator = "";
        updateDisplay();
        saveState();
    }
});
clearButton.addEventListener("click", () => {
    currentInput = "0";
    currentOperator = "";
    previousValue = 0;
    updateDisplay();
});

// Funciones de botones de calculos
function performCalculation() {
    const currentValue = parseFloat(currentInput);
    let result;
    const operator = currentOperator;
    switch (operator) {
        case "+":
            result = previousValue + currentValue;
            break;
        case "-":
            result = previousValue - currentValue;
            break;
        case "*":
            result = previousValue * currentValue;
            break;
        case "/":
            result = previousValue / currentValue;
            break;
    }
    
    // Llamar a fetchTimeAndDate para la fecha y hora
    fetchTimeAndDate(locationName)
        .then(dateTime => {

            const formattedDateTime = new Date(dateTime).toLocaleString();
            const operation = `${previousValue} ${operator} ${currentValue} = ${result} (${formattedDateTime})`;
            addToHistory(operation);
            currentExpression = result.toString();
        })
        .catch(error => {
            console.error('Error de la fecha y hora:', error);
        });
}