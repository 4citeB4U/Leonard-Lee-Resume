// Agent Lee AI Assistant - Interactive Narrator and Guide

class AgentLee {
  constructor() {
    this.isNarrating = false;
    this.currentSection = null;
    this.utterance = null;
    this.visitCount = this.getVisitCount();
    this.timeSpent = 0;
    this.sectionsViewed = new Set();
    this.isFrequentVisitor = this.visitCount >= 3;
    this.hmvMode = false;

    this.faqData = {
      "what is agent lee?": "I'm Agent Lee, Leonard Lee's AI assistant. I guide visitors through his AI projects, systems story, and portfolio experience.",
      "what does agent lee do?": "I provide narration, guided responses, section reading, and a lightweight assistant experience that can scale into a broader agent workflow.",
      "what is rapidwebdevelop?": "RapidWebDevelop LLC is Leonard's company focused on digital ownership, web experiences, and governance-first AI systems.",
      "what is leeway?": "LEEWAY is Leonard's standards framework for web engineering and AI governance, designed to support safe, scalable agent systems.",
      "how can agent lee help me?": "I can guide you through this resume, explain Leonard's technical strengths, and connect his projects to practical business outcomes.",
      "tell me about leonard lee": "Leonard Lee is a full-stack developer and AI systems architect focused on agent-first applications, voice interfaces, governance layers, and product-ready systems.",
      "what is hmv mode?": "HMV mode is my enhanced audio narration setting for a more polished speaking experience.",
      "am i a frequent visitor?": this.isFrequentVisitor
        ? "Yes. You're a frequent visitor, and I can tailor responses for return visits."
        : "This looks like one of your first visits. Welcome."
    };

    this.init();
  }

  init() {
    this.trackVisit();
    this.createAgentLeeInterface();
    this.addEventListeners();
    this.startEngagementTracking();
  }

  getVisitCount() {
    try {
      return parseInt(localStorage.getItem("agentLeeVisitCount") || "0", 10);
    } catch {
      return 0;
    }
  }

  trackVisit() {
    this.visitCount += 1;
    try {
      localStorage.setItem("agentLeeVisitCount", String(this.visitCount));
      localStorage.setItem("agentLeeLastVisit", String(Date.now()));
    } catch {
      // Ignore storage failures in privacy-restricted environments.
    }
  }

