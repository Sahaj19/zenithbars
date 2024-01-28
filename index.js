const input = document.querySelector("input");
const audio = document.querySelector("audio");
const canvas = document.querySelector("canvas");

//canvas context and dimensions
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Event listener for file input change
input.addEventListener("change", () => {
  const file = input.files[0];
  if (!file) return;

  // Load and play the selected audio file
  audio.src = URL.createObjectURL(file);
  audio.play();

  // Setting up audio context for audio processing
  const audioContext = new AudioContext();
  const audioSource = audioContext.createMediaElementSource(audio);
  const analyzer = audioContext.createAnalyser();

  // Connecting audio source to analyzer and destination
  audioSource.connect(analyzer);
  analyzer.connect(audioContext.destination);

  // Configuring analyzer parameters
  analyzer.fftSize = 512;
  const bufferDataLength = analyzer.frequencyBinCount;
  const bufferDataArray = new Uint8Array(bufferDataLength);
  const barWidth = canvas.width / bufferDataLength;
  let x = 0;

  // Function to draw audio visualization on canvas
  function zenithBar() {
    x = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    analyzer.getByteFrequencyData(bufferDataArray);

    bufferDataArray.forEach((frequency) => {
      const barHeight = frequency;

      // Drawing sound bars
      context.fillStyle = "red";
      context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x = x + barWidth;
    });

    // Continue drawing if audio is not paused
    if (!audio.paused) {
      animationFrameId = requestAnimationFrame(zenithBar);
    }
  }

  // Initial call
  zenithBar();
});

// Event listener to clear canvas when audio ends
audio.addEventListener("ended", () => {
  cancelAnimationFrame(animationFrameId);
  context.clearRect(0, 0, canvas.width, canvas.height);
});

/* 
Audio Processing major steps:-
1. create audio context
2. create audio source
3. create audio effects(i.e audio analyzer)
4. create audio destination
*/

/*
Audio processing involves creating
an audio context, source, effects 
(like analyzer), and destination.
*/

/*
Sampling converts sound waves 
into digital data. Sampling rate 
measures the frequency of data 
points recorded digitally.
*/
