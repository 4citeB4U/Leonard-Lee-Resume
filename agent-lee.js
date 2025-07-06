// Agent Lee - AI Assistant for Leonard Lee's Resume
class AgentLee {
  constructor() {
    this.isActive = false;
    this.currentLanguage = 'en';
    this.availableLanguages = {
      'en': { name: 'English', voice: 'en-US' },
      'es': { name: 'Español', voice: 'es-ES' },
      'fr': { name: 'Français', voice: 'fr-FR' },
      'de': { name: 'Deutsch', voice: 'de-DE' },
      'zh': { name: '中文', voice: 'zh-CN' },
      'ja': { name: '日本語', voice: 'ja-JP' },
      'ar': { name: 'العربية', voice: 'ar-SA' }
    };
    
    // Access translations from the window object
    this.resumeTranslations = window.resumeTranslations || {};
    this.translations = {
      'greeting': {
        'en': "Hello! I'm Agent Lee, your AI assistant. I can help navigate this resume and translate content. Leonard Lee primarily speaks English.",
        'es': "¡Hola! Soy Agent Lee, tu asistente de IA. Puedo ayudarte a navegar por este currículum y traducir el contenido. Leonard Lee habla principalmente inglés.",
        'fr': "Bonjour! Je suis Agent Lee, votre assistant IA. Je peux vous aider à naviguer dans ce CV et traduire le contenu. Leonard Lee parle principalement anglais.",
        'de': "Hallo! Ich bin Agent Lee, Ihr KI-Assistent. Ich kann Ihnen helfen, diesen Lebenslauf zu navigieren und Inhalte zu übersetzen. Leonard Lee spricht hauptsächlich Englisch.",
        'zh': "你好！我是Agent Lee，您的AI助手。我可以帮助导航此简历并翻译内容。Leonard Lee主要讲英语。",
        'ja': "こんにちは！私はAgent Lee、あなたのAIアシスタントです。このレジュメのナビゲートやコンテンツの翻訳をお手伝いします。Leonard Leeは主に英語を話します。",
        'ar': "مرحبًا! أنا Agent Lee، مساعدك الذكاء الاصطناعي. يمكنني مساعدتك في تصفح هذه السيرة الذاتية وترجمة المحتوى. يتحدث Leonard Lee بشكل أساسي الإنجليزية."
      },
      'helpMessage': {
        'en': "I can help you read this resume, translate it, or answer questions about Leonard Lee.",
        'es': "Puedo ayudarte a leer este currículum, traducirlo o responder preguntas sobre Leonard Lee.",
        'fr': "Je peux vous aider à lire ce CV, le traduire ou répondre à des questions sur Leonard Lee.",
        'de': "Ich kann Ihnen helfen, diesen Lebenslauf zu lesen, zu übersetzen oder Fragen über Leonard Lee zu beantworten.",
        'zh': "我可以帮助您阅读此简历，翻译它，或回答有关Leonard Lee的问题。",
        'ja': "このレジュメを読んだり、翻訳したり、Leonard Leeに関する質問に答えたりすることができます。",
        'ar': "يمكنني مساعدتك في قراءة هذه السيرة الذاتية أو ترجمتها أو الإجابة عن أسئلة حول Leonard Lee."
      },
      'languageChanged': {
        'en': "Language changed to English.",
        'es': "Idioma cambiado a Español.",
        'fr': "Langue changée en Français.",
        'de': "Sprache auf Deutsch geändert.",
        'zh': "语言已更改为中文。",
        'ja': "言語が日本語に変更されました。",
        'ar': "تم تغيير اللغة إلى العربية."
      }
    };
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.isSpeaking = false;

    // Initialize on construction
    this.init();
  }

