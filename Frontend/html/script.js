// Speech to Text
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const subjects = {
    "Consulting": "With the Raiffeisen advisory mandate, you make your own investment decisions but benefit from Raiffeisen's analyses, market assessments and recommendations. It offers comprehensive and professional investment advice tailored to your individual needs and investment goals.\n\nAdvantages:\n- Comprehensive investment advice with professional support.\n- Portfolio monitoring with contact during relevant market changes.\n- Low-cost investment products and reduced transaction fees.\n- Maximum transparency in recommended investment products, performance, and costs.\n\nServices:\n- Needs and objectives determination through detailed consultation.\n- Expert investment proposals based on current market developments.\n- Continuous monitoring and proactive contact when necessary.\n\nInvestment Strategies:\n- Yield, Balanced, Growth, Shares options depending on risk appetite.\n\nImportant Principles:\n- Sustainability integration, broad diversification, cost transparency.\n\nFAQs:\n- Difference between advisory and asset management mandates.\n- Portfolio monitoring practices.",

    "Discretionary Mandate": "Entrust Raiffeisen with your investment needs and goals. Your portfolio is managed according to your specifications, continuously monitored, and optimized.\n\nAdvantages:\n- Delegated management by specialists.\n- Active mandate management according to your strategy.\n- Systematic portfolio monitoring and transparency in decisions.\n\nServices:\n- Investor profile creation.\n- Strategic and tactical portfolio implementation.\n- Continuous global market monitoring.\n\nProducts:\n- Futura Global, Futura Swissness, Futura Impact, Index Global.\n\nCustomization:\n- Regular payouts, exclusion of alternative investments, direct Swiss equities investments, individual mandates available.\n\nSustainability:\n- ESG criteria considered in investment strategies.\n\nFAQs:\n- Mandate process, customization options, management.",

    "Mortgage": "Stay flexible with a mortgage that has no fixed interest rate or term. The interest rate adjusts to market conditions.\n\nAdvantages:\n- Flexibility with no binding term.\n- Immediate profit when interest rates fall.\n- Option to switch to another mortgage model.\n\nRisks:\n- Interest rate risk and fluctuating interest charges.\n\nFAQs:\n- Ideal for short-term financing, property sales, and falling interest environments.",

    "Membership": "Become part of Raiffeisen through a cooperative share. Enjoy financial returns and have a voice in decisions.\n\nAdvantages:\n- Attractive interest on shares.\n- Co-determination at general meetings.\n- Preferential banking conditions and free cards first year.\n- Access to MemberPlus leisure benefits.\n\nServices:\n- Membership benefits, annual member events, voting rights.\n- Share certificate returns.\n\nFAQs:\n- How to become a member, MemberPlus access, student benefits.",

    "E-banking": "Manage your finances easily and securely with Raiffeisen e-banking.\n\nAdvantages:\n- Convenient access anywhere, anytime.\n- High security standards.\n- Full financial overview.\n\nFunctions:\n- Account management, payments, eBill, tax documents, securities trading.\n- Card Self Service, notifications, accessibility features.\n- 24/7 security advice.",

    "Self Service": "Manage your Raiffeisen cards conveniently.\n\nFeatures:\n- Overview of all cards.\n- Top-up prepaid cards.\n- Block, unblock, and replace cards.\n- Adjust daily and monthly limits.\n- Set online usage preferences.",

    "Mastercard": "Make cashless payments globally with Raiffeisen Mastercard, available in Silver or Gold editions.\n\nAdvantages:\n- Worldwide acceptance and contactless payment options.\n- Integrated insurance protection.\n- Manage cards online or via one app.\n- Bonus point program 'surprize'.\n\nServices:\n- Purchase protection, extended warranty, and travel insurance.\n\nFees:\n- Annual fees vary (Silver CHF 96, Gold CHF 198).\n- Various currency processing fees.\n\nFAQs:\n- Application process, one App services, e-banking integration.",

    "Credit Card": "Make cashless payments globally with Raiffeisen Mastercard, available in Silver or Gold editions.\n\nAdvantages:\n- Worldwide acceptance and contactless payment options.\n- Integrated insurance protection.\n- Manage cards online or via one app.\n- Bonus point program 'surprize'.\n\nServices:\n- Purchase protection, extended warranty, and travel insurance.\n\nFees:\n- Annual fees vary (Silver CHF 96, Gold CHF 198).\n- Various currency processing fees.\n\nFAQs:\n- Application process, one App services, e-banking integration.",    

    "Fund Savings Plan": "Invest systematically with Raiffeisen's Fund Savings Plan for higher potential returns.\n\nAdvantages:\n- Regular investments from CHF 100.\n- Benefit from average price effects.\n- Automated and flexible payment setup.\n\nServices:\n- Wide selection of funds (equity, bond, index-tracking).\n- Flexibility in adjusting payments.\n\nFAQs:\n- Fund basics, suitability for retirement, investment periods recommended."
};

const container = document.getElementById('boxContainer');
const infoOutput = document.getElementById('infoOutput');
const output = document.getElementById('output');

let visibleSubjects = [];
const MAX_VISIBLE = 5;

const subjectKeys = Object.keys(subjects);

// Initialize with first 5 subjects
visibleSubjects = subjectKeys.slice(0, MAX_VISIBLE);
renderBoxes();

// Setup Speech Recognition
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

        processSpeech(transcript);
    });

    recognition.start();
} else {
    output.textContent = "Speech Recognition not supported in this browser.";
}

function processSpeech(transcript) {
    const lowerTranscript = transcript.toLowerCase();

    for (const subject of subjectKeys) {
        if (lowerTranscript.includes(subject.toLowerCase())) {
            updateQueue(subject);
            break;
        }
    }
}

function updateQueue(subjectName) {
    // Remove if already in queue
    visibleSubjects = visibleSubjects.filter(name => name !== subjectName);

    // Add to the front
    visibleSubjects.unshift(subjectName);

    // Keep only MAX_VISIBLE subjects
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

        // Clicking a box highlights it and shows info
        box.addEventListener('click', () => {
            highlightBox(subjectName);
        });

        container.appendChild(box);
    }

    // By default, highlight the newest
    highlightBox(visibleSubjects[0]);
}

function highlightBox(subjectName) {
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.classList.toggle('active', box.textContent === subjectName);
    });

    infoOutput.innerHTML = subjects[subjectName].replace(/\n/g, "<br>");
    fetchSuggestion(subjectName);
}


async function fetchSuggestion(subjectName) {
    const suggestionOutput = document.getElementById('suggestionOutput');

    const prompt = `In 2 short sentences, describe an important point about "${subjectName}" in the context of Raiffeisen bank's products. Keep it simple and concise.`;

    suggestionOutput.textContent = "Loading suggestion..."; // loading state

    try {
        const response = await fetch('https://swisshacks-aoai-westeurope.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '2yjmTT6QIzFt2Aln8FkFd49mBUhqtp6GEFAOQX11ANvxGOfjUw4IJQQJ99BDAC5RqLJXJ3w3AAABACOG9ngV' // <- your Azure API key here
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