  startEngagementTracking() {
    window.setInterval(() => {
      this.timeSpent += 1000;
      this.updateFrequentVisitorStatus();
    }, 1000);

    if (!window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || entry.target.className || entry.target.tagName;
          this.sectionsViewed.add(sectionId);
          this.currentSection = entry.target;
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll("section, .card, .profile-card").forEach((element) => {
      observer.observe(element);
    });
  }

  updateFrequentVisitorStatus() {
    if (this.timeSpent > 60000 && this.sectionsViewed.size > 3) {
      this.isFrequentVisitor = true;
      try {
        localStorage.setItem("agentLeeFrequentVisitor", "true");
      } catch {
        // Ignore storage failures.
      }
    }
  }

  createAgentLeeInterface() {
    console.log("Creating Agent Lee interface...");

    const agentInterface = document.createElement("div");
    agentInterface.id = "agent-lee-interface";

    const frequentVisitorBadge = this.isFrequentVisitor
      ? '<div class="frequent-visitor-badge">Frequent Visitor</div>'
      : "";

    agentInterface.innerHTML = `
      <div id="agent-lee-panel" class="agent-lee-panel" style="display: none;">
        <div class="agent-lee-header">
          <h4>Agent Lee</h4>
          <button id="agent-lee-close" class="agent-lee-close" aria-label="Close Agent Lee">&times;</button>
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
            <button id="hmv-toggle" class="agent-lee-action-btn ${this.hmvMode ? "active" : ""}">
              <i class="fas fa-microphone"></i> HMV Mode
            </button>
          </div>
          <div class="agent-lee-faq">
            <h5>Ask Agent Lee:</h5>
            <div class="faq-questions">
              <button class="faq-btn" data-question="what is agent lee?">What is Agent Lee?</button>
              <button class="faq-btn" data-question="what does agent lee do?">What does Agent Lee do?</button>
              <button class="faq-btn" data-question="what is rapidwebdevelop?">What is RapidWebDevelop?</button>
              <button class="faq-btn" data-question="tell me about leonard lee">About Leonard Lee</button>
            </div>
          </div>
          <div class="agent-lee-chat">
            <div class="agent-lee-chat-window" id="agent-lee-chat-window">
              <div class="agent-lee-chat-message bot-message">Hi, I'm Agent Lee. Ask me about Leonard's AI work, coaching, or agent systems.</div>
            </div>
            <div class="agent-lee-chat-input">
              <input id="agent-lee-user-input" type="text" placeholder="Ask Agent Lee anything..." aria-label="Ask Agent Lee anything">
              <button id="agent-lee-send" class="agent-lee-action-btn">Send</button>
            </div>
          </div>
          <div class="agent-lee-stats">
            <small>Visit #${this.visitCount} | ${this.sectionsViewed.size} sections viewed</small>
          </div>
          <div id="agent-lee-response" class="agent-lee-response"></div>
        </div>
      </div>
    `;

    const styles = document.createElement("style");
    styles.textContent = `
      #agent-lee-interface {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-family: var(--font-sans, Arial, sans-serif);
      }

      .agent-lee-panel {
        position: fixed;
        bottom: 120px;
        left: 1.5rem;
        width: 320px;
        max-width: calc(100vw - 2rem);
        background: white;
        border-radius: 16px;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18);
        border: 1px solid rgba(59, 130, 246, 0.2);
        overflow: hidden;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.25s ease, transform 0.25s ease;
      }

      .agent-lee-panel.show {
        opacity: 1;
        transform: translateY(0);
      }

      .agent-lee-header {
        background: var(--secondary, #3b82f6);
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
        width: 30px;
        height: 30px;
      }

      .agent-lee-content {
        padding: 1rem;
      }

      .agent-lee-actions,
      .faq-questions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .agent-lee-action-btn {
        background: var(--secondary, #2563eb);
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .agent-lee-action-btn:hover,
      .faq-btn:hover {
        filter: brightness(1.05);
      }

      .agent-lee-faq h5 {
        margin: 1rem 0 0.75rem;
        color: var(--secondary, #2563eb);
        font-size: 1rem;
      }

      .agent-lee-chat {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        margin-top: 1rem;
      }

      .agent-lee-chat-window {
        background: #f8fafc;
        border: 1px solid #dbeafe;
        border-radius: 16px;
        padding: 1rem;
        max-height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .agent-lee-chat-message {
        padding: 0.85rem 1rem;
        border-radius: 14px;
        line-height: 1.4;
        font-size: 0.9rem;
      }

      .bot-message {
        background: #e0f2fe;
        border: 1px solid #bae6fd;
      }

      .user-message {
        background: #d1fae5;
        border: 1px solid #86efac;
        align-self: flex-end;
      }

      .agent-lee-chat-input {
        display: flex;
        gap: 0.5rem;
      }

      .agent-lee-chat-input input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 999px;
        font-size: 0.95rem;
      }

      .faq-btn {
        background: none;
        border: 1px solid var(--secondary, #2563eb);
        color: var(--secondary, #2563eb);
        padding: 0.5rem 0.75rem;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.82rem;
      }

      .frequent-visitor-badge {
        background: linear-gradient(135deg, #f59e0b, #f97316);
        color: white;
        padding: 0.5rem;
        text-align: center;
        font-size: 0.8rem;
        font-weight: 700;
      }

      .agent-lee-stats {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        color: #64748b;
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

      .agent-lee-response.show {
        display: block;
      }

      @media (max-width: 768px) {
        .agent-lee-panel {
          left: 1rem;
          right: 1rem;
          width: auto;
          bottom: 84px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(agentInterface);
    console.log("Agent Lee interface created and added to page");
  }

  addEventListeners() {
    console.log("Adding Agent Lee event listeners...");

    const toggleBtn = document.getElementById("agentLeeLaunch") || document.getElementById("agent-lee-toggle");
    const panel = document.getElementById("agent-lee-panel");
    const closeBtn = document.getElementById("agent-lee-close");
    const startBtn = document.getElementById("start-narration");
    const stopBtn = document.getElementById("stop-narration");
    const readBtn = document.getElementById("read-section");
    const hmvBtn = document.getElementById("hmv-toggle");
    const sendButton = document.getElementById("agent-lee-send");
    const userInput = document.getElementById("agent-lee-user-input");

    if (toggleBtn && panel) {
      toggleBtn.addEventListener("click", () => {
        if (panel.style.display === "none" || !panel.style.display) {
          panel.style.display = "block";
          window.setTimeout(() => panel.classList.add("show"), 10);
        } else {
          panel.classList.remove("show");
          window.setTimeout(() => {
            panel.style.display = "none";
          }, 250);
        }
      });
    } else {
      console.error("Agent Lee launch button not found");
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener("click", () => {
        panel.classList.remove("show");
        window.setTimeout(() => {
          panel.style.display = "none";
        }, 250);
      });
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => this.startFullNarration());
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => this.stopNarration());
    }

    if (readBtn) {
      readBtn.addEventListener("click", () => this.readCurrentSection());
    }

    if (hmvBtn) {
      hmvBtn.addEventListener("click", () => {
        this.hmvMode = !this.hmvMode;
        hmvBtn.classList.toggle("active", this.hmvMode);
      });
    }

    document.querySelectorAll(".faq-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const question = event.currentTarget.getAttribute("data-question");
        this.answerQuestion(question);
      });
    });

    if (sendButton && userInput) {
      sendButton.addEventListener("click", () => {
        const question = userInput.value.trim();
        if (!question) {
          this.showResponse("Type a question and press Send.");
          return;
        }

        this.appendChatMessage("You", question);
        this.answerQuestion(question);
        userInput.value = "";
      });

      userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          sendButton.click();
        }
      });
    }

    this.observeSections();
  }

  startFullNarration() {
    if (!("speechSynthesis" in window)) {
      this.showResponse("Sorry, your browser doesn't support speech synthesis.");
      return;
    }

    this.isNarrating = true;
    const startBtn = document.getElementById("start-narration");
    const stopBtn = document.getElementById("stop-narration");
    if (startBtn) startBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "block";

    const introText = "Hello. I'm Agent Lee, and I'll guide you through Leonard Lee's resume, systems work, and leadership story.";
    this.speak(introText, () => this.narrateSections());
  }

  narrateSections() {
    const sections = document.querySelectorAll("section");
    let currentIndex = 0;

    const narrateNext = () => {
      if (currentIndex < sections.length && this.isNarrating) {
        const section = sections[currentIndex];
        const title = section.querySelector(".section-title, h2")?.textContent || "Section";
        const content = this.extractSectionText(section);
        this.highlightSection(section);
        this.speak(`Now viewing ${title}. ${content}`, () => {
          currentIndex += 1;
          window.setTimeout(narrateNext, 750);
        });
      } else {
        this.stopNarration();
      }
    };

    narrateNext();
  }

  readCurrentSection() {
    const sections = document.querySelectorAll("section");
    const viewportCenter = window.innerHeight / 2;
    let currentSection = null;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        currentSection = section;
      }
    });

    if (!currentSection) {
      this.speak("Please scroll to a section to read it.");
      return;
    }

    const title = currentSection.querySelector(".section-title, h2")?.textContent || "Current section";
    const content = this.extractSectionText(currentSection);
    this.highlightSection(currentSection);
    this.speak(`${title}. ${content}`);
  }

  extractSectionText(section) {
    const title = section.querySelector(".section-title, h2")?.textContent || "";
    const textBlocks = section.querySelectorAll("p, li, td, .skill-tag, .registry-chip");
    let text = title ? `${title}. ` : "";

    textBlocks.forEach((node) => {
      const content = node.textContent.trim();
      if (content && content.length < 240) {
        text += `${content}. `;
      }
    });

    return text.substring(0, 420) + (text.length > 420 ? "..." : "");
  }

  highlightSection(section) {
    document.querySelectorAll("section").forEach((item) => {
      item.style.outline = "none";
      item.style.outlineOffset = "0";
    });

    section.style.outline = "3px solid rgba(70, 167, 255, 0.9)";
    section.style.outlineOffset = "8px";
    section.scrollIntoView({ behavior: "smooth", block: "center" });

    window.setTimeout(() => {
      section.style.outline = "none";
    }, 2500);
  }

  speak(text, callback) {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (this.utterance) {
      speechSynthesis.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = this.hmvMode ? 0.84 : 0.92;
    this.utterance.pitch = this.hmvMode ? 0.92 : 1;
    this.utterance.volume = 0.85;

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

    const startBtn = document.getElementById("start-narration");
    const stopBtn = document.getElementById("stop-narration");
    if (startBtn) startBtn.style.display = "block";
    if (stopBtn) stopBtn.style.display = "none";

    document.querySelectorAll("section").forEach((section) => {
      section.style.outline = "none";
    });
  }

  answerQuestion(question) {
    const answer = this.getKnowledgeResponse(question);
    const finalAnswer = answer || "I'm sorry, I don't have information about that yet. Try asking about Agent Lee, RapidWebDevelop, Leonard's experience, or LEEWAY.";
    this.appendChatMessage("Agent Lee", finalAnswer);
    this.showResponse(finalAnswer);
    this.speak(finalAnswer);
  }

  getKnowledgeResponse(question) {
    if (!question) {
      return null;
    }

    const normalized = question.toLowerCase().trim();
    if (this.faqData[normalized]) {
      return this.faqData[normalized];
    }

    return Object.keys(this.faqData).find((key) => normalized.includes(key) || key.includes(normalized))
      ? this.faqData[Object.keys(this.faqData).find((key) => normalized.includes(key) || key.includes(normalized))]
      : null;
  }

  appendChatMessage(author, text) {
    const chatWindow = document.getElementById("agent-lee-chat-window");
    if (!chatWindow) {
      return;
    }

    const message = document.createElement("div");
    message.className = `agent-lee-chat-message ${author === "You" ? "user-message" : "bot-message"}`;
    message.innerHTML = `<strong>${author}:</strong> ${text}`;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  showResponse(text) {
    const responseDiv = document.getElementById("agent-lee-response");
    const panel = document.getElementById("agent-lee-panel");
    if (!responseDiv) {
      return;
    }

    if (panel) {
      panel.style.display = "block";
      panel.classList.add("show");
    }

    responseDiv.textContent = text;
    responseDiv.classList.add("show");

    window.setTimeout(() => {
      responseDiv.classList.remove("show");
    }, 8000);
  }

  observeSections() {
    if (!window.IntersectionObserver) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.currentSection = entry.target;
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, creating Agent Lee...");
  window.agentLee = new AgentLee();
  console.log("Agent Lee created:", window.agentLee);
});

function addAgentLeeListeners() {
  const profileElements = document.querySelectorAll(".tech-icon, .skill-item, .project-card");
  profileElements.forEach((element) => {
    element.addEventListener("click", () => {
      if (window.agentLee) {
        const text = element.textContent || element.title || "This is an interactive element";
        window.agentLee.speak(`You clicked on ${text}`);
      }
    });
  });
}

window.addEventListener("load", addAgentLeeListeners);
