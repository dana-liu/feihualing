// 音频播放工具
// 需要在 data 目录下放置 correct.mp3 和 wrong.mp3 音频文件

const audioCorrect = wx.createInnerAudioContext();
const audioWrong = wx.createInnerAudioContext();

// 设置音频源（需要用户添加实际的音频文件）
// audioCorrect.src = '/data/correct.mp3';
// audioWrong.src = '/data/wrong.mp3';

function playCorrect() {
  if (audioCorrect.src) {
    audioCorrect.play();
  } else {
    // 如果没有音频文件，则使用振动作为反馈
    wx.vibrateShort && wx.vibrateShort({ type: 'light' });
  }
}

function playWrong() {
  if (audioWrong.src) {
    audioWrong.play();
  } else {
    wx.vibrateShort && wx.vibrateShort({ type: 'heavy' });
  }
}

module.exports = {
  playCorrect,
  playWrong,
  audioCorrect,
  audioWrong
};
