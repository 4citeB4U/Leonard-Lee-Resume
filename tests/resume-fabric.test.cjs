/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY_PROJECTION / TESTS
TAG: LEEWAY-RESUME-BRAIN-VOICE-GATE-20261021
WHO: Leonard Jerome Lee (Creator); AI assistant (test author)
WHAT: Deterministic source tests for role-specific print resumes, Voice Fabric and Digital Brain adapter.
WHEN: 2026-10-21
WHERE: tests/resume-fabric.test.cjs
WHY: Catch regressions without claiming unavailable production playback or backend health.
HOW: Node test runner, VM sandbox with mocked public remote data, read-only source inspection.
AUTHORIZED ROLE: Creator-requested website source verification only.
LICENSE: All rights reserved; no additional license assertion.
*/
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const root = path.join(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");

test("original technical resume stays the only landing page presentation", () => {
  const index = read("index.html");
  assert.match(index, /class="hero lift-frame"/);
  assert.match(index, /class="print-resume leeway-print-file"/);
  assert.doesNotMatch(index, /resume-track-selector/);
  assert.doesNotMatch(index, /resume-management\.html/);
  assert.doesNotMatch(index, /resume-general\.html/);
  assert.ok(index.indexOf('src="resume-fabric-adapters.js"') < index.indexOf('src="agent-lee.js"'));
});

test("alternative resumes remain printable backups with corrected contact", () => {
  const css = read("career-resumes.css");
  assert.match(css, /@media print/);
  for (const page of ["resume-management.html", "resume-general.html"]) {
    const content = read(page);
    assert.match(content, /414-303-8580/);
    assert.match(content, /LeonardLee6@outlook\.com/);
    assert.match(content, /window\.print\(\)/);
    assert.match(content, /LEEWAY HEADER — DO NOT REMOVE/);
  }
});

test("avatar delegates speech to canonical Voice Fabric; no independent browser TTS", () => {
  const agent = read("agent-lee.js");
  const adapter = read("resume-fabric-adapters.js");
  assert.match(agent, /window\.LeeWayResumeVoice/);
  assert.match(adapter, /LeeWayVoiceClient/);
  assert.match(adapter, /https:\/\/4citeb4u\.github\.io\/LeeWay-Voice-Fabric/);
  assert.match(adapter, /\/src\/voice-sdk\.js/);
  assert.match(adapter, /agent-lee-active-voice\.v1\.json/);
  assert.doesNotMatch(agent, /SpeechSynthesisUtterance|speechSynthesis\.(speak|cancel)/);
  assert.match(agent, /agent-lee-voice-source/);
});

test("Digital Brain source adapter filters private projects and answers verified descriptions", async () => {
  const source = read("resume-fabric-adapters.js");
  const curated = [
    { id:"proj::gpu", label:"LeeWay Edge GPU", desc:"GPU and compute research", group:"Compute",
      repo:"https://github.com/4citeB4U/LeeWay-Edge-GPU", evidence:"SOURCE" },
    { id:"proj::gpu-view", label:"GPU Public Demo", desc:"A distinct curated exhibit of compute output",
      repo:"https://github.com/4citeB4U/LeeWay-Edge-GPU", evidence:"LIVE" }
  ];
  const fixtures = [
    { url: "brain/public-project-adapter.js",
      value: "const CURATED_PROJECTS=" + JSON.stringify(curated) + ";\nconst GITHUB_PROJECTS=[];" },
    { url:"brain/generated-projects.json",
      value:{ schema:"leeway-public-project-manifest-v1", owner:"4citeB4U",
        repositories:[{name:"LeeWay-Edge-GPU",html_url:"https://github.com/4citeB4U/LeeWay-Edge-GPU"},
        {name:"Private Thing",html_url:"https://github.com/4citeB4U/private",private:true}]} },
    {url:"brain/github-project-catalog.json",
      value:{projects:[{name:"Old Private", repository_url:"https://github.com/4citeB4U/secret", is_private:true, visibility:"PRIVATE"}]} },
    {url:"api.github.com/users",value:[]}
  ];
  const fetch = async url => {
    const match = fixtures.find(f => url.includes(f.url));
    if (!match) return {ok:false,status:404};
    return {ok:true,json:async()=>match.value,text:async()=>match.value};
  };
  const window = {};
  vm.runInNewContext(source, {window,fetch,URL,Set,Map,Promise,console});
  const result=await window.LeeWayResumeKnowledge.load();
  assert.equal(result.state,"CATALOG_CONNECTED");
  assert.equal(result.count,3);
  const q=window.LeeWayResumeKnowledge.answer("What is LeeWay Edge GPU?");
  assert.match(q.text,/GPU and compute research/);
  assert.match(q.url,/github.com\/4citeB4U\/LeeWay-Edge-GPU/);
  assert.equal(window.LeeWayResumeKnowledge.answer("Tell me about an unrelated private thing"),null);
});

test("Voice Fabric reports failure without substituting browser voice", async () => {
  const source=read("resume-fabric-adapters.js");
  const win={};
  const fetch=async()=>({ok:false,status:503});
  vm.runInNewContext(source,{window:win,fetch,URL,Set,Map,Promise,console});
  const spoken=await win.LeeWayResumeVoice.speak("Test.");
  assert.equal(spoken,false);
  assert.equal(win.LeeWayResumeVoice.state,"UNAVAILABLE");
  assert.match(win.LeeWayResumeVoice.detail,/no browser voice substituted/i);
});

test("answers render as text, not untrusted HTML", () => {
  const agent=read("agent-lee.js");
  assert.match(agent,/document\.createTextNode\(String\(text\)\)/);
  assert.doesNotMatch(agent,/message\.innerHTML/);
});

test("recovered management and commercial driver history is represented without rewriting the technical resume", () => {
  const management = read("resume-management.html");
  const general = read("resume-general.html");
  for (const page of [management, general]) {
    for (const employer of ["Crothall Laundry", "Superior Health Linens",
      "Bay &amp; Bay", "Nicole&#39;s Healthcare Service"]) {
      // HTML ampersands may be rendered as entities by the generator.
      const plain = page.replace(/&amp;/g, "&").replace(/&#39;/g, "'");
      assert.ok(plain.includes(employer.replace(/&amp;/g, "&").replace(/&#39;/g, "'")), employer);
    }
    assert.match(page, /2019/);
    assert.match(page, /2024/);
    assert.match(page, /414-303-8580/);
    assert.doesNotMatch(page, /###-##|2912 North 23rd|2912 N 23rd|last 4 digits/i);
  }
  assert.match(management, /Senior Area Manager/);
  assert.match(management, /Night Supervisor for Drivers/);
  assert.match(management, /Osirus International/);
  assert.match(general, /Lupus Express/);
  assert.match(general, /Robert L\. Gast/);
  assert.match(general, /Metro Air Service/);
  assert.match(general, /Dana Transport/);
  assert.doesNotMatch(management, /Crothall Laundry Service<\/p>[\s\S]*?<h3>Night Shift Driver Supervisor/);
});
