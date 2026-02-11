export const IntroView = (summary, investigation) => `
    <div class="view intro-view">
        <h2>사건 개요</h2>
        <div class="action-area">

        </div>
        <div class="summary-container">
            <p class="summary-text">${summary}</p>
        </div>

        <div class="investigation-area">
            <div class="report-box">
                <h3 class="report-title">🕵️ 현장 수사 기록</h3>
                ${investigation}
            </div>
        </div>


        <div class="action-area">
            <ul>
                <li class="guide-text">거짓말은 할 수 없습니다. </li>
                <li class="guide-text">하지만 제공 된 정보를 말하지 않는 것은 가능합니다.</li>
                <li class="guide-text">누군가가 질문 했을 때, 잘 모르겠다고 말하는 것은 가능합니다.</li>
            </ul>
        </div>
        <div class="font-red">* 내용을 모두 숙지하셨다면 다음으로 진행하세요.</div>
    </div>
    <br>
        `;
            // <button class="primary-btn" onclick="onNavigate('SELECT')">용의자 선택하기</button>
            