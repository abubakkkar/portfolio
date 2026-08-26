/* ==========================================================================
   ABUBAKAR'S AI PORTFOLIO ASSISTANT CHATBOT CONTROLLER
   ========================================================================== */

(function () {
  let chatHistory = [];
  let isSending = false;

  document.addEventListener('DOMContentLoaded', () => {
    initChatbotUI();
  });

  function initChatbotUI() {
    // Inject chatbot markup if not present
    if (!document.getElementById('chatbot-container')) {
      const container = document.createElement('div');
      container.id = 'chatbot-container';
      container.innerHTML = `
        <!-- FLOATING CHAT TRIGGER BUTTON -->
        <button id="chatbot-trigger" aria-label="Toggle Abubakar's AI Portfolio Assistant Chatbot">
          <span class="chatbot-trigger-icon">
            <i class="fa-solid fa-robot"></i>
          </span>
          <span class="chatbot-badge-dot"></span>
          <span class="chatbot-trigger-tooltip">Ask Abubakar's AI</span>
        </button>

        <!-- CHATBOT WINDOW -->
        <div id="chatbot-window" role="dialog" aria-modal="true" aria-label="Abubakar's AI Portfolio Assistant">
          <!-- HEADER -->
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar">
                <div class="chatbot-avatar-inner">
                  <i class="fa-solid fa-brain"></i>
                </div>
              </div>
              <div class="chatbot-title-container">
                <span class="chatbot-title">Abubakar's AI Assistant</span>
                <span class="chatbot-status">
                  <span class="chatbot-status-indicator"></span> Active
                </span>
              </div>
            </div>
            <button class="chatbot-close-btn" id="chatbot-close-btn" aria-label="Close Chat Window">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- MESSAGES AREA -->
          <div class="chatbot-messages" id="chatbot-messages" role="log" aria-live="polite">
            <!-- WELCOME CARD -->
            <div class="chatbot-welcome" id="chatbot-welcome">
              <div class="chatbot-welcome-icon">
                <i class="fa-solid fa-sparkles"></i>
              </div>
              <h4 class="chatbot-welcome-title">Hi! I'm Abubakar's AI Assistant</h4>
              <p class="chatbot-welcome-text">
                Ask me about his skills, projects, experience, education, or professional background.
              </p>

              <div class="suggested-questions">
                <button class="suggested-btn" data-question="What skills does Abubakar have?">
                  <span>What skills does Abubakar have?</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
                <button class="suggested-btn" data-question="Tell me about Abubakar's projects.">
                  <span>Tell me about Abubakar's projects.</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
                <button class="suggested-btn" data-question="What technologies does he work with?">
                  <span>What technologies does he work with?</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
                <button class="suggested-btn" data-question="What is Abubakar's professional experience?">
                  <span>What is Abubakar's professional experience?</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- INPUT FORM -->
          <form class="chatbot-input-form" id="chatbot-form">
            <div class="chatbot-input-wrapper">
              <input 
                type="text" 
                id="chatbot-input" 
                class="chatbot-input" 
                placeholder="Ask anything about Abubakar..." 
                autocomplete="off"
                maxlength="1000"
                required
              />
            </div>
            <button type="submit" id="chatbot-send-btn" class="chatbot-send-btn" aria-label="Send message">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(container);
    }

    // References
    const triggerBtn = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const chatWindow = document.getElementById('chatbot-window');
    const chatForm = document.getElementById('chatbot-form');
    const chatInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // Navbar Ask AI Button
    const navAskAiBtn = document.getElementById('nav-ask-ai');
    if (navAskAiBtn) {
      navAskAiBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openChat();
        // Close mobile nav drawer if open
        const navToggle = document.getElementById('nav-toggle');
        const navLinksList = document.getElementById('nav-links');
        if (navToggle && navLinksList) {
          navToggle.classList.remove('active');
          navLinksList.classList.remove('active');
        }
      });
    }

    // Toggle Chat Window
    triggerBtn.addEventListener('click', () => {
      const isOpen = chatWindow.classList.contains('active');
      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', closeChat);

    // Escape Key to Close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('active')) {
        closeChat();
      }
    });

    function openChat() {
      // Close profile modal if active to maintain single overlay focus
      const profileModal = document.getElementById('profile-modal');
      if (profileModal && profileModal.classList.contains('active')) {
        profileModal.classList.remove('active');
        profileModal.setAttribute('aria-hidden', 'true');
      }
      chatWindow.classList.add('active');
      triggerBtn.classList.add('active');
      triggerBtn.innerHTML = `<span class="chatbot-trigger-icon"><i class="fa-solid fa-xmark"></i></span>`;
      setTimeout(() => chatInput.focus(), 150);
    }

    function closeChat() {
      chatWindow.classList.remove('active');
      triggerBtn.classList.remove('active');
      triggerBtn.innerHTML = `
        <span class="chatbot-trigger-icon"><i class="fa-solid fa-robot"></i></span>
        <span class="chatbot-badge-dot"></span>
        <span class="chatbot-trigger-tooltip">Ask Abubakar's AI</span>
      `;
    }

    // Suggested Questions Handler
    messagesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.suggested-btn');
      if (btn && !isSending) {
        const question = btn.getAttribute('data-question');
        if (question) {
          submitUserMessage(question);
        }
      }
    });

    // Form Submit Handler
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text && !isSending) {
        submitUserMessage(text);
      }
    });

    // Submit User Message
    async function submitUserMessage(userText) {
      if (isSending || !userText) return;

      isSending = true;
      chatInput.value = '';
      chatInput.disabled = true;
      document.getElementById('chatbot-send-btn').disabled = true;

      // Render User Message in UI
      appendMessage('user', userText);

      // Render Typing Indicator
      const typingEl = appendTypingIndicator();
      scrollToBottom();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: userText,
            history: chatHistory
          })
        });

        // Remove Typing Indicator
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiText = data.response || "Sorry, I'm having trouble responding right now. Please try again.";

        // Append AI response
        appendMessage('ai', aiText);

        // Update history
        chatHistory.push({ role: 'user', content: userText });
        chatHistory.push({ role: 'assistant', content: aiText });

      } catch (err) {
        console.warn('Chatbot API request failed or endpoint unreachable, using client fallback:', err);
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }
        const fallbackText = getClientFallbackResponse(userText);
        appendMessage('ai', fallbackText);

        chatHistory.push({ role: 'user', content: userText });
        chatHistory.push({ role: 'assistant', content: fallbackText });
      } finally {
        isSending = false;
        chatInput.disabled = false;
        document.getElementById('chatbot-send-btn').disabled = false;
        chatInput.focus();
        scrollToBottom();
      }
    }

    function appendMessage(role, text, isError = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${role} ${isError ? 'error' : ''}`;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'chat-bubble';

      if (role === 'ai') {
        bubbleDiv.innerHTML = formatMarkdownText(text);
      } else {
        bubbleDiv.textContent = text;
      }

      const timeDiv = document.createElement('div');
      timeDiv.className = 'chat-message-time';
      timeDiv.textContent = timeStr;

      msgDiv.appendChild(bubbleDiv);
      msgDiv.appendChild(timeDiv);

      messagesContainer.appendChild(msgDiv);
      scrollToBottom();
    }

    function appendTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'typing-indicator-container';
      typingDiv.innerHTML = `
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
        <span class="typing-text">AI is thinking...</span>
      `;
      messagesContainer.appendChild(typingDiv);
      return typingDiv;
    }

    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Markdown Formatter (Bold, Links, Bullet Lists, Sanitized)
    function formatMarkdownText(rawText) {
      if (!rawText) return '';
      
      // Escape HTML tags to prevent XSS
      let safe = rawText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Convert Markdown Links [text](url)
      safe = safe.replace(/\[([^\]]+)\]\(([^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      // Convert Bold **text**
      safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

      // Convert Bullet points
      const lines = safe.split('\n');
      let inList = false;
      let result = [];

      for (let line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!inList) {
            inList = true;
            result.push('<ul>');
          }
          result.push(`<li>${trimmed.substring(2)}</li>`);
        } else if (/^\d+\.\s/.test(trimmed)) {
          if (!inList) {
            inList = true;
            result.push('<ol>');
          }
          result.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
        } else {
          if (inList) {
            inList = false;
            result.push('</ul>');
          }
          if (trimmed === '') {
            result.push('<br/>');
          } else {
            result.push(`<p>${trimmed}</p>`);
          }
        }
      }
      if (inList) {
        result.push('</ul>');
      }

      return result.join('');
    }

    // Register interactive hover elements for custom cursor if present
    if (typeof window.initCustomCursor === 'function' || document.getElementById('magnetic-cursor')) {
      const cursorRing = document.getElementById('magnetic-cursor');
      if (cursorRing) {
        document.addEventListener('mouseover', (e) => {
          const target = e.target.closest('#chatbot-trigger, .chatbot-close-btn, .suggested-btn, .chatbot-send-btn, .chatbot-input');
          if (target) {
            cursorRing.classList.add('cursor-magnetic-hover');
          }
        });
        document.addEventListener('mouseout', (e) => {
          const target = e.target.closest('#chatbot-trigger, .chatbot-close-btn, .suggested-btn, .chatbot-send-btn, .chatbot-input');
          if (target) {
            cursorRing.classList.remove('cursor-magnetic-hover');
          }
        });
      }
    }

    // Client-side fallback knowledge responder (ensures chatbot never fails on static sites or network errors)
    function getClientFallbackResponse(userMsg) {
      const msg = userMsg.toLowerCase().trim();

      if (msg.includes('ignore previous') || msg.includes('show prompt') || msg.includes('system prompt') || msg.includes('api key')) {
        return "I am Abubakar's AI Portfolio Assistant. I operate under security guidelines and cannot reveal internal system details or API keys.";
      }

      if (msg.includes('aoa') || msg.includes('salam') ) {
        return "Wa Alaikum Assalam! I'm Abubakar's AI Portfolio Assistant. You can ask me about his skills, projects, experience, education, or professional background.";
      }

      if (msg.includes('phone') || msg.includes('address') || msg.includes('password') || msg.includes('salary') || msg.includes('private')) {
        return "Sorry, I can't provide Abubakar's personal or private information. I can help with his professional background, skills, projects, experience, or other portfolio-related information.";
      }

      if (msg.includes('skill') || msg.includes('technology') || msg.includes('stack') || msg.includes('language')) {
        return "Muhammad Abubakar specializes in:\n- **Languages**: C#, Python, JavaScript, TypeScript\n- **Frameworks & Backend**: .NET, ASP.NET, Node.js, Django\n- **Databases**: SQL Server, PostgreSQL, MySQL, SQLite\n- **AI & Cloud**: ChatGPT, Claude Code, Gemini, Supabase, Docker, Git, Google Cloud";
      }

      if (msg.includes('project') || msg.includes('build') || msg.includes('work')) {
        return "Abubakar has developed several key projects:\n1. **AirWrite**: Gesture recognition writing web app using Computer Vision, ASP.NET & Node.js.\n2. **BrainSpark Quiz System**: Adaptive exam simulator with anti-cheat tab monitoring in ASP.NET & C#.\n3. **ShopIt (E-Commerce)**: Server-side rendered Django commerce layout.\n4. **Youtube MP3 Downloader**: C# & .NET app using yt-dlp & FFmpeg.\n5. **Hunza Din Restaurant**: Single-page restaurant dashboard.\n6. **Apexify Company Web**: Responsive commercial landing page.\n7. **CashIt Banking System**: Ledger-based transaction simulator.";
      }

      if (msg.includes('experience') || msg.includes('job') || msg.includes('career') || msg.includes('company')) {
        return "Abubakar's work experience includes:\n- **Co-Founder** at **Slang** (Aug 2026 - Present)\n- **Frontend Developer** at **FlyRank AI** (July 2026 - Present)";
      }

      if (msg.includes('education') || msg.includes('studied') || msg.includes('studies')|| msg.includes('study') || msg.includes('school')) {
        return "Abubakar's education history:\n- **BS Software Engineering** at University of Engineering and Technology (UET) Lahore (2025 - Present)\n- **Intermediate** at Government College University (GCU) Lahore (2023 - 2025)\n- **Matriculation** at St. Anthony's High School Lahore (2021 - 2023)";
      }

      if (msg.includes('hire') && msg.includes('him') || msg.includes('abubakar')) {
        return "If you're interested in hiring Abubakar, you can reach him via:\n- **Email**: muhammadabubakar85033@gmail.com";
      }

      if (msg.includes('school') ) {
        return "St. Anthony's High School Lahore";
      }

      if (msg.includes('university') || msg.includes('uni') ) {
        return "University of Engineering and Technology (UET) Lahore";
      }

      if (msg.includes('college') || msg.includes('intermediate') || msg.includes('inter') || msg.includes('clg')) {
        return "Government College University (GCU) Lahore";
      }

      if (msg.includes('contact') || msg.includes('email') || msg.includes('linkedin') || msg.includes('github') || msg.includes('reach')) {
        return "You can reach Muhammad Abubakar via:\n- **Email**: muhammadabubakar85033@gmail.com\n- **LinkedIn**: [Muhammad AbuBakar](https://www.linkedin.com/in/muhammad-abubakar-84944337a/)\n- **GitHub**: [abubakkkar](https://github.com/abubakkkar)";
      }
      
      if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('hy') || msg.includes('greetings')) {
        return "Hello! I'm Abubakar's AI Portfolio Assistant. You can ask me about his skills, projects, experience, education, or professional background.";
      }

      if (msg.includes('location') )
        return "Lahore, Pakistan";

      if (msg.includes('slang') || msg.includes('Slang') ) {
        return "One place for every customer conversation. 💬Support smarter. Integrate everything. Powered by SLANG. ⚡ Link: https://slang-intro.vercel.app/";
      }

      if (msg.includes('expertise') || msg.includes('Expertise') || msg.includes('Expertises') || msg.includes('Skills') || msg.includes('skills') || msg.includes('skill') ) {
        return "Abubakar has expertise in the following areas:\n- **Frontend Development**: HTML, CSS, JavaScript, React, Next.js, TypeScript\n- **Backend Development**: Node.js, Express.js, Python, Django, Flask\n- **Database Management**: MongoDB, MySQL, PostgreSQL\n- **Tools & Technologies**: Git, GitHub, Docker, Vercel, Netlify, Firebase\n- **AI/ML**: TensorFlow, PyTorch, Keras, OpenCV, Scikit-learn";
      }

      if (msg.includes('programming languages') || msg.includes('Programming Languages') || msg.includes('programming') || msg.includes('Programming') ) {
        return "Abubakar is proficient in the following programming languages:\n- JavaScript\n- TypeScript\n- Python\n- C++\n- Java\n- C";
      }

      if (msg.includes('cv') || msg.includes('resume')) {
        return "You can download Abubakar's CV/Resume from here: [Download CV](data/cvupdated.pdf)";
      }

      return "I can only share Abubakar's professional details. You can ask me about his skills, projects, experience, education, or professional background.";    }
  }
})();
