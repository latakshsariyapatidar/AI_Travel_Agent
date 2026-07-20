import { useState, useEffect } from 'react';
import { getConversationId } from '../utils/conversationId';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [extractedFields, setExtractedFields] = useState({
    destination: null,

    travelDate: null,
    travellers: null,
    budget: null,
    duration: null,
    tripType: null,
    specialRequirements: null,
    name: null,
    phone: null,
    email: null,
  });
  const [qualification, setQualification] = useState({
    leadScore: 0,
    confidence: 'Low',
    reason: '',
    summary: '',
    readyToCapture: false,
    leadReady: false,
  });
  const [leadSaved, setLeadSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const conversationId = getConversationId();

  // Load existing conversation on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const res = await fetch(`/api/leads/${conversationId}`);
        const data = await res.json();
        if (data.lead) {
          const { lead } = data;
          if (lead.history && lead.history.length > 0) {
            setMessages(lead.history.map(m => ({ role: m.role, text: m.content })));
          } else {
            setMessages([
              { role: 'assistant', text: 'Hi! I am your AI Travel Assistant. Where would you like to travel?' }
            ]);
          }
          if (lead.travel || lead.customer) {
            setExtractedFields({
              ...extractedFields,
              ...lead.travel,
              ...lead.customer,
            });
          }
          if (lead.qualification) setQualification(lead.qualification);
          setLeadSaved(lead.qualification?.leadReady || false);
        } else {
          // If no history, add a default greeting
          setMessages([
            { role: 'assistant', text: 'Hi! I am your AI Travel Assistant. Where would you like to travel?' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load conversation', err);
        setMessages([
          { role: 'assistant', text: 'Hi! I am your AI Travel Assistant. Where would you like to travel?' }
        ]);
      }
    };
    loadConversation();
  }, [conversationId]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Optimistic UI update
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Map UI messages to API format
      const apiMessages = messages.map(m => ({ role: m.role, content: m.text }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          messages: apiMessages,
          summary: qualification.summary || '',
          userMessage: text,
        }),
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
      }
      if (data.extractedFields) {
        setExtractedFields(data.extractedFields);
      }
      if (data.qualification) {
        setQualification(data.qualification);
      }
      if (data.leadSaved) {
        setLeadSaved(true);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    extractedFields,
    qualification,
    leadSaved,
    isLoading,
    sendMessage,
  };
};
