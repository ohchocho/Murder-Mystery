// export const SelectionView = (characters) => `
//     <div class="view">
//         <h2>용의자를 선택하세요</h2>
//         <div class="char-list">
//             ${Object.values(characters).map(c => `
//                 <div class="card" onclick="selectChar('${c.id}')">
//                     <h3>${c.name}</h3>
//                     <p>${c.desc}</p>
//                 </div>
//             `).join('')}
//         </div>
//     </div>
// `;

export const SelectionView = (characters, selectedId) => `
    <div class="view">
        <h2>${selectedId ? '선택된 용의자 정보' : '용의자를 선택하세요'}</h2>
        <div class="char-list">
            ${Object.values(characters).map(c => {
                const isSelected = selectedId === c.id;
                const isDisabled = selectedId !== null && !isSelected;
                
                return `
                    <div class="card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}" 
                         onclick="${isDisabled ? '' : `selectChar('${c.id}')`}">
                        <h3>${c.name} ${isSelected ? ' (나)' : ''}</h3>
                        <p>${c.desc}</p>
                        <p>${c.desc_2}</p>
                        ${isDisabled ? '<span class="lock-msg">이미 다른 캐릭터를 선택했습니다.</span>' : ''}
                    </div>
                `;
            }).join('')}
        </div>
        ${selectedId ? `<p class="guide-text">현재 <b>${characters[selectedId].name}</b>님으로 플레이 중입니다.</p>` : ''}
    </div>
`;