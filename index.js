const input = document.querySelector("input");
const audio = document.querySelector("audio");
const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

input.addEventListener("change", () => {
  const file = input.files[0];
  if (!file) return;

  audio.src = URL.createObjectURL(file);
  audio.play();

  //audio context processing graph or simple modular route
  const audioContext = new AudioContext();

  //audio source node
  const audioSource = audioContext.createMediaElementSource(audio);

  //audio analyzer node
  const analyzer = audioContext.createAnalyser();

  //connecting audioSource with our analyzer
  audioSource.connect(analyzer);

  //destination node : (it will redirect to our hardware speaker)
  analyzer.connect(audioContext.destination);

  //determines count of sound bars
  analyzer.fftSize = 512;

  //actual number of sound bars
  const bufferDataLength = analyzer.frequencyBinCount;

  //
  const bufferDataArray = new Uint8Array(bufferDataLength);

  //width of each zenith bar
  const barWidth = canvas.width / bufferDataLength;
  let x = 0;

  //zenith bar function
  function zenithBar() {
    x = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    analyzer.getByteFrequencyData(bufferDataArray);

    bufferDataArray.forEach((frequency) => {
      const barHeight = frequency;

      context.fillStyle = "red";
      context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x = x + barWidth;
    });

    if (!audio.ended) requestAnimationFrame(zenithBar);
  }

  zenithBar();
});

/*
Audio Processing major steps:-
1. create audio context
2. create audio source
3. create audio effects(i.e audio analyzer)
4. create audio destination
*/

/*
Sampling :-
1. Sampling turns sound waves into computer bits 
for storing and playing back audio on digital 
devices like computers and smartphones.

2. This is typically done by an analog-to-digital
converter (ADC), which takes continuous analog 
signals and converts them into digital data points.

3. Sampling generates data points from sound waves. 
More data points improve accuracy but also increase 
CPU load during processing.
*/

/*
Sampling rate :-
Sampling rate measures how many times per second 
the amplitude of a sound wave is measured and 
recorded digitally.
*/
