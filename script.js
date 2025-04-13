const fullQuestionSet = [
    { question: "Which law is used to find thermal efficiency of an engine?", answers: [ { text: "Boyle's law", correct: false }, { text: "Newton's law", correct: false }, { text: "Carnot's law", correct: true }, { text: "Pascal's law", correct: false } ] },
    { question: "Which metal is used in aircraft structures?", answers: [ { text: "Aluminum", correct: true }, { text: "Copper", correct: false }, { text: "Lead", correct: false }, { text: "Iron", correct: false } ] },
    { question: "Which device converts mechanical energy to electrical energy?", answers: [ { text: "Compressor", correct: false }, { text: "Motor", correct: false }, { text: "Generator", correct: true }, { text: "Pump", correct: false } ] },
    { question: "SI unit of pressure is?", answers: [ { text: "Pascal", correct: true }, { text: "Newton", correct: false }, { text: "Watt", correct: false }, { text: "Bar", correct: false } ] },
    { question: "Which cycle is used in gas turbines?", answers: [ { text: "Otto cycle", correct: false }, { text: "Brayton cycle", correct: true }, { text: "Diesel cycle", correct: false }, { text: "Rankine cycle", correct: false } ] },
    { question: "Which engine component connects piston to crankshaft?", answers: [ { text: "Cylinder", correct: false }, { text: "Connecting rod", correct: true }, { text: "Camshaft", correct: false }, { text: "Valve", correct: false } ] },
    { question: "Hardness of a material is measured using?", answers: [ { text: "Tensile test", correct: false }, { text: "Brinell test", correct: true }, { text: "Fatigue test", correct: false }, { text: "Impact test", correct: false } ] },
    { question: "Which process is used to join metals?", answers: [ { text: "Welding", correct: true }, { text: "Casting", correct: false }, { text: "Milling", correct: false }, { text: "Drilling", correct: false } ] },
    { question: "The part which stores energy in mechanical systems?", answers: [ { text: "Governor", correct: false }, { text: "Flywheel", correct: true }, { text: "Brake", correct: false }, { text: "Clutch", correct: false } ] },
    { question: "Which instrument measures temperature?", answers: [ { text: "Manometer", correct: false }, { text: "Thermometer", correct: true }, { text: "Barometer", correct: false }, { text: "Tachometer", correct: false } ] },
    { question: "Lathe machine is used for?", answers: [ { text: "Welding", correct: false }, { text: "Turning", correct: true }, { text: "Drilling", correct: false }, { text: "Casting", correct: false } ] },
    { question: "Casting is done for?", answers: [ { text: "Machining parts", correct: false }, { text: "Joining parts", correct: false }, { text: "Shaping molten metal", correct: true }, { text: "Assembling", correct: false } ] },
    { question: "Rankine cycle is used in?", answers: [ { text: "Petrol engine", correct: false }, { text: "Diesel engine", correct: false }, { text: "Steam power plant", correct: true }, { text: "Gas turbine", correct: false } ] },
    { question: "Crankshaft rotates due to?", answers: [ { text: "Spark plug", correct: false }, { text: "Piston movement", correct: true }, { text: "Camshaft", correct: false }, { text: "Valve timing", correct: false } ] },
    { question: "Hydraulic press works on?", answers: [ { text: "Bernoulli's law", correct: false }, { text: "Pascal's law", correct: true }, { text: "Ohm's law", correct: false }, { text: "Newton's law", correct: false } ] },
];

let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;

