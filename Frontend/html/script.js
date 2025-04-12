// Speech to Text
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const subjects = {
    "Credit Card": "Information about Credit Cards.",
    "Loan": "Information about Loans.",
    "Savings Account": "Information about Savings Accounts.",
    "Insurance": "Information about Insurance.",
    "Investments": "Information about Investments."
};

const container = document.getElementById('boxContainer');
const boxes = {};

for (const [title, description] of Object.entries(subjects)) {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = title;
    box.title = description; // Tooltip on hover
    container.appendChild(box);
    boxes[title.toLowerCase()] = box; // Save lowercase for easier matching
}

const output = document.getElementById('output');

if (window.SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.addEventListener('result', e => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript;
        }
        output.textContent = transcript;

        highlightBox(transcript);
    });

    recognition.start();
} else {
    output.textContent = "Speech Recognition not supported in this browser.";
}

function highlightBox(transcript) {
    const text = transcript.toLowerCase();

    // Remove all highlights first
    for (const box of Object.values(boxes)) {
        box.classList.remove('active');
    }

    // Highlight the matching subject
    for (const key in boxes) {
        if (text.includes(key)) {
            boxes[key].classList.add('active');
            break; // Only highlight one at a time
        }
    }
}
