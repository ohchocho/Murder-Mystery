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
    voteResult: null
};

// 네비게이션 함수
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

// function renderHeader() {
//     const labels = { 
//         'MAIN': '홈', 'SUMMARY': '개요', 'SELECT': '용의자', 
//         'MY_STORY': '내 시나리오', 'MEM_1': '기억1', 'MEM_2': '기억2', 'MEM_3': '기억3' 
//     };
//     headerContainer.innerHTML = `
//         <nav class="header">
//             <div class="nav-buttons">
//                 ${state.unlockedSteps.filter(s => labels[s]).map(s => 
//                     `<button onclick="onNavigate('${s}', true)">${labels[s]}</button>`
//                 ).join('')}
//             </div>
//             <button class="back-btn" onclick="goBackToFlow()">돌아가기</button>
//         </nav>
//     `;
// }
// function renderHeader() {
    // const labels = { 
    //     'MAIN': '홈', 'SUMMARY': '개요', 'SELECT': '용의자', 
    //     'MY_STORY': '내 시나리오', 'MEM_1': '기억1', 'MEM_2': '기억2', 'MEM_3': '기억3' 
    // };
function renderHeader() {
    const labels = { 
        'MAIN': '홈', 'SUMMARY': '개요', 'SELECT': '용의자', 
        'MY_STORY': '내 시나리오', 
        'MEM_1': '기억1', 'MEM_2': '기억2', 'MEM_3': '기억3', 'MEM_4': '기억4',
        'TALK_4': '최종토론'
    };
    

    // 현재 보고 있는 페이지가 실제 진행 페이지가 아니라면 '과거 보기 모드' 강조
    const isViewingHistory = state.currentStep !== state.lastActiveStep;

    headerContainer.innerHTML = `
        <nav class="header ${isViewingHistory ? 'history-mode' : ''}">
            <div class="nav-buttons">
                ${state.unlockedSteps
                    .filter(s => labels[s])
                    .map(s => `
                        <button class="${state.currentStep === s ? 'active' : ''}" 
                                onclick="onNavigate('${s}', true)">
                            ${labels[s]}
                        </button>
                    `).join('')}
            </div>
            ${isViewingHistory ? 
                `<button class="back-btn highlight" onclick="goBackToFlow()">돌아가기</button>` : 
                `<div class="status-badge">진행 중</div>`
            }
        </nav>
    `;
}

// function render() {
//     renderHeader();
//     const char = state.selectedCharId ? gameData.characters[state.selectedCharId] : null;
//     let html = '';

//     switch (state.currentStep) {
//         case 'MAIN': html = MainView(); break;
//         case 'SUMMARY': 
//             // GameView 대신 IntroView를 사용합니다.
//             html = IntroView(gameData.incidentSummary); 
//             break;
//         // render 함수 내 switch 문 일부
//         case 'SELECT': 
//             html = SelectionView(gameData.characters, state.selectedCharId); 
//             break;
        
//         case 'MY_STORY': html = GameView({ title: `${char.name}의 시나리오`, content: char.story, buttonText: "1차 토론 시작", nextStep: "TALK_1" }); break;
        
//         case 'TALK_1': case 'TALK_2': case 'TALK_3':
//             const tIdx = state.currentStep.split('_')[1];
//             html = GameView({ title: `${char.name} - ${tIdx}차 토론`, content: "충분히 대화 후 기억을 확인하세요.", buttonText: `기억 ${tIdx} 보기`, nextStep: `MEM_${tIdx}` });
//             break;

//         case 'MEM_1': case 'MEM_2':
//             const mIdx = state.currentStep.split('_')[1];
//             html = GameView({ title: `${char.name}의 ${mIdx}번째 기억`, content: char.memories[mIdx-1].text, buttonText: "다음 토론으로 가기", nextStep: `WAIT_${mIdx}` });
//             break;

//         case 'MEM_3':
//             html = GameView({ title: `${char.name}의 3번째 기억`, content: char.memories[2].text, isLastMemory: true });
//             break;

