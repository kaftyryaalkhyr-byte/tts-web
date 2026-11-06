const synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voiceSelect');
const textInput = document.getElementById('textInput');
const rateInput = document.getElementById('rate');
const pitchInput = document.getElementById('pitch');
const rateValue = document.getElementById('rateValue');
const pitchValue = document.getElementById('pitchValue');
const statusDiv = document.getElementById('status');

let voices = [];
let utterance = null;

function loadVoices() {
    voices = synth.getVoices();
    if (voices.length === 0) {
        statusDiv.textContent = 'جاري تحميل الأصوات...';
        return;
    }
    voiceSelect.innerHTML = '';
    voices.sort((a, b) => a.lang.localeCompare(b.lang));
    voices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — افتراضي' : ''}`;
        voiceSelect.appendChild(option);
    });
    statusDiv.textContent = `تم تحميل ${voices.length} صوتًا.`;
}

if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}
setTimeout(loadVoices, 100);

rateInput.addEventListener('input', () => { rateValue.textContent = rateInput.value; });
pitchInput.addEventListener('input', () => { pitchValue.textContent = pitchInput.value; });

function speak() {
    const text = textInput.value.trim();
    if (!text) {
        statusDiv.textContent = '⚠️ الرجاء كتابة نص أولاً.';
        return;
    }
    synth.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = parseFloat(rateInput.value);
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.lang = selectedVoice ? selectedVoice.lang : 'ar-SA';

    utterance.onstart = () => { statusDiv.textContent = '🔊 جاري التحدث...'; };
    utterance.onend = () => { statusDiv.textContent = '✅ انتهى التحدث.'; };
    utterance.onerror = (event) => { statusDiv.textContent = `❌ خطأ: ${event.error}`; };

    synth.speak(utterance);
}

document.getElementById('speakBtn').addEventListener('click', speak);
document.getElementById('pauseBtn').addEventListener('click', () => {
    if (synth.speaking) { synth.pause(); statusDiv.textContent = '⏸️ تم الإيقاف المؤقت.'; }
});
document.getElementById('resumeBtn').addEventListener('click', () => {
    if (synth.paused) { synth.resume(); statusDiv.textContent = '▶️ تم الاستئناف.'; }
});
document.getElementById('cancelBtn').addEventListener('click', () => {
    synth.cancel(); statusDiv.textContent = '⏹️ تم الإلغاء.';
});
