"use strict";$(function(){function e(e){var o=a.createMediaStreamSource(e);o.connect(a.destination)}function o(e){var o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=function(){a.decodeAudioData(o.response,function(e){r=e})},o.send()}function n(e){c=a.createBufferSource(),c.buffer=r,c.connect(a.destination),c.start(0)}function t(){alert("stream generation failed.")}document.write("hello!");var a=new window.AudioContext,r,c,i=!1,u="audio/piano_sample.ogg";o(u),navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia,navigator.getUserMedia({audio:!0},e,t),$(document).keypress(function(e){console.log(e.charCode),32==e.charCode&&i===!1?(i=!0,console.log(i),n()):32==e.charCode&&i===!0?(i=!1,console.log(i),c.stop()):18==e.charCode&&sample.togglePlayback()});var s=4096,f=function(){var e=a.createScriptProcessor(s,1,1),o,n,t,r,c,i,u,f;return o=n=t=r=c=i=u=f=0,e.cutoff=.065,e.resonance=3.99,e.onaudioprocess=function(a){for(var d=a.inputBuffer.getChannelData(0),g=a.outputBuffer.getChannelData(0),l=1.16*e.cutoff,p=e.resonance*(1-.15*l*l),v=0;s>v;v++)d[v]-=f*p,d[v]*=.35013*l*l*l*l,c=d[v]+.3*o+(1-l)*c,o=d[v],i=c+.3*n+(1-l)*i,n=c,u=i+.3*t+(1-l)*u,t=i,f=u+.3*r+(1-l)*f,r=u,g[v]=f},e}()});