document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById("question");
    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const startButton = document.getElementById("start-btn");
    const restartButton = document.getElementById("restart-btn");
    const quizContainer = document.querySelector(".quiz");
    const resultContainer = document.querySelector(".result-container");
    const questionCountSelect = document.querySelector(".question-count-select");
    const dropdown = document.getElementById("question-count");
    const timeDisplay = document.getElementById("time");
    const progressBar = document.getElementById("progress");
    const currentQuestionDisplay = document.getElementById("current-question");
    const totalQuestionsDisplay = document.getElementById("total-questions");

    // Add event listeners
    startButton.addEventListener("click", () => {
        const count = parseInt(dropdown.value);
        startQuiz(count);
    });

    nextButton.addEventListener("click", () => {
        if (currentQuestionIndex < selectedQuestions.length) {
            handleNextQuestion();
        }
    });

    restartButton.addEventListener("click", () => {
        hideElement(resultContainer);
        showElement(questionCountSelect);
    });

    function startQuiz(count) {
        selectedQuestions = getRandomQuestions(count);
        currentQuestionIndex = 0;
        score = 0;
        
        // Update total questions display
        totalQuestionsDisplay.textContent = selectedQuestions.length;
        
        // Hide start screen, show quiz
        fadeOut(questionCountSelect, () => {
            fadeIn(quizContainer);
            showQuestion();
        });
    }

    function showQuestion() {
        resetState();
        startTimer();
        
        let currentQuestion = selectedQuestions[currentQuestionIndex];
        
        // Update progress indicators
        updateProgress();
        
        // Set question text
        questionElement.innerHTML = currentQuestion.question;
        
        // Create shuffled answer buttons
        const shuffledAnswers = shuffleAnswers([...currentQuestion.answers]);
        
        shuffledAnswers.forEach((answer, index) => {
            setTimeout(() => {
                const button = document.createElement("button");
                button.innerHTML = answer.text;
                button.classList.add("btn");
                
                // Add delay for animation
                button.style.animationDelay = `${index * 0.1}s`;
                
                answerButtons.appendChild(button);
                
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                
                button.addEventListener("click", selectAnswer);
            }, index * 50);
        });
    }

    function updateProgress() {
        // Update question counter
        currentQuestionDisplay.textContent = currentQuestionIndex + 1;
        
        // Update progress bar
        const progressPercentage = ((currentQuestionIndex) / selectedQuestions.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function resetState() {
        clearInterval(timer);
        timeLeft = 20;
        timeDisplay.innerText = timeLeft;
        nextButton.style.display = "none";
        
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timeDisplay.innerText = timeLeft;
            
            // Add warning class when time is low
            const timerContainer = document.getElementById("timer-container");
            if (timeLeft <= 5) {
                timerContainer.classList.add("warning");
            } else {
                timerContainer.classList.remove("warning");
            }
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimerEnd();
            }
        }, 1000);
    }

    function handleTimerEnd() {
        // Highlight correct answer
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        
        showNextButton();
    }

    function selectAnswer(e) {
        clearInterval(timer);
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
            playCorrectSound();
        } else {
            selectedBtn.classList.add("incorrect");
            playIncorrectSound();
        }
        
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        
        showNextButton();
    }

    function showNextButton() {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            nextButton.innerHTML = "Next Question";
        } else {
            nextButton.innerHTML = "See Results";
        }
        
        nextButton.style.display = "block";
        fadeIn(nextButton);
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < selectedQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        fadeOut(quizContainer, () => {
            const scoreDisplay = document.getElementById("score-display");
            const resultMessage = document.getElementById("result-message");
            
            // Calculate percentage
            const percentage = Math.round((score / selectedQuestions.length) * 100);
            
            // Set score text
            scoreDisplay.innerHTML = `
                <div class="score-circle">
                    <div class="score-number">${score}/${selectedQuestions.length}</div>
                    <div class="score-percent">${percentage}%</div>
                </div>
            `;
            
            // Set appropriate message
            if (percentage >= 80) {
                resultMessage.innerHTML = "Excellent! You're a mechanical engineering expert!";
                resultMessage.className = "result-excellent";
            } else if (percentage >= 60) {
                resultMessage.innerHTML = "Good job! You have solid engineering knowledge.";
                resultMessage.className = "result-good";
            } else if (percentage >= 40) {
                resultMessage.innerHTML = "Not bad! Keep studying your mechanical concepts.";
                resultMessage.className = "result-average";
            } else {
                resultMessage.innerHTML = "Keep practicing! Mechanical engineering takes time to master.";
                resultMessage.className = "result-needs-improvement";
            }
            
            fadeIn(resultContainer);
        });
    }

    // Helper functions
    function getRandomQuestions(count) {
        return shuffle([...fullQuestionSet]).slice(0, count);
    }

    function shuffleAnswers(answers) {
        return shuffle(answers);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function fadeOut(element, callback) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, 300);
    }

    function fadeIn(element) {
        element.style.display = 'block';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    function hideElement(element) {
        element.style.display = 'none';
    }

    function showElement(element) {
        element.style.display = 'block';
    }

    function playCorrectSound() {
        // You could implement actual sound here
        console.log("Correct answer!");
    }

    function playIncorrectSound() {
        // You could implement actual sound here
        console.log("Incorrect answer!");
    }
});