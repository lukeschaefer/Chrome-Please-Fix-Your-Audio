
let audioContext : AudioContext;
let clickTrackEnabled = false;
let clickTrackSetup = false;


window.addEventListener('load', () => {
  const sampleButton = document.getElementById('sampleButton');
  sampleButton.onclick = () => recordSample();

  const clickTrackButton = document.getElementById('toggleButton');
  clickTrackButton.onclick = () => toggleClick();
})


async function recordSample() {
  // THESE CONSTRAINTS SHOULD FIX THE ISSUE BUT DO NOT:
  const constraints = {
    audio: true,
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
  };

  // Very barebones recording setup:
  let chunks : Blob[] = [];

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const mediaRecorder = new MediaRecorder(stream);

  const sampleButton = document.getElementById('sampleButton');
  sampleButton.innerText = "🔴 FINISH 🔴"
  sampleButton.onclick = () => mediaRecorder.stop()

  mediaRecorder.start();

  mediaRecorder.ondataavailable = (e) => {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = (e) => {
    console.log("done");
    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    chunks = [];
    const audioURL = window.URL.createObjectURL(blob);
    const audioElement = new Audio(audioURL);
    audioElement.controls = true;
    sampleButton.innerText = "RECORD ANOTHER"
    sampleButton.onclick = () => recordSample()

    document.getElementById('samples').appendChild(audioElement);
    if(clickTrackEnabled) toggleClick();
  }
}


function toggleClick() {
  clickTrackEnabled = !clickTrackEnabled;
  if(!clickTrackSetup) setupClickTrack();
  document.getElementById('toggleButton').classList.toggle("active");
}

// This is to create a pleasant sounding four-beats-per-measure click track.
// This exact setup is not required for the test case - you can also reproduce by playing
// a YouTube video in another tab.
function setupClickTrack() {
  
  const audioContext = getAudioContext();

  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 880;
  oscillator.start();
  const gain = audioContext.createGain();
  gain.gain.value = 0;
  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  let beepNumber = 0;

  const beep = () => {
    if(!clickTrackEnabled) return;
    setTimeout(beep, 500)

    const now = audioContext.currentTime;

    oscillator.frequency.value = beepNumber++%4 == 0 ? 880 : 440;

    gain.gain.value = 0
    gain.gain.linearRampToValueAtTime(.4, now + .02);
    gain.gain.linearRampToValueAtTime(0, now + .3);
  }
  beep();
 }
    
 function getAudioContext() {
  if(!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
}