  // Initialize Agent Lee
  init() {
    this.createButton();
    this.createCard();
    this.loadVoices();

    // Reload voices when they change
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  // Create Agent Lee button
  createButton() {
    const button = document.createElement('div');
    button.id = 'agent-lee-button';
    button.innerHTML = `
      <img src="l2u5shhjjj.png" alt="Agent Lee" />
      <span class="pulse"></span>
    `;
    document.body.appendChild(button);

    button.addEventListener('click', () => this.toggleCard());
  }

  // Create Agent Lee card
  createCard() {
    const card = document.createElement('div');
    card.id = 'agent-lee-card';
    card.className = 'hidden';
    
    card.innerHTML = `
      <div class="agent-lee-header">
        <div class="agent-lee-avatar">
          <img src="l2u5shhjjj.png" alt="Agent Lee" />
        </div>
        <div class="agent-lee-title">
          <h3>Agent Lee</h3>
          <p>AI Assistant</p>
        </div>
        <div class="agent-lee-close">×</div>
      </div>
      <div class="agent-lee-body">
        <div class="agent-lee-message">
          <p id="agent-lee-greeting"></p>
        </div>
        <div class="agent-lee-controls">
          <div class="agent-lee-language-selector">
            <label for="agent-lee-language">Language:</label>
            <select id="agent-lee-language">
              ${Object.entries(this.availableLanguages).map(([code, lang]) => 
                `<option value="${code}">${lang.name}</option>`
              ).join('')}
            </select>
          </div>
          <div class="agent-lee-buttons">
            <button id="agent-lee-speak" class="agent-lee-button">
              <i class="fas fa-play"></i> Speak
            </button>
            <button id="agent-lee-stop" class="agent-lee-button" disabled>
              <i class="fas fa-stop"></i> Stop
            </button>
            <button id="agent-lee-translate" class="agent-lee-button">
              <i class="fas fa-language"></i> Translate Page
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(card);
    
    // Add event listeners
    document.querySelector('.agent-lee-close').addEventListener('click', () => this.toggleCard());
    document.getElementById('agent-lee-language').addEventListener('change', (e) => this.changeLanguage(e.target.value));
    document.getElementById('agent-lee-speak').addEventListener('click', () => this.speak(this.translations.greeting[this.currentLanguage]));
    document.getElementById('agent-lee-stop').addEventListener('click', () => this.stopSpeaking());
    document.getElementById('agent-lee-translate').addEventListener('click', () => this.translatePage());
    
    // Set initial message
    this.updateGreeting();
  }

  // Toggle Agent Lee card visibility
  toggleCard() {
    const card = document.getElementById('agent-lee-card');
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      card.classList.remove('hidden');
      card.classList.add('visible');
      this.speak(this.translations.greeting[this.currentLanguage]);
    } else {
      card.classList.remove('visible');
      card.classList.add('hidden');
      this.stopSpeaking();
    }
  }

  // Load available voices
  loadVoices() {
    this.voices = this.synth.getVoices();
    console.log("Available voices loaded:", this.voices.length);
  }

  // Get the appropriate voice for the current language
  getVoice() {
    const langCode = this.availableLanguages[this.currentLanguage].voice;
    
    // Try to find a voice that matches the language code
    let voice = this.voices.find(v => v.lang.startsWith(langCode));
    
    // Fallback to any voice available for the language
    if (!voice) {
      voice = this.voices.find(v => v.lang.includes(langCode.split('-')[0]));
    }
    
    // Final fallback to the first available voice
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0];
    }
    
    return voice;
  }

  // Speak the given text
  speak(text) {
    if (!this.synth) return;
    
    this.stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getVoice();
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = this.availableLanguages[this.currentLanguage].voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      document.getElementById('agent-lee-speak').disabled = true;
      document.getElementById('agent-lee-stop').disabled = false;
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      document.getElementById('agent-lee-speak').disabled = false;
      document.getElementById('agent-lee-stop').disabled = true;
    };
    
    this.synth.speak(utterance);
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synth && this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      document.getElementById('agent-lee-speak').disabled = false;
      document.getElementById('agent-lee-stop').disabled = true;
    }
  }

  // Change the current language
  changeLanguage(langCode) {
    if (this.availableLanguages[langCode]) {
      this.currentLanguage = langCode;
      this.updateGreeting();
      this.speak(this.translations.languageChanged[this.currentLanguage]);
      
      // Update page direction for RTL languages
      if (langCode === 'ar') {
        document.body.dir = 'rtl';
      } else {
        document.body.dir = 'ltr';
      }
    }
  }

  // Update greeting message
  updateGreeting() {
    const greetingElement = document.getElementById('agent-lee-greeting');
    if (greetingElement) {
      greetingElement.textContent = this.translations.greeting[this.currentLanguage];
    }
  }

  // Translate the page content
  translatePage() {
    // First notify user that translation is happening
    this.speak(this.translations.languageChanged[this.currentLanguage]);
    
    // Check if we have translations for this language
    if (!this.resumeTranslations[this.currentLanguage]) {
      alert(`Translations for ${this.availableLanguages[this.currentLanguage].name} are not available.`);
      return;
    }
    
    // Update page title
    document.title = this.resumeTranslations[this.currentLanguage].resume_title;
    
    // Update profile section
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
      profileName.textContent = this.resumeTranslations[this.currentLanguage].profile_name;
    }
    
    const profileTitle = document.querySelector('.profile-title');
    if (profileTitle) {
      profileTitle.textContent = this.resumeTranslations[this.currentLanguage].profile_title;
    }
    
    const profileBio = document.querySelector('.profile-bio');
    if (profileBio) {
      profileBio.textContent = this.resumeTranslations[this.currentLanguage].profile_bio;
    }
    
    // Update section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(titleElement => {
      const titleText = titleElement.textContent.trim();
      
      // Match section title with translation key
      if (titleText.includes('LEEWAY')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_leeway;
      } else if (titleText.includes('Experience')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_experience;
      } else if (titleText.includes('Core Competencies')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_skills;
      } else if (titleText.includes('Featured Projects')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_projects;
      } else if (titleText.includes('Education')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_education;
      } else if (titleText.includes('Certifications')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_certifications;
      } else if (titleText.includes('Community')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_community;
      } else if (titleText.includes('GitHub')) {
        titleElement.textContent = this.resumeTranslations[this.currentLanguage].section_github;
      }
    });
    
    // Update buttons
    const printButton = document.querySelector('#printButton');
    if (printButton) {
      printButton.innerHTML = `<i class="fas fa-file-pdf"></i> ${this.resumeTranslations[this.currentLanguage].print_pdf}`;
    }
    
    const downloadButton = document.querySelector('.download-btn[download]');
    if (downloadButton) {
      downloadButton.innerHTML = `<i class="fas fa-file-csv"></i> ${this.resumeTranslations[this.currentLanguage].download_csv}`;
    }
    
    const businessCardLink = document.querySelector('.project-link[href="gwglulpjnx.html"]');
    if (businessCardLink) {
      businessCardLink.innerHTML = `<i class="fas fa-id-card"></i> ${this.resumeTranslations[this.currentLanguage].view_card}`;
    }
    
    // Update footer text
    const footerText = document.querySelector('.footer-text');
    if (footerText) {
      footerText.textContent = this.resumeTranslations[this.currentLanguage].footer_text;
    }
    
    const copyright = document.querySelector('.footer-content > p:last-child');
    if (copyright) {
      copyright.textContent = this.resumeTranslations[this.currentLanguage].copyright;
    }
    
    // Set page direction for RTL languages
    if (this.currentLanguage === 'ar') {
      document.body.dir = 'rtl';
    } else {
      document.body.dir = 'ltr';
    }
  }
}

// Initialize Agent Lee when the page is fully loaded
window.addEventListener('load', () => {
  const agentLee = new AgentLee();
  
  // Make Agent Lee accessible globally (for debug purposes)
  window.agentLee = agentLee;
});