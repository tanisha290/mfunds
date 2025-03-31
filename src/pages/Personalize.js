import React, { useState } from "react";

/**
 * Investment Personalization Quiz Component
 * 
 * This component guides users through a quiz to assess their investment preferences.
 * Based on their answers, it recommends suitable mutual funds.
 * 
 * Features:
 * - Dynamic question-based state management
 * - Filtering mutual funds based on user responses
 * - Provides recommendations based on multiple criteria
 */

// Questions for the quiz
const questions = [
    {
        id: 1,
        question: "What is your primary investment goal?",
        options: [
            "Wealth Creation (Long-term growth)",
            "Regular Income (Stable returns)",
            "Tax Saving (Under Section 80C)",
            "Capital Protection (Low-risk investment)",
            "Short-Term Gains (High liquidity needed)",
        ],
    },
    {
        id: 2,
        question: "How long do you plan to stay invested?",
        options: [
            "Less than 1 year (Ultra short-term)",
            "1-3 years (Short-term)",
            "3-5 years (Medium-term)",
            "More than 5 years (Long-term)",
        ],
    },
    {
        id: 3,
        question: "What is your risk appetite?",
        options: [
            "Low (Prefer stable and low-risk returns)",
            "Moderate (Can handle some ups and downs)",
            "High (Willing to take risks for higher returns)",
        ],
    },
    {
        id: 4,
        question: "How much are you planning to invest?",
        options: [
            "Less than ₹5,000 per month",
            "₹5,000 - ₹25,000 per month",
            "₹25,000 - ₹1,00,000 per month",
            "More than ₹1,00,000 per month",
        ],
    },
    {
        id: 5,
        question: "What type of mutual funds interest you the most?",
        options: [
            "Equity Funds (Stock-based, high returns)",
            "Debt Funds (Low-risk, stable returns)",
            "Hybrid Funds (Mix of equity & debt)",
            "ELSS (Tax-saving under 80C)",
            "Index Funds (Passive investing)",
            "Liquid Funds (For emergency savings)",
        ],
    },
    {
        id: 6,
        question: "Do you prefer SIP (Systematic Investment Plan) or Lump Sum?",
        options: [
            "SIP (Invest small amounts regularly)",
            "Lump Sum (Invest a large amount at once)",
            "Not sure yet",
        ],
    },
    {
        id: 7,
        question: "Do you want tax benefits under Section 80C?",
        options: ["Yes, I want to save tax", "No, tax-saving is not my priority"],
    },
    {
        id: 8,
        question: "Would you like to set an automatic goal-based investment strategy?",
        options: [
            "Yes, I’d like to invest based on specific goals (e.g., retirement, child's education)",
            "No, I prefer a general investment approach",
        ],
    },
];

// Hardcoded list of mutual funds in India
const mutualFunds = [
    {
        name: "Axis Bluechip Fund",
        category: "Wealth Creation (Long-term growth)",
        risk: "Moderate",
        duration: "More than 5 years (Long-term)",
        type: "Equity Funds (Stock-based, high returns)",
        sip: true,
        taxBenefit: false,
        thematic: false,
    },
    {
        name: "HDFC Liquid Fund",
        category: "Short-Term Gains (High liquidity needed)",
        risk: "Low",
        duration: "Less than 1 year (Ultra short-term)",
        type: "Liquid Funds (For emergency savings)",
        sip: true,
        taxBenefit: false,
        thematic: false,
    },
    {
        name: "SBI Magnum Tax Gain Fund",
        category: "Tax Saving (Under Section 80C)",
        risk: "Moderate",
        duration: "3-5 years (Medium-term)",
        type: "ELSS (Tax-saving under 80C)",
        sip: true,
        taxBenefit: true,
        thematic: false,
    },
    {
        name: "ICICI Prudential Balanced Advantage Fund",
        category: "Regular Income (Stable returns)",
        risk: "Low",
        duration: "1-3 years (Short-term)",
        type: "Hybrid Funds (Mix of equity & debt)",
        sip: true,
        taxBenefit: false,
        thematic: false,
    },
    {
        name: "Nippon India Index Fund",
        category: "Wealth Creation (Long-term growth)",
        risk: "High",
        duration: "More than 5 years (Long-term)",
        type: "Index Funds (Passive investing)",
        sip: true,
        taxBenefit: false,
        thematic: false,
    },
    {
        name: "Kotak Equity Arbitrage Fund",
        category: "Capital Protection (Low-risk investment)",
        risk: "Low",
        duration: "1-3 years (Short-term)",
        type: "Debt Funds (Low-risk, stable returns)",
        sip: true,
        taxBenefit: false,
        thematic: false,
    },
    {
        name: "Aditya Birla Sun Life Tax Relief 96",
        category: "Tax Saving (Under Section 80C)",
        risk: "Moderate",
        duration: "More than 5 years (Long-term)",
        type: "ELSS (Tax-saving under 80C)",
        sip: true,
        taxBenefit: true,
        thematic: false,
    },
    {
        name: "Franklin India Technology Fund",
        category: "Wealth Creation (Long-term growth)",
        risk: "High",
        duration: "More than 5 years (Long-term)",
        type: "Equity Funds (Stock-based, high returns)",
        sip: true,
        taxBenefit: false,
        thematic: true,
    },
];

