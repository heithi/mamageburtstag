const solution1 = "AUSRITT"; // Erstes Lösungswort
const solution2 = "EIS"; // Zweites Lösungswort
const rows = 6;
const cols = 11; // 7 für AUSRITT, 1 für das feste +, 3 für EIS

let currentRow = 0;
let currentCol = 0;
let gameOver = false;

// Grid erstellen
const grid = document.getElementById("grid");
for (let i = 0; i < rows * cols; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  // Füge das feste "+" an der richtigen Stelle hinzu
  if (i % cols === 7) {
    cell.textContent = "+";
    cell.style.border = "none";
    cell.style.backgroundColor = "transparent";
    cell.style.color = "white";
    cell.style.position = "relative"; // Positionierung ermöglichen
    cell.style.left = "18px"; // Verschiebt das "+" nach rechts in die Lücke
  } else {
    cell.setAttribute("data-editable", "true"); // Kennzeichne bearbeitbare Zellen
  }

  grid.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");

// Tastatur erstellen
const keyboard = document.getElementById("keyboard");
const rowsKeys = [
  "QWERTZUIOP", // Erste Zeile
  "ASDFGHJKL", // Zweite Zeile
  "✓YXCVBNM⌫", // Dritte Zeile mit Haken, Y und Löschen
];

rowsKeys.forEach((row) => {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  row.split("").forEach((letter) => {
    const key = document.createElement("div");
    key.classList.add("key");
    key.textContent = letter;
    key.onclick = () => handleKeyPress(letter);
    rowDiv.appendChild(key);
  });
  keyboard.appendChild(rowDiv);
});

function handleKeyPress(letter) {
  if (gameOver) return;

  if (letter === "⌫") {
    removeLetter();
  } else if (letter === "✓") {
    checkWords();
  } else {
    addLetter(letter);
  }
}

function addLetter(letter) {
  if (currentCol < cols) {
    // Überspringe die feste "+"-Zelle
    if (currentCol === 7) currentCol++;

    const index = currentRow * cols + currentCol;
    if (cells[index].getAttribute("data-editable") === "true") {
      cells[index].textContent = letter;
      currentCol++;
    }
  }
}

function removeLetter() {
  if (currentCol > 0) {
    currentCol--;

    // Überspringe die feste "+"-Zelle
    if (currentCol === 7) currentCol--;

    const index = currentRow * cols + currentCol;
    if (cells[index].getAttribute("data-editable") === "true") {
      cells[index].textContent = "";
    }
  }
}

function checkWords() {
    if (currentCol < cols) return;

    let guess1 = "";
    let guess2 = "";

    // Erster Versuch: DISNEY
    for (let i = 0; i < 7; i++) {
        const index = currentRow * cols + i;
        guess1 += cells[index].textContent || " ";
    }

    // Zweiter Versuch: PLUS
    for (let i = 8; i < 11; i++) {
        const index = currentRow * cols + i;
        guess2 += cells[index].textContent || " ";
    }

    // Überprüfe die Buchstaben für AUSRITT
    const solution1Letters = [...solution1]; // Kopie der Buchstaben von AUSRITT
    const guess1Letters = [...guess1]; // Kopie der Buchstaben von der Eingabe

    for (let i = 0; i < 7; i++) {
        const index = currentRow * cols + i;
        const letter = guess1Letters[i];

        if (solution1[i] === letter) {
            cells[index].classList.add('correct');
            solution1Letters[i] = null; // Markiere als verwendet
            guess1Letters[i] = null; // Markiere als verwendet
        }
    }

    // Überprüfe die Buchstaben für EIS
    const solution2Letters = [...solution2]; // Kopie der Buchstaben von EIS
    const guess2Letters = [...guess2]; // Kopie der Buchstaben von der Eingabe

    for (let i = 0; i < 3; i++) {
        const index = currentRow * cols + (i + 8); // Offset für EIS
        const letter = guess2Letters[i];

        if (solution2[i] === letter) {
            cells[index].classList.add('correct');
            solution2Letters[i] = null; // Markiere als verwendet
            guess2Letters[i] = null; // Markiere als verwendet
        }
    }

    // Zweiter Durchgang: Überprüfe auf vorhandene Buchstaben
    for (let i = 0; i < 7; i++) {
        const index = currentRow * cols + i;
        const letter = guess1Letters[i];

        if (letter && solution1Letters.includes(letter)) {
            cells[index].classList.add('present');
            solution1Letters[solution1Letters.indexOf(letter)] = null; // Markiere als verwendet
        }
    }

    for (let i = 0; i < 3; i++) {
        const index = currentRow * cols + (i + 8); // Offset für PLUS
        const letter = guess2Letters[i];

        if (letter && solution2Letters.includes(letter)) {
            cells[index].classList.add('present');
            solution2Letters[solution2Letters.indexOf(letter)] = null; // Markiere als verwendet
        }
    }

  // Überprüfe die Lösungen
  if (guess1.trim() === solution1 && guess2.trim() === solution2) {
    // Overlay-Nachricht erstellen
    const messageElement = document.createElement("div");
    messageElement.id = "overlayMessage";
    messageElement.textContent = "Gewonnen! 🐎 + 🍦";
    messageElement.style.position = "absolute";
    messageElement.style.top = "50%";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translate(-50%, -50%)";
    messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    messageElement.style.color = "white";
    messageElement.style.padding = "20px";
    messageElement.style.borderRadius = "10px";
    messageElement.style.textAlign = "center";
    messageElement.style.zIndex = "1000";

    // Nachricht in das Dokument einfügen
    document.body.appendChild(messageElement);

    gameOver = true;
  } else {
    currentRow++;
    currentCol = 0;

    if (currentRow === rows) {
      document.getElementById("message").textContent =
        "Verloren! Lösungen: " + solution1 + " und " + solution2;
      gameOver = true;
    }
  }
}

// Funktion zum Aktivieren der Zellenbearbeitung
function makeCellEditable(cell) {
  cell.contentEditable = true; // Mache die Zelle bearbeitbar
  cell.focus(); // Setze den Fokus auf die Zelle

  // Deaktiviere die Bearbeitung, wenn die Zelle den Fokus verliert
  cell.addEventListener("blur", () => {
    cell.contentEditable = false; // Deaktiviere die Bearbeitung
  });
}

// Initialisiere die erste Zelle als bearbeitbar
makeCellEditable(cells[currentRow * cols]);
