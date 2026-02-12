import { gameData } from '../data/gameData.js';
import { MainView } from './views/MainView.js';
import { SelectionView } from './views/SelectionView.js';
import { GameView } from './views/GameView.js';
import { IntroView } from './views/IntroView.js';

const app = document.getElementById('app');
const headerContainer = document.getElementById('header-container');

let state = {
    currentStep: 'MAIN',
    lastActiveStep: 'MAIN',
    selectedCharId: null,
    unlockedSteps: ['MAIN'],
    voteResult: null,
    playerCount: 6,
    excludedCharIds: [] // 제외된 캐릭터 ID들을 담는 배열
};

// --- 전역 제어 함수 ---

window.onNavigate = (step, isHistory = false) => {
    state.currentStep = step;
    if (!isHistory) {
        if (!state.unlockedSteps.includes(step)) state.unlockedSteps.push(step);
        state.lastActiveStep = step;
    }
    render();
};

window.goBackToFlow = () => {
    state.currentStep = state.lastActiveStep;
    render();
};

// 메인에서 인원 선택 후 시작
window.startGame = () => {
    const radioValue = document.querySelector('input[name="playerCount"]:checked').value;
    state.playerCount = parseInt(radioValue);
    
    // --- 여기서 인원별 제외 캐릭터 ID를 직접 수정하세요 ---
    if (state.playerCount === 4) {
        // 4인 플레이 시 제외할 캐릭터 ID 2개 (예: 학생, 의사)
        state.excludedCharIds = ['char_student', 'char_partner']; 
    } 
    else if (state.playerCount === 5) {
        // 5인 플레이 시 제외할 캐릭터 ID 1개 (예: 부자)
        state.excludedCharIds = ['char_partner']; 
    } 
    else {
        // 6인 플레이 시 제외 없음
        state.excludedCharIds = [];
    }
    // --------------------------------------------------

    // 인원 설정을 마쳤으므로 바로 개요(SUMMARY)로 이동
    window.onNavigate('SUMMARY');
};

// 개요에서 다음으로 이동 시 호출
window.proceedFromSummary = () => {
    // 코드로 이미 제외 ID를 정해뒀으므로, 
    // 번거로운 EXCLUDE_SETTING 단계를 건너뛰고 바로 선택 화면으로 갑니다.
    window.onNavigate('SELECT');
};


// 캐릭터 제외 클릭 시 호출
window.toggleExclude = (id) => {
    const maxExclude = 6 - state.playerCount;
    
    if (state.excludedCharIds.includes(id)) {
        state.excludedCharIds = state.excludedCharIds.filter(exId => exId !== id);
    } else {
        if (state.excludedCharIds.length < maxExclude) {
            state.excludedCharIds.push(id);
        } else {
            alert(`해당 모드에서는 최대 ${maxExclude}명까지만 제외할 수 있습니다.`);
        }
    }
    render();
};

window.finishExclusion = () => {
    const required = 6 - state.playerCount;
    if (state.excludedCharIds.length === required) {
        window.onNavigate('SELECT');
    } else {
        alert(`${required}명을 제외해야 합니다!`);
    }
};

window.selectChar = (id) => {
    state.selectedCharId = id;
    window.onNavigate('MY_STORY');
};

window.checkClue = () => {
    const val = document.getElementById('clueInput').value.trim();
    if (val === gameData.answerKey) {
        window.onNavigate('CLUE_SUCCESS');
    } else {
        alert("그것은 결정적인 단서가 아닌 것 같습니다.");
    }
};

window.finalVote = (targetId) => {
    if (confirm(`정말 ${gameData.characters[targetId].name}를 지목하시겠습니까?`)) {
        state.voteResult = targetId;
        window.onNavigate('ENDING');
    }
};

// --- 헤더 및 렌더링 ---

function renderHeader() {
    const labels = { 
        'MAIN': '홈', 'SUMMARY': '개요', 'SELECT': '용의자', 
        'MY_STORY': '내 시나리오', 
        'MEM_1': '기억1', 'MEM_2': '기억2', 'MEM_3': '기억3', 'MEM_4': '기억4',
        'TALK_4': '최종토론'
    };
    const isViewingHistory = state.currentStep !== state.lastActiveStep;
    headerContainer.innerHTML = `
        <nav class="header ${isViewingHistory ? 'history-mode' : ''}">
            <div class="nav-buttons">
                ${state.unlockedSteps.filter(s => labels[s]).map(s => `
                    <button class="${state.currentStep === s ? 'active' : ''}" onclick="onNavigate('${s}', true)">${labels[s]}</button>
                `).join('')}
            </div>
            ${isViewingHistory ? `<button class="back-btn highlight" onclick="goBackToFlow()">돌아가기</button>` : `<div class="status-badge">진행 중</div>`}
        </nav>`;
}