function Personalize() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [recommendations, setRecommendations] = useState([]);

    const handleOptionChange = (questionId, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleNext = () => {
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        // Filter mutual funds based on answers
        const filteredFunds = mutualFunds.filter((fund) => {
            const matchesCategory = fund.category === answers[1];
            const matchesRisk = fund.risk === answers[3];
            const matchesDuration = fund.duration === answers[2];
            const matchesType = answers[5] ? fund.type.includes(answers[5]) : true;
            const matchesSip = answers[6] === "SIP (Invest small amounts regularly)" ? fund.sip : true;
            const matchesTaxBenefit = answers[7] === "Yes, I want to save tax" ? fund.taxBenefit : true;
            const matchesThematic = answers[8] === "Yes, I’m open to high-growth but focused funds" ? fund.thematic : true;

            return (
                matchesCategory &&
                matchesRisk &&
                matchesDuration &&
                matchesType &&
                matchesSip &&
                matchesTaxBenefit &&
                matchesThematic
            );
        });

        // If no funds match, recommend a fallback fund
        if (filteredFunds.length === 0) {
            setRecommendations([mutualFunds[0]]); // Recommend the first fund as a fallback
        } else {
            setRecommendations(filteredFunds);
        }

        setStep(step + 1); // Move to the recommendations screen
    };

    if (step === 0) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h1>Welcome to the Investment Quiz</h1>
                <p>
                    This quiz will help us understand your investment preferences and recommend the best mutual funds for you.
                </p>
                <button
                    onClick={() => setStep(1)}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#748D92",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    Start Quiz
                </button>
            </div>
        );
    }

    if (step > questions.length) {
        // Recommendations Screen
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h1>Recommended Mutual Funds</h1>
                {recommendations.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                        {recommendations.map((fund) => (
                            <div
                                key={fund.name}
                                style={{
                                    backgroundColor: "#c7d1d3", // Light gray background for the card
                                    border: "1px solid #ddd",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgb(0, 0, 0, 0.1)", // Subtle shadow for a professional look
                                    padding: "20px",
                                    maxWidth: "500px",
                                    textAlign: "left",
                                    margin: "10px",
                                }}
                            >
                                <h3 style={{ color: "#333", marginBottom: "10px" }}>{fund.name}</h3>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Category:</strong> {fund.category}
                                </p>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Risk:</strong> {fund.risk}
                                </p>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Recommended Duration:</strong> {fund.duration}
                                </p>
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Type:</strong> {fund.type}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No mutual funds match your preferences. Please try again with different answers.</p>
                )}
            </div>
        );
    }

    const currentQuestion = questions[step - 1];

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>{currentQuestion.question}</h2>
            <div style={{ textAlign: "left", display: "inline-block", marginTop: "20px" }}>
                {currentQuestion.options.map((option) => (
                    <div key={option} style={{ marginBottom: "10px" }}>
                        <label>
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option}
                                checked={answers[currentQuestion.id] === option}
                                onChange={() => handleOptionChange(currentQuestion.id, option)}
                                style={{ marginRight: "10px" }}
                            />
                            {option}
                        </label>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    onClick={handleNext}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#748D92",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                >
                    {step === questions.length ? "Submit" : "Next"}
                </button>
            </div>
        </div>
    );
}

export default Personalize;