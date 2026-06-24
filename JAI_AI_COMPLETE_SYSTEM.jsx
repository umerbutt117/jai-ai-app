import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Mic, Send, Settings, Menu, X, Home, Zap, Brain } from 'lucide-react';

const JaiAI = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Assalam-o-Alaikum! Main JAI AI hoon. Aapka kya kaam hai?", sender: 'jai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('hinglish');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Web Speech API Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (event.results[0].isFinal) {
          setInputText(transcript);
        }
      };
    }
  }, []);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice to Text
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Text to Speech
  const speak = (text) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    if (language === 'english') {
      utterance.lang = 'en-US';
    } else if (language === 'hindi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // JAI AI Response Logic
  const getJaiResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Greeting
    if (input.includes('salam') || input.includes('hello') || input.includes('hi')) {
      return "Walaikum assalam! Main JAI AI hoon, aapka digital assistant. Kya main aapki madad kar sakta hoon?";
    }
    
    // Time/Routine
    if (input.includes('time') || input.includes('samay') || input.includes('routine') || input.includes('aaj')) {
      const now = new Date();
      return `Abhi ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} hai. Aapka aaj ka routine:\n8 AM - Exercise\n10 AM - Email check\n12 PM - Meetings\n3 PM - Work focus\n7 PM - Break\n9 PM - Relaxation`;
    }
    
    // Email
    if (input.includes('email') || input.includes('mail')) {
      return "Aapke 3 naye emails hain. Microsoft se notification, LinkedIn se connection request, aur ek client ka message. Kya main unhe read karun?";
    }
    
    // Writing
    if (input.includes('likho') || input.includes('write') || input.includes('blog')) {
      return "Main aapke liye likha sakta hoon:\n- Blog posts\n- Emails\n- Social media content\n- Product descriptions\nKya likhna hai?";
    }
    
    // Translation
    if (input.includes('translate') || input.includes('translation') || input.includes('urdu') || input.includes('english')) {
      return "Main 25+ languages mein translate kar sakta hoon. Hinglish, English, Urdu, Hindi, Arabic aur bhi bohot sare. Kya translate karna hai?";
    }
    
    // Features
    if (input.includes('feature') || input.includes('kya kar') || input.includes('aap kya')) {
      return "Main ye 15+ kaam kar sakta hoon:\n1. Chat & Conversations\n2. Email Writing\n3. Content Creation\n4. Translation\n5. Data Entry\n6. Web Research\n7. Code Generation\n8. Scheduling\n9. Reminders\n10. Summarization\n11. Analysis\n12. Report Generation\n13. Task Management\n14. Voice Commands\n15. Workflow Automation\n\nAur bhi features add ho rahe hain!";
    }
    
    // Code
    if (input.includes('code') || input.includes('python') || input.includes('javascript')) {
      return "Main programming languages mein expert hoon:\n- Python\n- JavaScript\n- HTML/CSS\n- SQL\n- React\n- Node.js\n\nKya code likha chahiye?";
    }
    
    // General Greeting
    if (input.includes('thanks') || input.includes('dhanyavaad') || input.includes('shukriya')) {
      return "Aapka swagat hai! Mujhe aapke saath kaam karna pasand hai. Aur kuch chahiye?";
    }
    
    // Default
    return "Bilkul! Main samajh gaya. Aap kehna chah rahe ho ke ' " + userInput + " ' - sahi samjha? Mujhe batao aur main madad kar dunga!";
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate JAI thinking
    setTimeout(() => {
      const jaiResponse = getJaiResponse(inputText);
      const jaiMessage = {
        id: messages.length + 2,
        text: jaiResponse,
        sender: 'jai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, jaiMessage]);
      
      // Auto speak response
      speak(jaiResponse);
    }, 800);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">JAI AI</h2>
            <button onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <button className="w-full p-3 mb-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Home size={20} /> New Chat
          </button>
          
          <div className="mt-6">
            <h3 className="text-sm font-bold mb-3">Settings</h3>
            
            <div className="mb-4">
              <label className="text-sm">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full p-2 rounded mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              >
                <option value="hinglish">Hinglish</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-2 text-sm bg-gray-700 rounded hover:bg-gray-600 text-left"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'} border-b p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-700 rounded"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <Brain size={28} className="text-blue-500" />
              <h1 className="text-2xl font-bold">JAI AI</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-700 rounded">
              <Zap size={24} className="text-yellow-500" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg p-4 rounded-lg ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-xs opacity-70 mt-2 block">
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-300'} border-t p-4`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Kuch likhein ya bolein..."
              className={`flex-1 p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            
            <button
              onClick={startListening}
              className={`p-3 rounded-lg transition ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              title="Click to speak"
            >
              <Mic size={24} />
            </button>

            <button
              onClick={() => speak(inputText || "Bolne ke liye kuch likhen")}
              disabled={isSpeaking}
              className="p-3 rounded-lg bg-purple-600 hover:bg-purple-700"
              title="Text to speech"
            >
              <Volume2 size={24} />
            </button>

            <button
              onClick={handleSendMessage}
              className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700"
              title="Send message"
            >
              <Send size={24} />
            </button>
          </div>

          {isListening && (
            <div className="mt-2 p-2 bg-red-900 rounded text-center animate-pulse">
              🎙️ Listening... (Click mic again to stop)
            </div>
          )}

          {isSpeaking && (
            <div className="mt-2 p-2 bg-purple-900 rounded text-center animate-pulse">
              🔊 Speaking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JaiAI;