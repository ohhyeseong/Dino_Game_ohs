import { sendEvent, gameAssetsData } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.currentStage = 1000; // 스테이지 아이디
    this.scorePerSecond = 2; // 스코어 증가량
    this.score = 0; // 현재 점수
    this.stages = 0; // 현재 스테이지
    this.nextStagesScore = 100; // 다음 스테이지 필요 점수
  }

  update(deltaTime) {
    this.score += deltaTime * 0.001 * this.scorePerSecond; // 기존 score 상승에 현재 스테이지 스코어 상승량 곱해주기
    if (Math.floor(this.score) >= this.nextStagesScore && this.stageChange) {
      // 현재 스코어에서 다음 스테이지 요구 조건 달성시 다음 스테이지로 이동
      this.stageChange = false; // 여러번 바뀌면 안되니깐 스테이지가 한번만 바뀌게 하기위해 불리언 false
      this.stages += 1; // 스테이지 증가 -> 여기에 따라 다음 스테이지 수치를 찾아서 변경
      this.scorePerSecond = gameAssetsData.stages.data[this.stages].scorePerSecond; // 스코어 상승량 바뀐 스테이지에 맞춰 변경
      this.nextStagesScore = gameAssetsData.stages.data[this.stages + 1].score; // 다음 스테이지의 스코어
      const targetStage = this.currentStage + 1; // targetStage 정의 ( 다음 스테이지로 넘어가기 위한 함수? 라 생각하면 편함 )
      sendEvent(11, {
        // 현재 스테이지, 다음 스테이지로 이동한다는 이벤트를 서버로 전송
        currentStage: this.currentStage,
        targetStage: targetStage,
      });
      // 서버에서 검증이 완료되면
      this.currentStage += 1; // 증가한 스테이지로 currentStage증가한다.
      this.stageChange = true;
    }
  }

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    //    이름     = 게임 에셋 데이타의 아이템파일 의 데이터의 찾아라 ? 아이템아이디랑 충동될때 사용되는 똑같은 아이템아이디를
    const itemData = gameAssetsData.items.data.find((items) => items.id === itemId);
    sendEvent(12, {
      itemId: itemId,
      currentStage: this.currentStage,
    });
    // 아이템 데이터는 파인드를 사용해서 배열안에 있는 객체의 아이디 값과 같은거를 객체로 뽑아서 반환한다. .score를 하면 해당 객체 값이 나온다..
    this.score += itemData.score;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    //스테이지 표시 (왼쪽)
    const stageX = 25 * this.scaleRatio;
    this.ctx.fillText(`STAGE ${this.currentStage - 999}`, stageX, y); // 1000을 Stage 1로 표시하기 위해 999를 뺌

    // 기존 점수 표시 ( 오른쪽 )
    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
