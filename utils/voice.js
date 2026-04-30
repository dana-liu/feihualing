function startVoiceRecognition(callback) {
  const recorderManager = wx.getRecorderManager();

  recorderManager.onStart(() => {
    console.log('录音开始');
  });

  recorderManager.onStop((res) => {
    console.log('录音结束', res.tempFilePath);
    // 调用微信语音识别
    wx.uploadFile({
      url: 'https://api.weixin.qq.com/wxa/media/voice',
      filePath: res.tempFilePath,
      name: 'voice',
      success: (result) => {
        const data = JSON.parse(result.data);
        if (data.errcode === 0 && data.voice_id) {
          // 转换为文字
          callback({ success: true, text: '' });
        }
      },
      fail: (err) => {
        callback({ success: false, error: err });
      }
    });
  });

  recorderManager.onError((err) => {
    console.error('录音错误', err);
    callback({ success: false, error: err });
  });

  recorderManager.start({
    format: 'mp3',
    duration: 60000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 48000
  });

  return recorderManager;
}

function stopVoiceRecognition(recorderManager) {
  recorderManager && recorderManager.stop();
}

module.exports = {
  startVoiceRecognition,
  stopVoiceRecognition
};
