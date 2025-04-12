// Instead of hardcoding subjects, we initialize it empty
let subjects = {};

const container = document.getElementById('boxContainer');
const subtitleContainer = document.getElementById('subtitleContainer');
const subtitleOutput = document.getElementById('subtitleOutput');
const output = document.getElementById('output');

let visibleSubjects = [];
const MAX_VISIBLE = 5;
let subjectKeys = [];
let currentSubjectName = null;

// Helper to normalize text
function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Load the JSON dynamically
async function loadSubjects() {
    try {
        const response = await fetch('raiffeisenprodukte_nested_structured.json');
        subjects = await response.json();
        subjectKeys = Object.keys(subjects);

        // Initialize with first 5 subjects
        visibleSubjects = subjectKeys.slice(0, MAX_VISIBLE);
        renderBoxes();
        setupSpeechRecognition();
    } catch (error) {
        console.error('Failed to load subjects:', error);
    }
}

// Call it on page load
loadSubjects();

function setupSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

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
            output.textContent = `🎤 "${transcript.trim()}"`;
            processSpeech(transcript);
        });

        recognition.start();
    } else {
        output.textContent = "Speech Recognition not supported in this browser.";
    }
}

function processSpeech(transcript) {
    const normTranscript = normalize(transcript);

    let matchingSubjects = [];

    for (const subject of subjectKeys) {
        const normSubject = normalize(subject);
        if (normTranscript.includes(normSubject) || normSubject.includes(normTranscript)) {
            let score = 0;
            if (normTranscript.includes(normSubject)) score += 2;
            if (normSubject.includes(normTranscript)) score += 1;
            score += normSubject.length / 100;
            matchingSubjects.push({ subject, score });
        }
    }

    if (matchingSubjects.length > 0) {
        matchingSubjects.sort((a, b) => b.score - a.score);

        const bestMatch = matchingSubjects[0].subject;

        matchingSubjects.forEach(m => {
            visibleSubjects = visibleSubjects.filter(name => name !== m.subject);
        });

        visibleSubjects.unshift(bestMatch);
        for (let i = 1; i < matchingSubjects.length; i++) {
            visibleSubjects.splice(1, 0, matchingSubjects[i].subject);
        }

        if (visibleSubjects.length > MAX_VISIBLE) {
            visibleSubjects = visibleSubjects.slice(0, MAX_VISIBLE);
        }

        renderBoxes();
        highlightBox(bestMatch);
        return;
    }

    if (currentSubjectName) {
        const subtitles = Object.keys(subjects[currentSubjectName]);
        for (const subtitle of subtitles) {
            if (normTranscript.includes(normalize(subtitle)) || normalize(subtitle).includes(normTranscript)) {
                switchToSubtitle(subtitle);
                return;
            }
        }
    }
}

function updateQueue(subjectName) {
    visibleSubjects = visibleSubjects.filter(name => name !== subjectName);
    visibleSubjects.unshift(subjectName);

    if (visibleSubjects.length > MAX_VISIBLE) {
        visibleSubjects = visibleSubjects.slice(0, MAX_VISIBLE);
    }

    renderBoxes();
}

function renderBoxes() {
    container.innerHTML = '';

    for (const subjectName of visibleSubjects) {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = subjectName;

        box.addEventListener('click', () => {
            highlightBox(subjectName);
        });

        container.appendChild(box);
    }

    if (visibleSubjects.length > 0) {
        highlightBox(visibleSubjects[0]);
    }
}

function highlightBox(subjectName) {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.classList.toggle('active', box.textContent === subjectName);
    });

    currentSubjectName = subjectName;
    renderSubtitles(subjectName);
    fetchSuggestion(subjectName);
}

function renderSubtitles(subjectName) {
    subtitleContainer.innerHTML = '';
    subtitleOutput.textContent = '';

    const subjectContent = subjects[subjectName];
    let firstSubBox = null;

    for (const subtitle in subjectContent) {
        const subBox = document.createElement('div');
        subBox.className = 'sub-box';
        subBox.textContent = subtitle;

        subBox.addEventListener('click', () => {
            document.querySelectorAll('.sub-box').forEach(b => b.classList.remove('active'));
            subBox.classList.add('active');
            subtitleOutput.textContent = formatSubtitleContent(subjectContent[subtitle]);
        });

        subtitleContainer.appendChild(subBox);

        if (!firstSubBox || subtitle.toLowerCase() === 'overview') {
            firstSubBox = { subBox, content: subjectContent[subtitle] };
        }
    }

    if (firstSubBox) {
        firstSubBox.subBox.classList.add('active');
        subtitleOutput.textContent = formatSubtitleContent(firstSubBox.content);
    }
}

function switchToSubtitle(subtitle) {
    const subBoxes = document.querySelectorAll('.sub-box');
    subBoxes.forEach(box => {
        if (normalize(box.textContent) === normalize(subtitle)) {
            document.querySelectorAll('.sub-box').forEach(b => b.classList.remove('active'));
            box.classList.add('active');
            subtitleOutput.textContent = formatSubtitleContent(subjects[currentSubjectName][subtitle]);
        }
    });
}

function formatSubtitleContent(content) {
    if (typeof content === 'object') {
        let text = '';
        for (const [key, value] of Object.entries(content)) {
            text += key + ': ' + value + '\n';
        }
        return text;
    } else {
        return content;
    }
}

async function fetchSuggestion(subjectName) {
    const suggestionOutput = document.getElementById('suggestionOutput');

    const prompt = `In 2 short sentences, describe an important point about "${subjectName}" in the context of Raiffeisen bank's products. Keep it simple and concise.`;

    suggestionOutput.textContent = "Loading suggestion...";

    try {
        const response = await fetch('https://swisshacks-aoai-westeurope.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '2yjmTT6QIzFt2Aln8FkFd49mBUhqtp6GEFAOQX11ANvxGOfjUw4IJQQJ99BDAC5RqLJXJ3w3AAABACOG9ngV'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const suggestion = data.choices[0].message.content.trim();
            suggestionOutput.textContent = suggestion;
        } else if (data.error) {
            console.error('API Error:', data.error.message);
            suggestionOutput.textContent = "API Error: " + data.error.message;
        } else {
            console.error('Unexpected API response:', data);
            suggestionOutput.textContent = "Unexpected API response.";
        }
    } catch (error) {
        console.error('Error fetching suggestion:', error);
        suggestionOutput.textContent = "Failed to load suggestion.";
    }
}