/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY_PROJECTION / RESUME_AGENT
TAG: LEEWAY-RESUME-FABRIC-ADAPTERS-20261021
WHO: Leonard Jerome Lee (Creator); Agent Lee (website projection); AI assistant (implementation)
WHAT: Adapter to canonical LeeWay Voice Fabric and RapidWebDevelop Digital Brain public knowledge.
WHEN: 2026-10-21
WHERE: Leonard-Lee-Resume/resume-fabric-adapters.js
WHY: Reuse existing voice and brain sources; do not fork their authority.
HOW: Load canonical SDK, active voice profile and Digital Brain published public records.
AUTHORIZED ROLES: Creator-requested website projection; no authority to change Voice Fabric itself.
LICENSE: All rights reserved by original LeeWay owners; no implied sublicensing.
EVIDENCE: Repository contracts inspected; this adapter does not claim live audio playback, Formula execution, or backend health.
*/
(function (root) {
  "use strict";
  const VOICE_ORIGIN = "https://4citeb4u.github.io/LeeWay-Voice-Fabric";
  const VOICE_PROFILE = "https://raw.githubusercontent.com/4citeB4U/LeeWay-Voice-Fabric/main/profiles/agent-lee-active-voice.v1.json";
  const RAPID = "https://rapidwebdevelop.com";
  const RAW = "https://raw.githubusercontent.com/4citeB4U/RapidWebDev/main/";
  const GITHUB = "https://api.github.com/users/4citeB4U/repos?per_page=100&sort=updated&page=";
  const BRAIN_URL = "https://rapidwebdevelop.com/";
  const MAX_QUESTION = 600;
  function allowedUrl(value) {
    if (!value || typeof value !== "string") return "";
    try {
      const url = new URL(value, RAPID);
      return url.protocol === "https:" && (
        url.hostname === "rapidwebdevelop.com" ||
        url.hostname === "github.com" ||
        url.hostname === "4citeb4u.github.io"
      ) ? url.href : "";
    } catch { return ""; }
  }
  async function getJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  }
  const voice = {
    client: null,
    pending: null,
    active: false,
    epoch: 0,
    state: "NOT_CONNECTED",
    detail: "Voice output is provided by LeeWay Voice Fabric when connected. Browser speech is not substituted.",
    onState: null,
    update(state, detail) {
      this.state = state;
      this.detail = detail;
      if (typeof this.onState === "function") this.onState({ state, detail });
    },
    async connect() {
      if (this.client) return this.client;
      if (this.pending) return this.pending;
      this.update("CONNECTING", "Connecting directly to LeeWay Voice Fabric.");
      this.pending = (async () => {
        const mod = await import(VOICE_ORIGIN + "/src/voice-sdk.js");
        if (typeof mod.LeeWayVoiceClient !== "function") throw new Error("Voice Fabric SDK missing");
        const [profile] = await Promise.all([getJson(VOICE_PROFILE)]);
        if (profile.authority !== "4citeB4U/LeeWay-Voice-Fabric" ||
            typeof profile.voicePackageId !== "string" || !profile.voicePackageId) {
          throw new Error("Canonical Voice Fabric profile not verified");
        }
        const client = new mod.LeeWayVoiceClient({ origin: VOICE_ORIGIN, timeoutMs: 20000 });
        try {
          client.on("voice.fallback", event => {
            const actual = event && event.actual ? event.actual : "unknown provider";
            this.update("FALLBACK", "Voice Fabric reports a labeled fallback: " + actual);
          });
          client.on("voice.error", event => this.update("ERROR", "Voice Fabric: " + (event?.message || "speech error")));
          await client.connect();
          await client.selectVoice(profile.voicePackageId);
          this.client = client;
          this.update("CONNECTED", "Connected to LeeWay Voice Fabric; selected profile " + profile.voicePackageId +
            ". Audio has not yet been confirmed.");
          return client;
        } catch (error) { client.destroy(); throw error; }
      })();
      try { return await this.pending; }
      catch (error) {
        this.update("UNAVAILABLE", "LeeWay Voice Fabric unavailable (" + String(error.message).slice(0,150) +
          "). Text responses remain available; no other voice is substituted.");
        throw error;
      } finally { this.pending = null; }
    },
    async speak(text, onFinished) {
      const epoch = ++this.epoch;
      if (!text || typeof text !== "string") return false;
      try {
        const client = await this.connect();
        if (epoch !== this.epoch) return false;
        if (this.active) await client.stop();
        if (epoch !== this.epoch) return false;
        this.active = true;
        this.update("SPEAKING_REQUESTED", "Speech requested from LeeWay Voice Fabric.");
        const result = await client.speak(text.slice(0, 3500));
        if (epoch !== this.epoch) return false;
        this.active = false;
        this.update("SYNTHESIS_COMPLETED", "Voice Fabric returned speech completion. Provider: " +
          String(result?.provider || "unreported") + "; selected voice: " +
          String(result?.selectedVoiceId || "unreported") + ". Listener audibility is not independently verified.");
        if (typeof onFinished === "function") onFinished();
        return true;
      } catch (error) {
        if (epoch !== this.epoch) return false;
        this.active = false;
        this.update("UNAVAILABLE", "Voice Fabric speech failed: " + String(error.message).slice(0,150) +
          ". Text is still available; no browser voice substituted.");
        return false;
      }
    },
    stop() {
      this.epoch += 1;
      this.active = false;
      if (this.client) this.client.stop().catch(() => {});
      this.update(this.client ? "STOP_REQUESTED" : "NOT_CONNECTED",
        "Speech stop requested through LeeWay Voice Fabric; reasoning and text remain available.");
    }
  };

  let catalog = [];
  let loaded = false;
  let promise = null;
  let knowledgeState = "NOT_LOADED";
  let knowledgeSource = [];
  function normalize(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
  function display(s) { return String(s || "").replace(/[-_]+/g, " ").trim(); }
  function addProject(byUrl, record) {
    if (!record || record.is_private || record.private || record.visibility === "PRIVATE") return;
    const url = allowedUrl(record.repo || record.html_url || record.repository_url);
    if (!url || !url.startsWith("https://github.com/4citeB4U/")) return;
    const key = record.id && String(record.id).startsWith("proj::")
      ? "curated:" + String(record.id)
      : url.toLowerCase().replace(/\/$/, "");
    const item = {
      name: String(record.label || record.name || "").slice(0, 140),
      description: String(record.desc || record.description || "").slice(0, 1200),
      category: String(record.group || record.family || "").slice(0, 100),
      url,
      site: allowedUrl(record.url || record.live_url || record.homepage || record.pages_url || ""),
      evidence: String(record.evidence || "").slice(0, 30),
      updatedAt: String(record.updated_at || "")
    };
    if (!item.name) return;
    const existing = byUrl.get(key);
    if (existing) {
      // Curated Digital Brain descriptions outrank generic GitHub metadata.
      if (record.label) existing.name = item.name;
      if (record.desc) existing.description = item.description;
      if (record.group) existing.category = item.category;
      if (item.site && !existing.site) existing.site = item.site;
      if (item.evidence && !existing.evidence) existing.evidence = item.evidence;
      if (item.updatedAt && !existing.updatedAt) existing.updatedAt = item.updatedAt;
    } else byUrl.set(key, item);
  }
  async function curatedProjects() {
    // Parse the Digital Brain's actual published JSON literal; never eval or execute remote JavaScript.
    const result = await fetch(RAW + "brain/public-project-adapter.js", { cache: "no-store" });
    if (!result.ok) throw new Error("Digital Brain curated catalog HTTP " + result.status);
    const source = await result.text();
    const prefix = "const CURATED_PROJECTS=";
    const suffix = ";\nconst GITHUB_PROJECTS=";
    const start = source.indexOf(prefix);
    const end = source.indexOf(suffix, start);
    if (start < 0 || end < 0) throw new Error("Digital Brain curated catalog format changed");
    const projects = JSON.parse(source.slice(start + prefix.length, end));
    if (!Array.isArray(projects) || projects.length < 1) throw new Error("Digital Brain curated catalog invalid");
    return projects;
  }
  const knowledge = {
    get state() { return knowledgeState; },
    get count() { return catalog.length; },
    get sources() { return knowledgeSource.slice(); },
    load() {
      if (promise) return promise;
      knowledgeState = "LOADING";
      promise = (async () => {
        const byUrl = new Map();
        const results = await Promise.allSettled([
          curatedProjects(),
          getJson(RAW + "brain/generated-projects.json"),
          getJson(RAW + "brain/github-project-catalog.json"),
          // The live Digital Brain also augments its universe from public GitHub repos.
          ...[1, 2].map(page => getJson(GITHUB + page))
        ]);
        const [curated, generated, legacy, ...live] = results;
        if (generated.status === "fulfilled" &&
            generated.value.schema === "leeway-public-project-manifest-v1" &&
            generated.value.owner === "4citeB4U" && Array.isArray(generated.value.repositories)) {
          generated.value.repositories.forEach(item => addProject(byUrl, item));
          knowledgeSource.push("RapidWebDev/brain/generated-projects.json");
        }
        if (legacy.status === "fulfilled" && Array.isArray(legacy.value.projects)) {
          legacy.value.projects.filter(item => !item.is_private && item.visibility === "PUBLIC")
            .forEach(item => addProject(byUrl, item));
          knowledgeSource.push("RapidWebDev/brain/github-project-catalog.json (public only)");
        }
        live.forEach((result, index) => {
          if (result.status === "fulfilled" && Array.isArray(result.value)) {
            result.value.forEach(item => addProject(byUrl, item));
            knowledgeSource.push("GitHub public repositories page " + (index + 1));
          }
        });
        if (curated.status === "fulfilled") {
          curated.value.forEach(item => addProject(byUrl, item));
          knowledgeSource.push("RapidWebDev/brain/public-project-adapter.js (curated)");
        }
        catalog = [...byUrl.values()];
        loaded = catalog.length > 0;
        knowledgeState = loaded ? "CATALOG_CONNECTED" : "UNAVAILABLE";
        return { state: knowledgeState, count: catalog.length, sources: knowledgeSource.slice() };
      })().catch(error => {
        knowledgeState = "UNAVAILABLE";
        return { state: "UNAVAILABLE", error: error.message, count: 0 };
      });
      return promise;
    },
    answer(question) {
      const q = normalize(String(question || "").slice(0, MAX_QUESTION));
      if (!q || !loaded) return null;
      if (/^(how many|number of|total) (public )?(projects|repositories|repos)/.test(q))
        return { text: "I currently have " + catalog.length +
          " public project entries from RapidWebDevelop's Digital Brain and GitHub sources. " +
          "This count reflects loaded catalog entries, not verified live deployments.", url: BRAIN_URL };
      if (/^(list|show|name|what are|tell me about) (the |your |all |lee s |leonard s )?(projects|portfolio|repositories|repos)/.test(q)) {
        const sample = catalog.slice(0, 12).map(p => p.name).join("; ");
        return { text: "Digital Brain currently exposes " + catalog.length +
          " public project records. Examples: " + sample +
          ". Explore the Digital Brain to browse the full universe and project evidence.", url: BRAIN_URL };
      }
      const stop = new Set(["what","is","are","the","a","an","about","can","you","tell","me","please","how","does","do","of","for","on","and","in","with","where","show","all","projects","project","leeway","lee","who","this"]);
      const tokens = q.split(" ").filter(w => w.length > 2 && !stop.has(w));
      if (!tokens.length) return null;
      const scored = catalog.map(item => {
        const n = normalize(item.name), d = normalize(item.description), c = normalize(item.category);
        const titleWords = n.split(" ");
        let score = tokens.reduce((sum,t) => sum + (titleWords.includes(t) ? 7 : n.includes(t) ? 4 : 0) +
          (c.split(" ").includes(t) ? 2 : 0) + (d.split(" ").includes(t) ? 1 : 0), 0);
        if (n && q.includes(n)) score += 20;
        return { item, score };
      }).filter(x => x.score >= (tokens.length > 1 ? 6 : 4)).sort((a,b) => b.score - a.score);
      if (!scored.length) return null;
      const top = scored[0].item;
      if (scored.length > 1 && scored[0].score === scored[1].score &&
          tokens.every(t => !normalize(top.name).includes(t))) {
        return { text: "I found several related public projects: " +
          scored.slice(0, 5).map(x => x.item.name).join("; ") +
          ". Which project would you like me to explain?", url: BRAIN_URL };
      }
      const status = top.evidence ? "Digital Brain label: " + top.evidence + ". " : "";
      const category = top.category ? "Category: " + top.category + ". " : "";
      const intro = top.description || "The public project catalog has no detailed description for this repository.";
      return { text: top.name + ". " + intro + " " + category + status +
        "This is published project information, not proof of current deployment or execution.",
        url: top.site || top.url };
    }
  };
  root.LeeWayResumeVoice = voice;
  root.LeeWayResumeKnowledge = knowledge;
})(window);
