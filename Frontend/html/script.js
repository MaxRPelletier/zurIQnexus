// Speech to Text
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const subjects = {
    "Consulting Mandate": "With the Raiffeisen advisory mandate, you make your own investment decisions but benefit from Raiffeisen's analyses, market assessments and recommendations. It offers comprehensive and professional investment advice tailored to your individual needs and investment goals.",
    "Asset Management Mandate": "Entrust us with your needs and goals – we take care of their implementation. Your portfolio is managed according to your specifications and continuously monitored and optimized by our investment experts.",
    "Variable Mortgage": "With a variable-rate mortgage, you remain flexible: there is no fixed interest rate and no fixed term. The interest rate adjusts to the current market conditions.",
    "Membership and Share Certificate": "As a cooperative member, you are more than just a customer: you are part of your local Raiffeisen bank. You have a say and are committed to the region and the local economy.",
    "Fixed-rate Mortgage": "With a fixed‑rate mortgage, you benefit from a constant interest rate and financial planning security over the entire term. This mortgage is particularly suitable for long‑term financing where you want to protect yourself against rising interest rates.",
    "E-banking: Benefits and Advantages": "With Raiffeisen e‑banking, you can carry out your banking transactions conveniently wherever you have internet access. It offers a wide range of functions to help you manage your finances efficiently.",
    "Card Self Service": "Provides an overview of all your Raiffeisen cards plus management functions such as topping up prepaid cards, blocking cards, ordering replacement cards, and adjusting daily and monthly limits.",
    "Mastercard": "With the Mastercard credit card from Raiffeisen, you can make cashless payments worldwide. You can choose between different variants (e.g. Silver or Gold) that offer additional convenience and valuable extra services.",
    "Fund Savings Plan": "With a fund savings plan, you invest your assets systematically. You benefit from higher potential returns than on a savings account—without having to worry about stock market timing—and choose from a wide range of funds.",
    "Variable Rate Loan": "The variable rate loan enables you to finance medium‑term investments (e.g. in equipment or business expansions) without affecting your business liquidity. Falling interest rates may also help reduce repayment costs.",
    "Fixed Loan": "The fixed‑rate loan finances medium‑term investments at a constant interest rate over the entire term, allowing you to precisely plan the interest charges. It is especially suitable in low or rising interest rate environments.",
    "Current Account": "A current account forms the basis of banking transactions for companies, institutions, and the self‑employed. It allows for quick and convenient processing of all payment transactions and offers numerous financial services.",
    "Securities Custody Account": "Ideal for investors who want to make their own investment decisions or receive selective advice. It provides the option to buy and sell investments online via e‑banking or by telephone.",
    "Visa Debit Card": "With the Raiffeisen Visa Debit Card, you can make cashless payments worldwide and use it for online purchases. It provides flexibility and security for your daily banking transactions.",
    "Prepaid Credit Card": "The prepaid Raiffeisen Mastercard or Visa Card lets you make cashless payments worldwide. It offers the advantages of a credit card on a pre‑funded basis—ideal for occasional use while traveling or online shopping.",
    "Debit Mastercard": "With the Raiffeisen Debit Mastercard, you can make cashless payments worldwide and use it for online purchases. It is designed for flexible and secure everyday banking transactions.",
    "Private Account": "The private account serves as the basis for your everyday banking—handling transfers, standing orders, and salary payments—while offering full transparency and security in your transactions.",
    "TWINT": "The Raiffeisen TWINT app lets you pay conveniently and securely with your smartphone, send money to friends and family, and use a range of functions that simplify your payment and transfer needs.",
    "Pension Fund": "Pension funds offer the opportunity to build up pension capital while taking advantage of potential returns from the financial markets. They help optimize your retirement provision by investing in funds tailored to your risk profile and goals.",
    "Retirement Savings Account 3a": "The 3a retirement savings account provides financial security in old age by supplementing the benefits of the first and second pillars while offering annual tax savings. It is an important part of closing pension gaps.",
    "Savings Account": "A savings account is ideal for achieving short- and medium‑term savings goals. It offers the possibility to grow your savings securely and continuously through regular deposits and the benefits of compound interest.",
    "Raiffeisen Rio": "Raiffeisen Rio is an uncomplicated, completely digital investment solution managed by experienced investment experts. It allows you to build a customizable investment portfolio starting from as little as CHF 5,000.",
    "SARON Flex Mortgage": "The SARON Flex mortgage adjusts immediately to changes in interest rates. Based on the Swiss Average Rate Over Night (SARON), it offers flexibility along with the opportunity to benefit from falling rates.",
    "Visa Card Gold EUR/USD": "The Visa Card Gold International in euros or US dollars is tailored for customers holding a foreign currency account in the respective currency. It provides valuable additional benefits—including integrated insurance—for cashless payments worldwide.",
    "YoungMember Private Account": "Designed for pupils, trainees, and young professionals aged 12 to 26, this free private account is meant for managing daily banking transactions such as pocket money or salary while offering attractive savings benefits and access to additional card services.",
    "Vested Benefits Account": "The vested benefits account is used for the safekeeping of pension fund assets during career breaks (for example, when changing jobs or during further training), with the option of investment in pension funds.",
    "YoungMember Student": "The YoungMember Student account serves as a transaction account for students—supporting payroll and everyday payment transactions—while providing preferential conditions and access to a range of additional services."
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
        box.title = subjects[subjectName];
        container.appendChild(box);
    }

    // Highlight the newest (first in list)
    const boxes = document.querySelectorAll('.box');
    if (boxes.length > 0) {
        boxes[0].classList.add('active');
        infoOutput.textContent = subjects[visibleSubjects[0]];
    }
}
