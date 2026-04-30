// 音频播放工具
// 请在 data 目录下放置 correct.mp3（正确音效）和 wrong.mp3（错误音效）文件
// 或者修改下方路径指向你的音频文件

const audioCorrect = wx.createInnerAudioContext();
const audioWrong = wx.createInnerAudioContext();

// 设置音频源（请确保 utils/audio.js 同目录下有 audio 文件夹存放音频）
audioCorrect.src = '/utils/audio/correct.mp3';
audioWrong.src = '/utils/audio/wrong.mp3';

function playCorrect() {
  audioCorrect.play();
  audioCorrect.onEnded(() => {
    // 播放结束
  });
}

function playWrong() {
  audioWrong.play();
  audioWrong.onEnded(() => {
    // 播放结束
  });
}

module.exports = {
  playCorrect,
  playWrong
};
