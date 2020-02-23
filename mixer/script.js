'use strict';

let peer = null;
let existingCall = null;

peer = new Peer({
    key: 'ef82b5ff-e40f-4a82-8b04-c0f6e61d902c',
    debug: 3
});

// タイミングによってつながらないことがあるため待ちを入れてみる
const d1 = new Date();
while (true) {
  const d2 = new Date();
  if (d2 - d1 > 1000) {
    break;
  }
}

peer.on('open', function(){
    const call = peer.joinRoom('web_mic', {mode: 'sfu', audioReceiveEnabled: true});
    setupCallEventHandlers(call);
});

peer.on('error', function(err){
    alert(err.message);
});

peer.on('close', function(){
});

peer.on('disconnected', function(){
});

function setupCallEventHandlers(call){
    if (existingCall) {
	existingCall.close();
    };

    existingCall = call;

    call.on('stream', function(stream){
	addAudio(call,stream);
    });

    call.on('peerLeave', function(peerId){
	removeAudio(peerId);
    });

    call.on('close', function(){
	removeAudio(call.remoteId);
    });
}

function addAudio(call,stream){
    filterHowling(stream);

    // 生のオーディオはミュート (フィルタを使わない場合はミュートしないこと)
    const audioDom = $('<audio autoplay muted>');
    //const audioDom = $('<audio autoplay>');
    audioDom.attr('id',call.remoteId);
    audioDom.get(0).srcObject = stream;
    $('.web_mic').append(audioDom);
}

function removeAudio(peerId){
    $('#'+peerId).remove();
}

function filterHowling(stream){
    const audioCtx = new AudioContext();
    const audioSourceNode = audioCtx.createMediaStreamSource(stream);

    // ハイシェルフフィルタ
    // 8192Hz以下を通して、それ以外は減衰
    const filter1 = audioCtx.createBiquadFilter();
    filter1.type='highshelf';
    filter1.frequency.value = 8192; // 周波数
    filter1.gain.value = -20;       // ゲイン(強さ)
   
    // ピーキングフィルタ
    // 0-500Hzを減衰       
    const filter2 = audioCtx.createBiquadFilter();
    filter2.type='peaking';
    filter2.frequency.value = 250;  // 周波数
    filter2.gain.value = -20;       // ゲイン(強さ)
    
    // バンドパスフィルタ
    // 0-500Hzを通す。それ以外は減衰
    const filter3 = audioCtx.createBiquadFilter();
    filter3.type='bandpass';
    filter3.frequency.value = 250; // 周波数(中央値)
    
    // フィルタの設定           
    audioSourceNode.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(filter3);
    filter3.connect(audioCtx.destination); 
}