//         case 'WAIT_1': case 'WAIT_2':
//             const wIdx = state.currentStep.split('_')[1];
//             html = GameView({ title: "대기 중...", content: char.waitMessages[wIdx-1], buttonText: "모두 준비됨", nextStep: `TALK_${parseInt(wIdx)+1}` });
//             break;

//         case 'CLUE_SUCCESS':
//             html = GameView({ title: "🎯 단서 확보!", content: `정답입니다! '${gameData.answerKey}'(을)를 증거로 확보했습니다.`, buttonText: "범인 지목하기", nextStep: "VOTE" });
//             break;

//         case 'VOTE':
//             html = `
//                 <div class="view">
//                     <h2>최종 범인 지목</h2>
//                     <div class="char-list">
//                         ${Object.values(gameData.characters).map(c => `<div class="card" onclick="finalVote('${c.id}')"><h3>${c.name}</h3></div>`).join('')}
//                     </div>
//                 </div>`;
//             break;

//         case 'ENDING':
//             const isCorrect = state.voteResult === Object.values(gameData.characters).find(c => c.isCulprit).id;
//             html = `
//                 <div class="view ending">
//                     <h2>${isCorrect ? "🎉 추리 성공" : "❌ 추리 실패"}</h2>
//                     <div class="content-box"><p>${char.endings[isCorrect ? 'win' : 'lose']}</p></div>
//                     <button onclick="location.reload()">처음으로</button>
//                 </div>`;
//             break;
//     }
//     app.innerHTML = html;
// }

