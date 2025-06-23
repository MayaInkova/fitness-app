import React, { useState, useRef, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import { sendMessage } from "../services/chatbot";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import chatbotIcon from "../images/chatbot.png";
import userIcon from "../images/user.png";

// diet images
import balancedImg from "../images/balanced.png";
import proteinImg from "../images/protein.png";
import ketoImg from "../images/keto.png";
import veganImg from "../images/vegan.png";
import vegetarianImg from "../images/vegetarian.png";
import paleoImg from "../images/paleo.png";

import { Send } from "lucide-react";

/****************************************************
 * 🪄 Smart extractor -> turns plain questions into buttons
 ****************************************************/
function extractQuickReplies(html) {
  // strip tags & normalise spaces
  const txt = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // generic pattern "a / b / c"
  const direct = txt.match(/изберете[^:]*?:\s*([а-яa-z0-9 ,\/\-]+)/i);
  const candidate = direct ? direct[1] : null;
  const chunk = candidate || txt.match(/([а-яa-z0-9 ,]+\/[а-яa-z0-9 ,\/]+)/i)?.[1];
  if (chunk) {
    return chunk
      .split("/")
      .map((s) => s.replace(/[*_`]+/g, "").trim())
      .filter(Boolean);
  }

  // explicit heuristics
  if (txt.includes("тренировка") && txt.includes("минути")) return ["30", "40", "60"];
  if (txt.includes("дни в седмицата")) return ["1", "2", "3", "4", "5", "6", "7"];
  if (txt.includes("хранения") || txt.includes("хранене")) return ["2", "3", "4", "5", "6"];
  if (txt.includes("алергии")) return ["не"];
  if (txt.includes("млечни")) return ["да", "не"];
  return [];
}

/* ----- HTML фрагмент – инфо за диети ----- */
const DIET_INFO_HTML = `
  <h3 class='font-bold text-lg mb-4'>Основни диетични подходи</h3>
  <div class='grid gap-4'>
    <div class='flex items-center gap-4'>
      <img src="${balancedImg}"    alt="Баланс"       class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🍏 Балансирана:</strong> Разнообразна храна с умерено съотношение на макронутриенти.</div>
    </div>
    <div class='flex items-center gap-4'>
      <img src="${proteinImg}"     alt="Протеинова"   class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🥩 Протеинова:</strong> Високо съдържание на протеин. За мускулен растеж и ситост.</div>
    </div>
    <div class='flex items-center gap-4'>
      <img src="${ketoImg}"        alt="Кето"         class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🥑 Кетогенна:</strong> Много ниски въглехидрати, високи мазнини – кетоза.</div>
    </div>
    <div class='flex items-center gap-4'>
      <img src="${veganImg}"       alt="Веган"        class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🌱 Веган:</strong> Без животински продукти. Само растителни източници.</div>
    </div>
    <div class='flex items-center gap-4'>
      <img src="${vegetarianImg}"  alt="Вегетарианска" class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🍲 Вегетарианска:</strong> Позволява яйца и млечни, но не месо.</div>
    </div>
    <div class='flex items-center gap-4'>
      <img src="${paleoImg}"       alt="Палео"        class='w-12 h-12 rounded-lg shadow' />
      <div><strong>🌰 Палео:</strong> Без зърна, млечни и преработени храни.</div>
    </div>
  </div>
`;

export default function ChatbotPage() {
  /* ---------- 1. sessionId ---------- */
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem("chatbotSessionId");
    const id = stored || uuid();
    localStorage.setItem("chatbotSessionId", id);
    return id;
  });

  /* ➤ ако потребителят се логне след като е бил гост – нова сесия */
  useEffect(() => {
    if (user?.id) {
      const newId = uuid();
      localStorage.setItem("chatbotSessionId", newId);
      setSessionId(newId);
    }
  }, [user?.id]);

  /* ---------- 2. state ---------- */
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `👋 Здравейте! Аз съм вашият личен асистент за фитнес и хранене. Готови ли сте да създадем вашия персонализиран план?
             <br/><br/>${DIET_INFO_HTML}
             <p class='mt-4'><strong>Искаш ли допълнителна информация за типа диети?</strong> <em>(отговори с "да" / "не")</em></p>`
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState(["да", "не"]);

  /* ---------- refs / hooks ---------- */
  const chatRef = useRef(null);
  const navigate = useNavigate();

  /* ---------- helper: push message ---------- */
  const pushMessage = (msg) =>
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ...msg,
      },
    ]);

  /* ---------- auto-scroll ---------- */
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  /* ---------- обработка на отговор от бота ---------- */
  const processBotResponse = useCallback(
    (data) => {
      setQuickReplies([]);

      switch (data?.type) {
        case "detailed_diet_info": {
          const html = `${DIET_INFO_HTML}<p class='mt-4'>${data.message}</p>`;
          pushMessage({ text: html, sender: "bot" });
          setQuickReplies(data.buttons?.map((b) => b.value || b.text) || []);
          break;
        }
        case "buttons":
          pushMessage({ text: data.message, sender: "bot" });
          setQuickReplies(data.buttons?.map((b) => b.value || b.text) || []);
          break;
        case "text":
          pushMessage({ text: data.message, sender: "bot" });
          setQuickReplies(extractQuickReplies(data.message));
          break;
        case "plan": {
          if (data.isGuest) {
            sessionStorage.setItem("demoPlan", JSON.stringify(data.plan));
            pushMessage({ text: "Готово! Пренасочвам към демо страницата…", sender: "bot" });
            localStorage.removeItem("chatbotSessionId");
            setTimeout(() => navigate("/guest-summary"), 1200);
          } else if (user?.id) {
            sessionStorage.setItem("fullPlan", JSON.stringify(data.plan));
            pushMessage({ text: "✅ Твоят персонализиран режим е готов! Пренасочвам…", sender: "bot" });
            localStorage.removeItem("chatbotSessionId");
            setTimeout(() => navigate("/plan"), 1200);
          } else {
            pushMessage({ text: "🔒 Влез в профила си, за да видиш пълния план.", sender: "bot" });
            setTimeout(() => navigate("/login"), 1500);
          }
          break;
        }
        case "error":
          pushMessage({ text: `⚠️ Грешка: ${data.message || "Неизвестна грешка."}`, sender: "bot" });
          break;
        default:
          if (typeof data === "string") {
            pushMessage({ text: data, sender: "bot" });
            setQuickReplies(extractQuickReplies(data));
          } else {
            pushMessage({ text: "⚠️ Неочакван формат на отговора.", sender: "bot" });
          }
      }
    },
    [navigate, user]
  );

  /* ---------- изпращане на съобщение ---------- */
  const handleSendMessage = async (e, quick = null) => {
    e?.preventDefault();
    const msg = quick || inputMessage.trim();
    if (!msg) return;

    pushMessage({ text: msg, sender: "user" });
    setInputMessage("");
    setQuickReplies([]);
    setIsTyping(true);

    try {
      const role = user?.id ? "USER" : "GUEST";
      const uid = user?.id ?? null;

      const { data } = await sendMessage(sessionId, msg, role, uid);
      processBotResponse(data);
    } catch (err) {
      console.error("Грешка при изпращане:", err);
      pushMessage({ text: "⚠️ Проблем при свързване с чатбота.", sender: "bot" });
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[85vh] flex flex-col rounded-3xl shadow-2xl border-[3px] border-gray-300 bg-white overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-3 p-4 border-b bg-slate-50">
          <img src={chatbotIcon} alt="bot" className="h-8 w-8" />
          <h2 className="text-xl font-bold text-gray-800">Фитнес Чатбот</h2>
        </div>

        {/* messages */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 scrollbar-thin scrollbar-thumb-gray-300"
        >
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
                {sender === "user" && <img src={userIcon} alt="you" className="h-8 w-8 rounded-full shadow-sm" />}
              </div>
            </div>
          ))}

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

        {/* quick replies */}
        {quickReplies.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 flex flex-wrap gap-2 justify-center">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(null, reply)}
                disabled={isTyping}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50">
          <div className="flex items-center gap-3">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Напиши съобщение…"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
