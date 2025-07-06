// Agent Lee AI Assistant - Interactive Narrator and Guide
// This script provides voice narration, FAQ functionality, and interactive guidance

class AgentLee {
  constructor() {
    this.isNarrating = false;
    this.currentSection = null;
    this.utterance = null;
    this.visitCount = this.getVisitCount();
    this.sessionStartTime = Date.now();
    this.timeSpent = 0;
    this.sectionsViewed = new Set();
    this.isFrequentVisitor = this.visitCount >= 3;
    this.hmvMode = false; // His Master's Voice mode for enhanced audio experience
    
    this.faqData = {
      "what is agent lee?": "Agent Lee is an AI assistant created by Leonard Lee to help users navigate digital platforms, provide guidance, and represent businesses with the LEEWAY standards framework.",
      "what does agent lee do?": "Agent Lee provides voice navigation, interactive FAQ responses, digital education, and helps over 20 companies establish their digital presence.",
      "what is rapidwebdevelop?": "RapidWebDevelop LLC is a company founded by Leonard Lee that empowers artists with true digital ownership through single-file websites with no recurring fees.",
      "what is leeway?": "LEEWAY stands for Logically Enhanced Web Engineering Architecture Yield - a proprietary framework for professional AI development and deployment.",
      "how can agent lee help me?": "Agent Lee can guide you through this resume, narrate content, answer questions about Leonard's experience, and provide information about his services.",
      "tell me about leonard lee": "Leonard Lee is the founder of RapidWebDevelop LLC, creator of Agent Lee AI Assistant, and expert in the LEEWAY Standards Framework with 15+ years of experience in logistics and tech leadership.",
      "what is hmv mode?": "HMV (His Master's Voice) mode provides enhanced audio narration with professional voice synthesis and improved accessibility for users who prefer audio content.",
      "am i a frequent visitor?": this.isFrequentVisitor ? "Yes! You're a frequent visitor. Agent Lee has personalized recommendations based on your previous visits." : "This appears to be one of your first visits. Welcome! Agent Lee will help you navigate Leonard's resume."
    };
    
    this.init();
  }

  init() {
    this.trackVisit();
    this.createAgentLeeInterface();
    this.addEventListeners();
    this.showWelcomeMessage();
    this.startEngagementTracking();
  }

  getVisitCount() {
    return parseInt(localStorage.getItem('agentLeeVisitCount') || '0');
  }

  trackVisit() {
    this.visitCount++;
    localStorage.setItem('agentLeeVisitCount', this.visitCount.toString());
    localStorage.setItem('agentLeeLastVisit', Date.now().toString());
  }

