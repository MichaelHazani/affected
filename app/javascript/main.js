'use strict';


$(function(){

var audioCtx = new window.AudioContext();
var soundBuffer, musicSource;
//var conUrl ='http://thingsinjars.com/lab/web-audio-tutorial/hello.mp3';
var playing = false;
var liveSoundPlaying = false;
var musicUrl = "audio/piano_sample.ogg";
var conUrl = "audio/IR/EMT 28 Echo Plate.wav";
var convolver, gainNode, audioInput;
var startOffset = 0;

// function getStream(stream) {
//   var mediaStreamSource = audioCtx.createMediaStreamSource(stream);
//   mediaStreamSource.connect(audioCtx.destination);
// }

// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
// navigator.getUserMedia({audio: true}, getStream, error);

// function error() {
//   alert('stream generation failed.');
// }

function startSound() {
  var request = new XMLHttpRequest();
  request.open('GET', musicUrl, true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;

    audioGraph(audioData);
    };
    request.send();

  }

function audioGraph(audioData) {
  var convolver;

  musicSource = audioCtx.createBufferSource();
  musicSource.loop = true;

  audioCtx.decodeAudioData(audioData, function(soundBuffer){
    musicSource.buffer = soundBuffer;

    convolver = audioCtx.createConvolver();
    gainNode = audioCtx.createGain();

    //WIRING

    musicSource.connect(convolver);
    convolver.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    //load convolution response

    setReverbImpulseResponse(conUrl, convolver, playSound);

    });

  }

function liveSound() {
navigator.getUserMedia  = navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia;

navigator.getUserMedia({audio: true, video: false},
  function(stream){
    audioInput = audioCtx.createMediaStreamSource(stream);
    var convolver2 = audioCtx.createConvolver();
    audioInput.connect(convolver2)
    convolver2.connect(audioCtx.destination);
    setReverbImpulseResponse(conUrl, convolver2);
  },

  function(error){
    alert('Error capturing audio.');
  });


};

function playSound() {

  musicSource.start(0, startOffset);


}
function stopSound() {

  musicSource.stop();
  startOffset += audioCtx.currentTime;
  }



$(document).keypress(function(e) {

console.log(e.charCode);
  if (e.charCode == 32 && !playing) {
    playing = true;
    console.log(playing);
    startSound();
  }
  else if (e.charCode == 32 && playing){
    playing = false;
    console.log(playing);
    stopSound();
  }

  else if (e.charCode == 61){
    gainNode.gain.value += 0.1;
    console.log(e.charCode);
  }

  else if (e.charCode == 45){
    gainNode.gain.value-= 0.1;

  }
  else if (e.charCode == 13 && !liveSoundPlaying){
    liveSoundPlaying = true;
    liveSound();
  }

  else if (e.charCode == 13 && liveSoundPlaying){
    liveSoundPlaying = false;
    audioInput.disconnect();
  }


});


function setReverbImpulseResponse(conFile, convolver, callback) {

  var request = new XMLHttpRequest();
  request.open('GET', conFile, true);
  request.responseType = "arraybuffer";

  request.onload = function(){
    audioCtx.decodeAudioData(request.response, function(convolverBuffer) {
      convolver.buffer = convolverBuffer;

      callback();

    });

  };
  request.send();
}


//reverb switch logic

$('#subIR').submit(function(e){
  e.preventDefault();
  conUrl = 'audio/IR/' +
  $('select[name="IRs"] option:selected').val();
  //setReverbImpulseResponse(chosen, convolver, playSound);
  console.log(conUrl);
  $("select[name='IRs']").blur();

  //restart liveInput with new IR
  audioInput.disconnect();
  liveSound();


});


});

