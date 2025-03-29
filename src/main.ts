import './style.css'
import { setupTranscriptionApp } from './transcription'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>Real-time Audio Transcription</h1>
    
    <div class="controls">
      <button id="startButton" class="button primary">Start Recording</button>
      <button id="stopButton" class="button secondary" disabled>Stop Recording</button>
      <button id="copyButton" class="button">Copy Text</button>
      <button id="clearButton" class="button">Clear</button>
    </div>
    
    <div class="status-container">
      <div id="status" class="status">Ready to transcribe</div>
      <div id="recording-indicator" class="recording-indicator hidden"></div>
    </div>
    
    <div class="transcription-container">
      <h2>Transcription</h2>
      <div id="transcription" class="transcription-text" contenteditable="true"></div>
    </div>
    
    <div class="info">
      <p>Click "Start Recording" and speak into your microphone. Your speech will be transcribed in real-time.</p>
      <p>Note: This tool requires microphone access and works best in Chrome.</p>
    </div>
  </div>
`

setupTranscriptionApp()