  startEngagementTracking() {
    // Track time spent on page
    setInterval(() => {
      this.timeSpent += 1000;
      this.updateFrequentVisitorStatus();
    }, 1000);

    // Track section views
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className;
          this.sectionsViewed.add(sectionId);
          this.currentSection = entry.target;
        }
      });
    }, observerOptions);

    // Observe all major sections
    document.querySelectorAll('.card, .section, .profile-card').forEach(el => {
      observer.observe(el);
    });
  }

  updateFrequentVisitorStatus() {
    if (this.timeSpent > 60000 && this.sectionsViewed.size > 3) { // 1 minute + 3 sections
      this.isFrequentVisitor = true;
      localStorage.setItem('agentLeeFrequentVisitor', 'true');
    }
  }

  createAgentLeeInterface() {
    console.log('Creating Agent Lee interface...');
    
    // Create Agent Lee floating interface
    const agentInterface = document.createElement('div');
    agentInterface.id = 'agent-lee-interface';
    
    const frequentVisitorBadge = this.isFrequentVisitor ? 
      `<div class="frequent-visitor-badge">⭐ Frequent Visitor</div>` : '';
    
    agentInterface.innerHTML = `
      <div class="agent-lee-controls">
        <button id="agent-lee-toggle" class="agent-lee-btn" title="Agent Lee Assistant">
          <img src="agentlee_avatar.png" alt="Agent Lee" class="agent-lee-btn-avatar" onerror="this.style.display='none'; this.parentElement.innerHTML+='<i class=\'fas fa-robot\' style=\'font-size:1.5rem;color:white;\'></i>';">
          ${this.isFrequentVisitor ? '<span class="visitor-indicator">⭐</span>' : ''}
        </button>
        <div id="agent-lee-panel" class="agent-lee-panel" style="display: none;">
          <div class="agent-lee-header">
            <h4>🤖 Agent Lee</h4>
            <button id="agent-lee-close" class="agent-lee-close">&times;</button>
          </div>
          ${frequentVisitorBadge}
          <div class="agent-lee-content">
            <div class="agent-lee-actions">
              <button id="start-narration" class="agent-lee-action-btn">
                <i class="fas fa-play"></i> Start Narration
              </button>
              <button id="stop-narration" class="agent-lee-action-btn" style="display: none;">
                <i class="fas fa-stop"></i> Stop Narration
              </button>
              <button id="read-section" class="agent-lee-action-btn">
                <i class="fas fa-volume-up"></i> Read Current Section
              </button>
              <button id="hmv-toggle" class="agent-lee-action-btn ${this.hmvMode ? 'active' : ''}">
                <i class="fas fa-microphone"></i> HMV Mode
              </button>
            </div>
            <div class="agent-lee-faq">
              <h5>Ask Agent Lee:</h5>
              <div class="faq-questions">
                <button class="faq-btn" data-question="what is agent lee?">What is Agent Lee?</button>
                <button class="faq-btn" data-question="what does agent lee do?">What does Agent Lee do?</button>
                <button class="faq-btn" data-question="what is rapidwebdevelop?">What is RapidWebDevelop?</button>
                <button class="faq-btn" data-question="what is leeway?">What is LEEWAY?</button>
                <button class="faq-btn" data-question="what is hmv mode?">What is HMV Mode?</button>
                <button class="faq-btn" data-question="am i a frequent visitor?">Am I a frequent visitor?</button>
                <button class="faq-btn" data-question="tell me about leonard lee">About Leonard Lee</button>
              </div>
            </div>
            <div class="agent-lee-stats">
              <small>Visit #${this.visitCount} • ${this.sectionsViewed.size} sections viewed</small>
            </div>
            <div id="agent-lee-response" class="agent-lee-response"></div>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #agent-lee-interface {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: var(--font-primary);
      }

      .agent-lee-btn {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      }

      .agent-lee-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
      }

      @keyframes pulse {
        0% { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
        50% { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.6); }
        100% { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
      }

      .agent-lee-panel {
        position: absolute;
        bottom: 70px;
        right: 0;
        width: 320px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(99, 102, 241, 0.2);
        overflow: hidden;
      }

      .dark-mode .agent-lee-panel {
        background: #1e293b;
        color: var(--color-light);
      }

      .agent-lee-header {
        background: var(--color-primary);
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .agent-lee-header h4 {
        margin: 0;
        font-size: 1.1rem;
      }

      .agent-lee-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .agent-lee-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .agent-lee-content {
        padding: 1rem;
      }

      .agent-lee-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .agent-lee-action-btn {
        background: var(--color-secondary);
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .agent-lee-action-btn:hover {
        background: #d97706;
        transform: translateY(-2px);
      }

      .agent-lee-action-btn.active {
        background: var(--color-secondary);
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
      }

      .agent-lee-faq h5 {
        margin: 0 0 0.75rem 0;
        color: var(--color-primary);
        font-size: 1rem;
      }

      .faq-questions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .faq-btn {
        background: none;
        border: 1px solid var(--color-primary);
        color: var(--color-primary);
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.8rem;
        margin: 0.25rem;
        transition: all 0.3s ease;
      }

      .faq-btn:hover {
        background: var(--color-primary);
        color: white;
      }

      .frequent-visitor-badge {
        background: linear-gradient(135deg, #f59e0b, #f97316);
        color: white;
        padding: 0.5rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: bold;
        animation: shimmer 2s infinite;
      }
      
      .visitor-indicator {
        position: absolute;
        top: -5px;
        right: -5px;
        background: #f59e0b;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        animation: pulse 2s infinite;
      }
      
      .agent-lee-stats {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: var(--color-gray);
      }
      
      .dark-mode .agent-lee-stats {
        border-color: #4b5563;
      }
      
      @keyframes shimmer {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
      
      .agent-lee-response {
        background: #f3f4f6;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        line-height: 1.5;
        font-size: 0.9rem;
        display: none;
      }
      
      .dark-mode .agent-lee-response {
        background: #374151;
      }
      
      .agent-lee-response.show {
        display: block;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .agent-lee-panel {
          width: 280px;
          right: -10px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(agentInterface);
    console.log('Agent Lee interface created and added to page');
  }

  addEventListeners() {
    console.log('Adding Agent Lee event listeners...');
    
    // Toggle Agent Lee panel
    const toggleBtn = document.getElementById('agent-lee-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        console.log('Agent Lee toggle button clicked');
        const panel = document.getElementById('agent-lee-panel');
        if (panel) {
          if (panel.style.display === 'none' || !panel.style.display) {
            console.log('Showing Agent Lee panel');
            panel.style.display = 'block';
            setTimeout(() => panel.classList.add('show'), 10);
          } else {
            console.log('Hiding Agent Lee panel');
            panel.classList.remove('show');
            setTimeout(() => panel.style.display = 'none', 300);
          }
        } else {
          console.error('Agent Lee panel not found');
        }
      });
    } else {
      console.error('Agent Lee toggle button not found');
    }

    // Close panel
    const closeBtn = document.getElementById('agent-lee-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        console.log('Agent Lee close button clicked');
        const panel = document.getElementById('agent-lee-panel');
        if (panel) {
          panel.classList.remove('show');
          setTimeout(() => panel.style.display = 'none', 300);
        }
      });
    } else {
      console.error('Agent Lee close button not found');
    }

    // Narration controls
    document.getElementById('start-narration').addEventListener('click', () => {
      this.startFullNarration();
    });

    document.getElementById('stop-narration').addEventListener('click', () => {
      this.stopNarration();
    });

    document.getElementById('read-section').addEventListener('click', () => {
      this.readCurrentSection();
    });

    // FAQ buttons
    document.querySelectorAll('.faq-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const question = e.target.getAttribute('data-question');
        this.answerQuestion(question);
      });
    });

    // Auto-detect section changes
    this.observeSections();
  }

  showWelcomeMessage() {
    setTimeout(() => {
      this.showResponse("👋 Hello! I'm Agent Lee, your AI assistant. Click on me to explore narration features and ask questions about Leonard's resume!");
    }, 2000);
  }

  startFullNarration() {
    if (!('speechSynthesis' in window)) {
      this.showResponse("Sorry, your browser doesn't support speech synthesis.");
      return;
    }

    this.isNarrating = true;
    document.getElementById('start-narration').style.display = 'none';
    document.getElementById('stop-narration').style.display = 'block';

    const introText = `Hello! I'm Agent Lee, and I'll be your guide through Leonard Lee's professional resume. 
    Leonard is the founder of RapidWebDevelop LLC and creator of the LEEWAY Standards Framework. 
    He has over 15 years of experience in logistics and technology leadership. 
    Let me walk you through his impressive background and achievements.`;

    this.speak(introText, () => {
      this.narrateSections();
    });
  }

  narrateSections() {
    const sections = document.querySelectorAll('.section');
    let currentIndex = 0;

    const narrateNext = () => {
      if (currentIndex < sections.length && this.isNarrating) {
        const section = sections[currentIndex];
        const title = section.querySelector('.section-title')?.textContent || 'Section';
        this.highlightSection(section);
        
        let content = `Now viewing: ${title}. `;
        const textContent = this.extractSectionText(section);
        content += textContent;

        this.speak(content, () => {
          currentIndex++;
          setTimeout(narrateNext, 1000);
        });
      } else {
        this.stopNarration();
      }
    };

    narrateNext();
  }

  readCurrentSection() {
    const sections = document.querySelectorAll('.section');
    const viewportCenter = window.innerHeight / 2;
    let currentSection = null;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const title = currentSection.querySelector('.section-title')?.textContent || 'Current section';
      const content = this.extractSectionText(currentSection);
      this.highlightSection(currentSection);
      this.speak(`${title}. ${content}`);
    } else {
      this.speak("Please scroll to a section to read it.");
    }
  }

  extractSectionText(section) {
    const title = section.querySelector('.section-title')?.textContent || '';
    const paragraphs = section.querySelectorAll('p, td, .skill-item span');
    let text = '';

    paragraphs.forEach(p => {
      const content = p.textContent.trim();
      if (content.length > 0 && content.length < 200) {
        text += content + '. ';
      }
    });

    return text.substring(0, 300) + (text.length > 300 ? '...' : '');
  }

  highlightSection(section) {
    // Remove previous highlights
    document.querySelectorAll('.section').forEach(s => {
      s.style.outline = 'none';
    });

    // Highlight current section
    section.style.outline = '3px solid var(--color-primary)';
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      section.style.outline = 'none';
    }, 3000);
  }

  speak(text, callback) {
    if (this.utterance) {
      speechSynthesis.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.9;
    this.utterance.pitch = 1;
    this.utterance.volume = 0.8;

    if (callback) {
      this.utterance.onend = callback;
    }

    speechSynthesis.speak(this.utterance);
  }

  stopNarration() {
    this.isNarrating = false;
    if (this.utterance) {
      speechSynthesis.cancel();
    }
    document.getElementById('start-narration').style.display = 'block';
    document.getElementById('stop-narration').style.display = 'none';
    
    // Remove highlights
    document.querySelectorAll('.section').forEach(s => {
      s.style.outline = 'none';
    });
  }

  answerQuestion(question) {
    const answer = this.faqData[question.toLowerCase()];
    if (answer) {
      this.showResponse(answer);
      this.speak(answer);
    } else {
      this.showResponse("I'm sorry, I don't have information about that. Try asking about Agent Lee, RapidWebDevelop, or Leonard's experience!");
    }
  }

  showResponse(text) {
    const responseDiv = document.getElementById('agent-lee-response');
    responseDiv.textContent = text;
    responseDiv.classList.add('visible');
    
    setTimeout(() => {
      responseDiv.classList.remove('visible');
    }, 8000);
  }

  observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target;
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  }
}

// Initialize Agent Lee when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, creating Agent Lee...');
  window.agentLee = new AgentLee();
  console.log('Agent Lee created:', window.agentLee);
});

// Additional utility functions
function addAgentLeeListeners() {
  // Add click listeners to profile elements for guided explanations
  const profileElements = document.querySelectorAll('.tech-icon, .skill-item, .project-card');
  
  profileElements.forEach(element => {
    element.addEventListener('click', () => {
      if (window.agentLee) {
        const text = element.textContent || element.title || "This is an interactive element";
        window.agentLee.speak(`You clicked on: ${text}`);
      }
    });
  });
}

// Add enhanced interactivity when page loads
window.addEventListener('load', addAgentLeeListeners);
