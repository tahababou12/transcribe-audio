// Properly declare the Speech Recognition API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function setupTranscriptionApp() {
  // DOM Elements
  const startButton = document.getElementById('startButton') as HTMLButtonElement;
  const stopButton = document.getElementById('stopButton') as HTMLButtonElement;
  const copyButton = document.getElementById('copyButton') as HTMLButtonElement;
  const clearButton = document.getElementById('clearButton') as HTMLButtonElement;
  const transcriptionElement = document.getElementById('transcription') as HTMLDivElement;
  const statusElement = document.getElementById('status') as HTMLDivElement;
  const recordingIndicator = document.getElementById('recording-indicator') as HTMLDivElement;

  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    statusElement.textContent = 'Speech recognition is not supported in this browser. Try Chrome.';
    startButton.disabled = true;
    return;
  }

  // Initialize speech recognition
  const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let finalTranscript = '';
  let isRecording = false;

  // Event listeners
  startButton.addEventListener('click', startRecording);
  stopButton.addEventListener('click', stopRecording);
  copyButton.addEventListener('click', copyTranscription);
  clearButton.addEventListener('click', clearTranscription);

  // Speech recognition events
  recognition.onstart = () => {
    isRecording = true;
    updateUI();
    statusElement.textContent = 'Listening...';
    recordingIndicator.classList.remove('hidden');
  };

  recognition.onend = () => {
    isRecording = false;
    updateUI();
    statusElement.textContent = 'Stopped listening';
    recordingIndicator.classList.add('hidden');
  };

  recognition.onerror = (event: any) => {
    console.error('Speech recognition error', event.error);
    statusElement.textContent = `Error: ${event.error}`;
    isRecording = false;
    updateUI();
    recordingIndicator.classList.add('hidden');
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    transcriptionElement.innerHTML = 
      `<span class="final">${finalTranscript}</span>` + 
      `<span class="interim">${interimTranscript}</span>`;
    
    // Auto-scroll to bottom
    transcriptionElement.scrollTop = transcriptionElement.scrollHeight;
  };

  // Functions
  function startRecording() {
    finalTranscript = transcriptionElement.textContent || '';
    try {
      recognition.start();
      statusElement.textContent = 'Starting...';
    } catch (error) {
      console.error('Error starting recognition:', error);
      statusElement.textContent = 'Error starting recognition. Try again.';
    }
  }

  function stopRecording() {
    recognition.stop();
    statusElement.textContent = 'Stopped';
  }

  function copyTranscription() {
    const text = transcriptionElement.textContent || '';
    navigator.clipboard.writeText(text)
      .then(() => {
        statusElement.textContent = 'Copied to clipboard!';
        setTimeout(() => {
          if (!isRecording) {
            statusElement.textContent = 'Ready to transcribe';
          }
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        statusElement.textContent = 'Failed to copy text';
      });
  }

  function clearTranscription() {
    finalTranscript = '';
    transcriptionElement.innerHTML = '';
    statusElement.textContent = 'Cleared';
    setTimeout(() => {
      if (!isRecording) {
        statusElement.textContent = 'Ready to transcribe';
      }
    }, 1000);
  }

  function updateUI() {
    startButton.disabled = isRecording;
    stopButton.disabled = !isRecording;
  }
}

// This export ensures the global declarations are treated as a module
export {};
