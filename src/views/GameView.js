export const GameView = ({ title, content, story1, story2, story3, story4, img, buttonText, nextStep, isLastMemory = false }) => {
    return `
        <div class="view">
            <h2>${title}</h2>
            ${img ? `<img src="${img}" class="clue-img">` : ''}
            <div class="content-box">
                <p>${content}</p>
                <br>
                ${story1 ? `<p>${story1}</p>` : ''}
                <br>
                ${story2 ? `<p>${story2}</p>` : ''}
                <br>
                ${story3 ? `<p>${story3}</p>` : ''}
                <br>
                ${story4 ? `<p>${story4}</p>` : ''}
            </div>

            ${isLastMemory ? `
                <div class="last-choice-container">
                    <div class="input-group">
                        <input type="text" id="clueInput" placeholder="결정적 단서를 찾았나요?">
                        <button class="clue-btn" onclick="checkClue()">단서 확인</button>
                    </div>
                    <div class="divider">OR</div>
                    <button class="fail-btn" onclick="onNavigate('VOTE')">최종 단서 발견 못함 (범인 선택으로)</button>
                </div>
            ` : `
                <button class="primary-btn" onclick="onNavigate('${nextStep}')">${buttonText}</button>
            `}
        </div>
    `;
};