function render() {
    renderHeader();
    const char = state.selectedCharId ? gameData.characters[state.selectedCharId] : null;
    let html = '';

    switch (state.currentStep) {
        case 'MAIN': html = MainView(); break;
        case 'SUMMARY': html = IntroView(gameData.incidentSummary); break;
        case 'SELECT': html = SelectionView(gameData.characters, state.selectedCharId); break;
        
        case 'MY_STORY': 
            // 범인 여부에 따른 안내 문구 생성
            const culpritNotice_STORY = char.isCulprit 
                ? `<div class="culprit-alert">⚠️ 당신은 범인입니다. 절대 들키지 마세요!</div>` 
                : `<div class="innocent-alert">🔍 당신은 시민입니다. 진범을 찾아내세요!</div>`;

            html = GameView({ 
                title: `${char.name}의 시나리오`, 
                // 기존 내용(story) 위에 범인 공지를 합쳐서 전달
                content: culpritNotice_STORY + char.story, 
                story1: char.story_desc_1, 
                story2: char.story_desc_2, 
                story3: char.story_desc_3, 
                story4: char.story_desc_4, 
                buttonText: "자기소개로 넘어가기", 
                nextStep: "TALK_0" 
            }); 
            break;

        // 토론 단계: 0, 1, 2, 3차 (기억 보기 버튼)
        case 'TALK_0': case 'TALK_1': case 'TALK_2': case 'TALK_3':
            const tIdx = state.currentStep.split('_')[1];
            const nextMemNum = parseInt(tIdx) + 1;
            
            const culpritNotice_TALK = char.isCulprit 
                ? `<span class="char-name isCulprit"> 나는 ${char.name}(범인) 입니다.</span>` 
                : `<span class="char-name"> 나는 ${char.name} 입니다.</span>`;

            // 제목 분기 처리
            const talkTitle = tIdx === '0' 
                ? `첫 대면 (자기소개)` + culpritNotice_TALK // 0차일 때 원하는 제목으로 수정 가능
                : `${char.name} - ${tIdx}차 토론`;

            html = GameView({ 
                title: talkTitle, 
                content: tIdx === '0' 
                    ? "사건 현장에 모인 사람들... 서로를 탐색하며 자기소개를 나누세요." 
                    : "새롭게 떠오른 기억을 바탕으로 충분히 대화 후 다음 기억을 확인하세요.", 
                buttonText: `기억 ${nextMemNum} 보기`, 
                nextStep: `MEM_${nextMemNum}` 
            });
            break;
        // ★ 4차 토론 (기억 4를 본 후의 최종 단계)
        case 'TALK_4':
            html = GameView({ 
                title: `${char.name} - 4차 토론 (최종)`, 
                content: "모든 기억이 떠올랐습니다. 결정적 단서를 입력하고 범인을 지목하세요.", 
                isLastMemory: true 
            });
            break;

        // 기억 확인 (MEM_1, 2, 3, 4)
        case 'MEM_1': case 'MEM_2': case 'MEM_3': case 'MEM_4':
            const mIdx = state.currentStep.split('_')[1];
            html = GameView({ 
                title: `${char.name}의 ${mIdx}번째 기억`, 
                content: char.memories[mIdx-1].text, 
                buttonText: "다음 단계 대기", 
                nextStep: `WAIT_${mIdx}` 
            });
            break;

        // 대기 화면 로직
        case 'WAIT_1': case 'WAIT_2': case 'WAIT_3': case 'WAIT_4':
            const wIdx = state.currentStep.split('_')[1];
            const nextTalkNum = parseInt(wIdx); // WAIT_1 이후는 TALK_1
            html = GameView({ 
                title: "대기 중...", 
                content: char.waitMessages[wIdx-1] || "다른 플레이어를 기다리는 중입니다.", 
                buttonText: `${nextTalkNum}차 토론 시작`, 
                nextStep: `TALK_${nextTalkNum}` 
            });
            break;

        case 'CLUE_SUCCESS':
            html = GameView({ title: "🎯 단서 확보!", content: `정답입니다! '${gameData.answerKey}'(을)를 증거로 확보했습니다.`, buttonText: "범인 지목하기", nextStep: "VOTE",
            story1 : `지역 케이블 방송 프로그램 「우리동네 이런일」은 마을에서 벌어진 기묘하고 특별한 사건들을 다루는 코너였다. 
            그중 제45회 방송에서는 한 재력가의 유산과 관련된 놀라운 이야기가 소개되었다.
            마을에서 넉넉한 재산을 가진 인물이 세상을 떠나면서 남긴 유언장이 공개되었는데, 그 안에는 일반적인 상속 절차와는 다른 조건이 담겨 있었다. 
            그는 자신의 재산 일부를 고양이에게 상속한다는 파격적인 내용을 남긴 것이다. 
            방송은 “사람도 아닌 고양이가 상속을 받는다니, 이런 일이 있을 수 있느냐”라는 반응을 중심으로 당시 지역 사회의 놀라움과 화제를 전했다.
            특히 그 고양이는 왼쪽 귀 뒤에 별 모양의 상처가 있다는 독특한 특징을 가지고 있었는데, 
            방송은 마지막에 “지금쯤 그 고양이는 행자식들이 행복하게 잘 키우고 있지 않을까”라는 따뜻한 멘트로 마무리되었다.
            결국 제45회 방송은 단순한 재산 상속 이야기를 넘어, 반려동물과 인간의 관계, 그리고 마을 사람들의 기억 속에 오래 남을 특별한 사건으로 기록되었다.` });
            break;

        case 'VOTE':
            html = `
                <div class="view">
                    <h2>최종 범인 지목</h2>
                    <div class="char-list">
                        ${Object.values(gameData.characters).map(c => `<div class="card" onclick="finalVote('${c.id}')"><h3>${c.name}</h3></div>`).join('')}
                    </div>
                </div>`;
            break;

        case 'ENDING':
            const isCorrect = state.voteResult === Object.values(gameData.characters).find(c => c.isCulprit).id;
            html = `
                <div class="view ending">
                    <h2>${isCorrect ? "🎉 추리 성공" : "❌ 추리 실패"}</h2>
                    <div class="content-box"><p>${char.endings[isCorrect ? 'win' : 'lose']}</p></div>
                    <button onclick="location.reload()">처음으로</button>
                </div>`;
            break;
    }
    app.innerHTML = html;
}

render();