function render() {
    renderHeader();
    const char = state.selectedCharId ? gameData.characters[state.selectedCharId] : null;
    let html = '';

    // 제외된 캐릭터를 뺀 실제 플레이 캐릭터들
    const activeCharacters = Object.fromEntries(
        Object.entries(gameData.characters).filter(([id]) => !state.excludedCharIds.includes(id))
    );

    switch (state.currentStep) {
        case 'MAIN':
            html = `
                <div class="view main-view">
                    <h1>달빛 골목 고양이 사건</h1>
                    <p class="main-desc">사건의 진실을 파헤치고 범인을 검거하세요.</p>
                    <div class="main-setup">
                        <div class="radio-group">
                            <label><input type="radio" name="playerCount" value="4"> 4인 플레이</label>
                            <label><input type="radio" name="playerCount" value="5" checked> 5인 플레이</label>
                            <label><input type="radio" name="playerCount" value="6"> 6인 플레이</label>
                        </div>
                        <button class="start-btn" onclick="startGame()">게임 시작</button>
                    </div>
                </div>`;
            break;
        
        // case 'SUMMARY': 
        //     // 배열의 각 요소를 <p> 태그로 감싸고 하나로 합칩니다.
        //     const summaryHtml = gameData.incidentSummary
        //         .map(line => `<p class="summary-line">${line}</p>`)
        //         .join('');
            
        //     // IntroView에 가공된 HTML을 전달
        //     html = IntroView(summaryHtml);
        //     html += `<button class="next-btn" onclick="proceedFromSummary()">용의자 선택하기</button>`;
        //     break;

        case 'SUMMARY': 
            // 1. 사건 개요 (배열 -> p태그 문단)
            const summaryHtml = gameData.incidentSummary
                .map(line => `<p class="summary-line">${line}</p>`)
                .join('');
            
            // 2. 수사 보고서 (.action-area 내용 생성)
            const detailHtml = gameData.incidentDetail.map(item => `
                <div class="info-row">
                    <span class="info-label">${item.label}</span>
                    <span class="info-content">${item.content}</span>
                </div>
            `).join('');

            // IntroView 구조 안에 action-area 포함
            html = IntroView(summaryHtml,detailHtml);
            html += `<button class="next-btn" onclick="proceedFromSummary()">용의자 선택하기</button>`;
            break;

        case 'EXCLUDE_SETTING':
            const required = 6 - state.playerCount;
            const candidates = Object.values(gameData.characters).filter(c => !c.isCulprit);
            html = `
                <div class="view">
                    <div class="guide-box">
                        <h2>제외할 캐릭터 선택 (${state.excludedCharIds.length}/${required})</h2>
                        <p>${state.playerCount}인 모드입니다. 범인(김조깅)을 제외한 용의자 중 ${required}명을 제외해 주세요.</p>
                    </div>
                    <div class="char-list">
                        ${candidates.map(c => {
                            const isExcluded = state.excludedCharIds.includes(c.id);
                            return `
                                <div class="card ${isExcluded ? 'selected-exclude' : ''}" onclick="toggleExclude('${c.id}')">
                                    <h3>${c.name}</h3>
                                    <p>${isExcluded ? '<strong>[선택됨: 게임에서 제외]</strong>' : '클릭하여 제외'}</p>
                                </div>`;
                        }).join('')}
                    </div>
                    <button class="next-btn" onclick="finishExclusion()">선택 완료</button>
                </div>`;
            break;

        case 'SELECT': 
            html = SelectionView(activeCharacters, state.selectedCharId); 
            break;
        
        case 'MY_STORY': 
            // const culpritNotice = char.isCulprit 
            //     ? `<div class="culprit-alert">⚠️ 당신은 범인입니다.</div>` 
            //     : `<div class="innocent-alert">🔍 당신은 시민입니다.</div>`;
            const culpritNotice = `<div class="whoAreYou-alert">🔍 당신은 범인일까요? 아직은 자신도 모릅니다.</div>`;
            
            // 배열인 char.story를 <p> 태그 문단으로 변환
            const storyContent = char.story
                .map(line => `<p class="story-line">${line}</p>`)
                .join('');

            html = GameView({ 
                title: `${char.name}의 시나리오`, 
                content: culpritNotice + storyContent, // 가공된 HTML 전달
                // story1: char.story_desc_1, 
                // story2: char.story_desc_2, 
                // story3: char.story_desc_3, 
                story4: char.story_desc_4, 
                buttonText: "자기소개로 넘어가기", 
                nextStep: "TALK_0" 
            }); 
            break;

        case 'TALK_0': case 'TALK_1': case 'TALK_2': case 'TALK_3':
            const tIdx = state.currentStep.split('_')[1];
            const nextMemNum = parseInt(tIdx) + 1;
            html = GameView({ 
                title: tIdx === '0' ? '첫 대면 (자기소개)' :  `${tIdx}차 토론`, 
                content: "대화 후 기억을 확인하세요.", 
                buttonText: `기억 ${nextMemNum} 보기`, 
                nextStep: `MEM_${nextMemNum}` 
            });
            break;

        // case 'MEM_1': case 'MEM_2': case 'MEM_3': case 'MEM_4':
        //     const mIdx = state.currentStep.split('_')[1];
        //     html = GameView({ 
        //         title: `${char.name}의 ${mIdx}번째 기억`, 
        //         content: char.memories[mIdx-1].text, 
        //         buttonText: "다음 단계 대기", 
        //         nextStep: `WAIT_${mIdx}` 
        //     });
        //     break;

        case 'MEM_1': case 'MEM_2': case 'MEM_3': case 'MEM_4':
    const mIdx = state.currentStep.split('_')[1];
    let memoryText = char.memories[mIdx-1].text;

    // --- 기억 3단계에서 정체 공개 로직 추가 ---
    if (mIdx === '3') {
        const identityNotice = char.isCulprit 
            ? `<div class="reveal-box culprit">
                 <h3 class="reveal-title">⚠️ 진실의 확인</h3>
                 <p class="reveal-msg culprit-alert">당신은 이 사건의 <strong>범인</strong>입니다.</p>
                 <p style="margin: 0;"> 증거를 인멸하고 수사망을 피하십시오.</p>
                 <br> 
               </div>`
            : `<div class="reveal-box innocent">
                 <h3 class="reveal-title">🔍 진실의 확인</h3>
                 <p class="reveal-msg innocent-alert">당신은 범인이 아니었습니다.</p>
                 <p style="margin: 0;"> 단서를 조합해 진범을 찾아내십시오.</p>
                 <br> 
               </div>`;
        
        // 정체 안내를 기억 내용 위에 추가
        memoryText = identityNotice + `<hr class="reveal-divider">` + memoryText;
    }
    // --------------------------------------

    html = GameView({ 
        title: `${char.name}의 ${mIdx}번째 기억`, 
        content: memoryText, 
        buttonText: "다음 단계 대기", 
        nextStep: `WAIT_${mIdx}` 
    });
    break;

        case 'WAIT_1': case 'WAIT_2': case 'WAIT_3': case 'WAIT_4':
            const wIdx = state.currentStep.split('_')[1];
            const nextStep = wIdx === '4' ? 'TALK_4' : `TALK_${wIdx}`;
            html = GameView({ 
                title: "대기 중...", 
                content: char.waitMessages[wIdx-1] || "기다려 주세요.", 
                buttonText: "다음 단계로", 
                nextStep: nextStep
            });
            break;

        case 'TALK_4':
            html = GameView({ title: `최종 토론`, content: "범인을 지목하세요.", isLastMemory: true });
            break;

        case 'CLUE_SUCCESS':
            html = GameView({ 
                title: "🎯 단서 확보!", content: `정답입니다!`, buttonText: "범인 지목하기", nextStep: "VOTE",
                story1 : `방송 프로그램에 대한 긴 설명...`
            });
            break;

        case 'VOTE':
            html = `
                <div class="view">
                    <h2>최종 범인 지목</h2>
                    <div class="char-list">
                        ${Object.values(activeCharacters).map(c => `
                            <div class="card" onclick="finalVote('${c.id}')"><h3>${c.name}</h3></div>
                        `).join('')}
                    </div>
                </div>`;
            break;

        case 'ENDING':
            const isCorrect = state.voteResult === Object.values(gameData.characters).find(c => c.isCulprit).id;
            html = `
                <div class="view ending">
                    <h2>${isCorrect ? "🎉 성공" : "❌ 실패"}</h2>
                    <p>${isCorrect ? "범인을 잡았습니다!" : "범인을 놓쳤습니다."}</p>
                    <button onclick="location.reload()">처음으로</button>
                </div>`;
            break;
    }
    app.innerHTML = html;
}

render();