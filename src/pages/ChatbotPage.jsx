import React, { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { sendMessage } from "../services/chatbot";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Увери се, че AuthContext е правилно настроен

import chatbotIcon from "../images/chatbot.png";
import userIcon from "../images/user.png";

// изображения за диетичните типове
import balancedImg from "../images/balanced.png";
import proteinImg from "../images/protein.png";
import ketoImg from "../images/keto.png";
import veganImg from "../images/vegan.png";
import vegetarianImg from "../images/vegetarian.png";
import paleoImg from "../images/paleo.png";

import { Send } from "lucide-react";

// Създаваме отделна константа за HTML-а на диетите, за да избегнем дублиране
const DIET_INFO_HTML = `
    <h3 class='font-bold text-lg mb-4'>Основни диетични подходи</h3>
    <div class='grid gap-4'>
      <div class='flex items-center gap-4'>
        <img src="${balancedImg}" alt="Баланс" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🍏 Балансирана:</strong> Разнообразна храна с умерено съотношение на макронутриенти.</div>
      </div>
      <div class='flex items-center gap-4'>
        <img src="${proteinImg}" alt="Протеинова" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🥩 Протеинова:</strong> Високо съдържание на протеин. За мускулен растеж и ситост.</div>
      </div>
      <div class='flex items-center gap-4'>
        <img src="${ketoImg}" alt="Кето" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🥑 Кетогенна:</strong> Много ниски въглехидрати, високи мазнини – кетоза.</div>
      </div>
      <div class='flex items-center gap-4'>
        <img src="${veganImg}" alt="Веган" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🌱 Веган:</strong> Без животински продукти. Само растителни източници.</div>
      </div>
      <div class='flex items-center gap-4'>
        <img src="${vegetarianImg}" alt="Вегетарианска" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🍲 Вегетарианска:</strong> Позволява яйца и млечни, но не месо.</div>
      </div>
      <div class='flex items-center gap-4'>
        <img src="${paleoImg}" alt="Палео" class='w-12 h-12 rounded-lg shadow' />
        <div><strong>🌰 Палео:</strong> Без зърна, млечни и преработени храни.</div>
      </div>
    </div>
`;

export default function ChatbotPage() {
    /* --------------------------------------------------
    * 1️⃣ Генерираме / извличаме sessionId, за да държим
    * разговора последователен между презарежданията.
    * --------------------------------------------------*/
    const [sessionId] = useState(() => {
        const storedId = localStorage.getItem("chatbotSessionId");
        const newId = storedId || uuid();
        localStorage.setItem("chatbotSessionId", newId);
        return newId;
    });

    /* --------------------------------------------------
    * 2️⃣ Стейт: съобщения, input, typing, quick replies
    * --------------------------------------------------*/
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            text: `👋 Здравейте! Аз съм вашият личен асистент за фитнес и хранене. Готови ли сте да създадем вашия персонализиран план? <br/><br/>
             ${DIET_INFO_HTML}
             <p class='mt-4'><strong>Искаш ли допълнителна информация за типа диети?</strong> <em>(отговори с "да" / "не")</em></p>`
        }
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [quickReplies, setQuickReplies] = useState(["да", "не"]);

    const chatRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useAuth(); // Използваме useAuth за информация за потребителя

    /* Helper за добавяне на съобщение */
    const pushMessage = (msg) =>
        setMessages((prev) => [
            ...prev,
            {
                id: prev.length + 1,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                ...msg,
            },
        ]);

    /* Scroll до дъното при ново съобщение */
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages]);

    /* Обработване на отговор от сървъра (използваме useCallback за мемоизация) */
    const processBotResponse = useCallback((data) => {
        setQuickReplies([]); // Винаги изчистваме бутоните преди нов отговор от бота

        switch (data?.type) {
            case "detailed_diet_info":
                // Показва пълния HTML за диетите и допълнителното съобщение от бота
                const fullMessage = `${DIET_INFO_HTML} <p class='mt-4'>${data.message}</p>`;
                pushMessage({ text: fullMessage, sender: "bot" });
                // Бутоните се извличат от data.buttons
                const detailedDietReplyOptions = data.buttons?.map((b) => b.value || b.text) || [];
                setQuickReplies(detailedDietReplyOptions);
                break;

            case "buttons":
                // Показва само съобщението от бота и бутоните (без повтаряне на диетите)
                pushMessage({ text: data.message, sender: "bot" });
                // Бутоните се извличат от data.buttons
                const buttonReplyOptions = data.buttons?.map((b) => b.value || b.text) || [];
                setQuickReplies(buttonReplyOptions);
                break;

            case "text":
                // Обикновен текстов отговор
                pushMessage({ text: data.message, sender: "bot" });
                setQuickReplies([]); // Няма бързи бутони за plain text
                break;

            case "plan": // Този тип сега обработва и гости, и регистрирани потребители
                // Проверяваме флага isGuest, който идва от бекенда
                if (data.isGuest) {
                    // За гост потребител
                    sessionStorage.setItem("demoPlan", JSON.stringify(data.plan)); // Запазваме целия FullPlanDTO
                    pushMessage({ text: "Готов си! Пренасочване към демо режим…", sender: "bot" });
                    setQuickReplies([]);
                    // Изчистваме sessionId за гости, за да не се връщат към стара сесия
                    localStorage.removeItem("chatbotSessionId");
                    setTimeout(() => navigate("/guest-summary"), 1200);
                } else if (user?.id) { // Проверяваме дали user е логнат чрез useAuth()
                    // За регистриран потребител
                    sessionStorage.setItem("fullPlan", JSON.stringify(data.plan)); // Запазваме целия FullPlanDTO
                    pushMessage({ text: "✅ Твоят пълен персонализиран режим е готов! Пренасочване…", sender: "bot" });
                    setQuickReplies([]);
                    // Изчистваме sessionId, тъй като планът е генериран и запазен
                    localStorage.removeItem("chatbotSessionId");
                    setTimeout(() => navigate("/plan"), 1200);
                } else {
                    // Ако по някаква причина бота е върнал "plan" за потребител, който не е гост, но не е и логнат
                    pushMessage({ text: "🔒 За да видиш пълния план, моля, влез в акаунта си.", sender: "bot" });
                    setQuickReplies([]);
                    setTimeout(() => navigate("/login"), 1500);
                }
                break;

            case "error":
                // Обработка на грешки от бекенда
                pushMessage({ text: `⚠️ Грешка: ${data.message || "Неизвестна грешка."}`, sender: "bot" });
                setQuickReplies([]);
                break;

            default:
                // Ако форматът е неочакван или е просто стринг
                if (typeof data === "string") {
                    pushMessage({ text: data, sender: "bot" });
                } else {
                    pushMessage({ text: "⚠️ Неочакван формат на отговора.", sender: "bot" });
                }
                setQuickReplies([]);
                break;
        }
    }, [navigate, user]); // Добавяме user като зависимост за useCallback

    /* Изпращане на съобщение */
    const handleSendMessage = async (e, quick = null) => {
        e?.preventDefault();
        const messageToSend = quick || inputMessage.trim();
        if (!messageToSend) return;

        pushMessage({ text: messageToSend, sender: "user" });
        setInputMessage("");
        setQuickReplies([]); // Изчистваме бързите бутони веднага след като потребителят изпрати съобщение
        setIsTyping(true);

        try {
            // Определяме userRole и userId за изпращане към бекенда
            // user.id от useAuth() е най-надежден за логнати потребители
            // Ако user.id съществува, значи потребителят е логнат и не е гост.
            // Ако user.id е null/undefined, тогава е гост.
            const userRole = user?.id ? "USER" : "GUEST";
            const currentUserId = user?.id || null; // Изпращаме ID, ако има такова

            const { data } = await sendMessage(sessionId, messageToSend, userRole, currentUserId);
            processBotResponse(data);
        } catch (err) {
            console.error("Грешка при изпращане на съобщение:", err);
            pushMessage({ text: "⚠️ Грешка при свързване с чатбота.", sender: "bot" });
        } finally {
            setIsTyping(false);
        }
    };

    /* JSX */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl h-[85vh] flex flex-col rounded-3xl shadow-2xl border-[3px] border-gray-300 bg-white overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
                    <img src={chatbotIcon} alt="bot" className="h-8 w-8" />
                    <h2 className="text-xl font-bold text-gray-800">Фитнес Чатбот</h2>
                </div>

                {/* Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 scrollbar-thin scrollbar-thumb-gray-300">
                    {messages.map(({ id, text, sender, timestamp }) => (
                        <div key={id} className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className="flex items-end gap-3 max-w-[80%]">
                                {sender === "bot" && <img src={chatbotIcon} alt="bot" className="h-8 w-8 rounded-full shadow-sm" />}
                                <div>
                                    <div
                                        className={`prose prose-sm sm:prose-base px-5 py-3 shadow-lg border whitespace-pre-wrap rounded-2xl font-medium text-sm leading-relaxed tracking-wide ${
                                            sender === "user"
                                                ? "ml-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-700 rounded-br-none"
                                                : "bg-white text-gray-900 border-gray-200 rounded-bl-none"
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: text }}
                                    />
                                    <div className="text-xs text-gray-400 mt-1 pl-2">{timestamp}</div>
                                </div>
                                {sender === "user" && <img src={userIcon} alt="user" className="h-8 w-8 rounded-full shadow-sm" />}
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end gap-3 max-w-[80%]">
                                <img src={chatbotIcon} alt="bot" className="h-8 w-8 rounded-full shadow-sm" />
                                <div className="px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded-2xl border border-gray-300">
                                    <span className="inline-flex gap-1 items-center">
                                        Ботът пише
                                        <span className="animate-bounce">.</span>
                                        <span className="animate-bounce delay-100">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Replies */}
                {quickReplies.length > 0 && (
                    <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap gap-2 justify-center">
                        {quickReplies.map((reply, i) => (
                            <button
                                key={i}
                                onClick={() => handleSendMessage(null, reply)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md"
                                disabled={isTyping}
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50">
                    <div className="flex items-center gap-3">
                        <input
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Напиши съобщение…"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isTyping}
                        />
                        <button type="submit" disabled={!inputMessage.trim() || isTyping} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50">
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}