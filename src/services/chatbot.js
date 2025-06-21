import api from './api'; 


export const sendMessage = (sessionId, message, role, userId) => {
 
  const payload = { sessionId, message };

  
  if (role !== "GUEST" && userId) {
    payload.userId = Number(userId);
  }

 
  return api.post("/chatbot/message", payload);
};