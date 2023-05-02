let startButton = document.querySelector('#start-button')
let stopButton = document.querySelector('#stop-button')
let resetButton = document.querySelector('#reset-button')
let saveButton = document.querySelector('#save-button')

let scratchDisplay = document.querySelector('#scratch-display')
let notesDisplay = document.querySelectorAll('.note-display')
let gameSudden = document.querySelector('#game-sudden')
let gameLift = document.querySelector('#game-lift')

let player = document.querySelector('#player')
let suddenSlider = document.querySelector('#sudden-slider')
let liftSlider = document.querySelector('#lift-slider')
let suddenSliderValue = suddenSlider.value
let liftSliderValue = liftSlider.value

let greenNumber = document.querySelector('#green-number')

let bpm = document.querySelector('#bpm')
let keyIntervalValue = document.querySelector('#key-interval').value

let keyInterval = document.querySelector('#key-interval')
let scratchInterval = document.querySelector('#scratch-interval')


let scratchIntervalValue = document.querySelector('#scratch-interval').value

let isSrand = document.querySelector('#is-srand')
let scratchNoteRatio = document.querySelector('#scratch-note-ratio')
let zeroNoteRatio = document.querySelector('#zero-note-ratio')
let oneNoteRatio = document.querySelector('#one-note-ratio')
let twoNoteRatio = document.querySelector('#two-note-ratio')
let threeNoteRatio = document.querySelector('#three-note-ratio')
let fourNoteRatio = document.querySelector('#four-note-ratio')
let fiveNoteRatio = document.querySelector('#five-note-ratio')
let sixNoteRatio = document.querySelector('#six-note-ratio')
let sevenNoteRatio = document.querySelector('#seven-note-ratio')






let started = false

window.onload = () => {
    let iidxSettingSaveData = JSON.parse(localStorage.getItem('iidxSettingSaveData'))
    if (iidxSettingSaveData) {
        player.value = iidxSettingSaveData.playerValue
        suddenSlider.value = iidxSettingSaveData.suddenSliderValue
        liftSlider.value = iidxSettingSaveData.liftSliderValue
        greenNumber.value = iidxSettingSaveData.greenNumberValue
        bpm.value = iidxSettingSaveData.bpmValue
        keyInterval.value = iidxSettingSaveData.keyIntervalValue
        scratchInterval.value = iidxSettingSaveData.scratchIntervalValue
        isSrand.checked = iidxSettingSaveData.isSrandChecked
        scratchNoteRatio.value = iidxSettingSaveData.scratchNoteRatioValue
        zeroNoteRatio.value = iidxSettingSaveData.zeroNoteRatioValue
        oneNoteRatio.value = iidxSettingSaveData.oneNoteRatioValue
        twoNoteRatio.value = iidxSettingSaveData.twoNoteRatioValue
        threeNoteRatio.value = iidxSettingSaveData.threeNoteRatioValue
        fourNoteRatio.value = iidxSettingSaveData.fourNoteRatioValue
        fiveNoteRatio.value = iidxSettingSaveData.fiveNoteRatioValue
        sixNoteRatio.value = iidxSettingSaveData.sixNoteRatioValue
        sevenNoteRatio.value = iidxSettingSaveData.sevenNoteRatioValue

        playerChange()
        suddenChange()
        liftChange()
        scratchIntervalChange(scratchInterval.value)
    }
}


// ノーツの個数を選択
const selectNotesNum = (notes_rate_list) => { // 0notesから7notesまでのそれぞれ出てくる確率を配列で渡す
    let notes_list = [] // 確率の数だけnotesを入れる
    for (let i = 0; i < 8; i++) {
        let notes = notes_rate_list[i]
        for (let j = 0; j < notes; j++) {
            notes_list.push(i)
        }
    }
    if (notes_list.length === 0) {
        return -1
    }
    let n = notes_list.length
    let notes_num = notes_list[Math.floor(Math.random() * n)]
    return notes_num
}

// 重複なしでノーツを選択
let pre_select_notes = []
const selectNotes = (notes_num) => {
    let select_notes = []
    let notes_num_sum = pre_select_notes.length + notes_num
    if (notes_num_sum <= 7) {
        while (select_notes.length < notes_num) {
            let note = Math.floor(Math.random() * 7)
            if (select_notes.indexOf(note) === -1 && pre_select_notes.indexOf(note) === -1) {
                select_notes.push(note)
            }
        }
    } else {
        for (let i = 0; i < 7; i++) {
            if (pre_select_notes.indexOf(i) === -1) {
                select_notes.push(i)
            }
        }
        while (select_notes.length < notes_num) {
            let note = Math.floor(Math.random() * 7)
            if (select_notes.indexOf(note) === -1) {
                select_notes.push(note)
            }
        }
    }
    pre_select_notes = select_notes
    return select_notes
}

// 重複ありでノーツを選択
const sSelectNotes = (notes_num) => {
    let select_notes = []
    while (select_notes.length < notes_num) {
        let note = Math.floor(Math.random() * 7)
        if (select_notes.indexOf(note) === -1) {
            select_notes.push(note)
        }
    }
    return select_notes
}



// Playerの変更
const playerChange = () => {
    let playerValue = player.value
    let gameLane = document.querySelector('#game-lane')
    let scratchDisplay = document.querySelector('#scratch-display')
    gameLane.removeChild(scratchDisplay)
    if (playerValue === '1') {
        gameLane.insertAdjacentHTML('afterbegin',  '<div id="scratch-display" class="scratch-display"></div>');
    } else if (playerValue === '2') {
        gameLane.insertAdjacentHTML('beforeend',  '<div id="scratch-display" class="scratch-display"></div>');
    }
}

// SUDDENとLIFTの変更

const suddenChange = () => {
    gameSudden.style.height = suddenSlider.value + '%'
    suddenSliderValue = suddenSlider.value
    liftSlider.max = 90 - suddenSliderValue
}

const liftChange = () => {
    gameLift.style.height = liftSlider.value  + '%'
    liftSliderValue = liftSlider.value
    suddenSlider.max = 90 - liftSliderValue
}

// スクラッチ間隔の変更

const scratchIntervalChange = (scratchIntervalInit = -1) => {
    let keyIntervalValue = keyInterval.value
    let intervals = [1,2,4,8,12,16,24,32]
    scratchInterval.innerHTML = ''
    for (let interval of intervals) {
        if (interval > keyIntervalValue) {
            break
        }
        scratchInterval.innerHTML += `<option value="${interval}">${interval}</option>`
    }
    if (scratchIntervalInit === -1 || typeof(scratchIntervalInit) === 'object') {
        scratchInterval.value = 1
    } else {
        scratchInterval.value = scratchIntervalInit
    }
}

player.addEventListener('change', playerChange)

suddenSlider.addEventListener('input', suddenChange)

liftSlider.addEventListener('input', liftChange)

keyInterval.addEventListener('input', scratchIntervalChange)


// 以下は各ボタンの処理

startButton.addEventListener('click', () => {
    if (started) {
        return
    }
    // ノーツの割合を取得
    let scratchNoteRatioValue = document.querySelector('#scratch-note-ratio').value
    let zeroNoteRatioValue = document.querySelector('#zero-note-ratio').value
    let oneNoteRatioValue = document.querySelector('#one-note-ratio').value
    let twoNoteRatioValue = document.querySelector('#two-note-ratio').value
    let threeNoteRatioValue = document.querySelector('#three-note-ratio').value
    let fourNoteRatioValue = document.querySelector('#four-note-ratio').value
    let fiveNoteRatioValue = document.querySelector('#five-note-ratio').value
    let sixNoteRatioValue = document.querySelector('#six-note-ratio').value
    let sevenNoteRatioValue = document.querySelector('#seven-note-ratio').value
    // 緑数字
    let greenNumber = document.querySelector('#green-number').value
    // BPM, 1小節の拍数
    let bpm = document.querySelector('#bpm').value
    let keyIntervalValue = document.querySelector('#key-interval').value
    let keyIntervalTime = 240000 / bpm / keyIntervalValue
    // スクラッチの間隔
    let scratchIntervalValue = document.querySelector('#scratch-interval').value
    
    let scratchIntervalCount = 0;
    let scratchIntervalJudge = 0;
    if (scratchIntervalValue !== '0') {
        scratchIntervalJudge = keyIntervalValue / scratchIntervalValue
    }
    // S乱かどうか
    let isSrand = document.querySelector('#is-srand').checked

    // 
    let noteAnimation = [
        { top: `calc(${suddenSliderValue}% - 10px)` },
        { top: `${100 - liftSliderValue}%` },
    ];

    started = true
    let si = setInterval(()=> {
        if (!started) {
            clearInterval(si);// インターバルを止める
            return
        }
        // ノーツの作成
        // 0notesから7notesまでのそれぞれ出てくる確率を配列で渡す
        let notes_rate_list = [zeroNoteRatioValue, oneNoteRatioValue, twoNoteRatioValue, threeNoteRatioValue, fourNoteRatioValue, fiveNoteRatioValue, sixNoteRatioValue, sevenNoteRatioValue]
        let notes_num = selectNotesNum(notes_rate_list)
        if (notes_num === -1) {
            console.log('ノーツの割合を入力してください')
            return
        }
        let select_notes = []
        if (isSrand) {
            select_notes = sSelectNotes(notes_num)
        } else {
            select_notes = selectNotes(notes_num)
        }
        let speed = greenNumber * 1000 / 600
        notesDisplay.forEach((noteDisplay,i) => {
            if (select_notes.indexOf(i) === -1) {
                return
            }
            // ノーツの見た目
            let newNote = document.createElement("div");
            newNote.classList.add('note')
            newNote.animate(noteAnimation, {
                duration: speed, // 何秒見えるか
            })

            noteDisplay.appendChild(newNote)
            setTimeout(function () {
                newNote.remove();
            }, speed);
        })
        scratchDisplay = document.querySelector('#scratch-display')
        if (scratchNoteRatioValue !== '0') {
            // スクラッチの作成
            let newScratch = document.createElement("div");
            newScratch.classList.add('scratch-note')
            scratchIntervalCount++;
            if (scratchIntervalCount >= scratchIntervalJudge) {
                scratchIntervalCount = 0;
                let scratchRandom = Math.floor(Math.random() * 100)
                if (scratchRandom < scratchNoteRatioValue) {
                    newScratch.animate(noteAnimation, {
                        duration: speed, // 何秒見えるか
                    })
                    scratchDisplay.appendChild(newScratch)
                    setTimeout(function () {
                        newScratch.remove();
                    }, speed);
                }
            }
        }

    }, keyIntervalTime)
})

stopButton.addEventListener('click', () => {
    started = false
})

resetButton.addEventListener('click', () => {
    document.querySelector('#player').value = 1;
    document.querySelector('#sudden-slider').value = 10;
    document.querySelector('#lift-slider').value = 30;
    document.querySelector('#green-number').value = 330; 
    
    document.querySelector('#bpm').value = 150;
    document.querySelector('#key-interval').value = 4;
    
    document.querySelector('#scratch-interval').value = 1;
    document.querySelector('#is-srand').checked = false;

    document.querySelector('#scratch-note-ratio').value = 0;
    document.querySelector('#zero-note-ratio').value = 0;
    document.querySelector('#one-note-ratio').value = 0;
    document.querySelector('#two-note-ratio').value = 0;
    document.querySelector('#three-note-ratio').value = 0;
    document.querySelector('#four-note-ratio').value = 0;
    document.querySelector('#five-note-ratio').value = 0;
    document.querySelector('#six-note-ratio').value = 0;
    document.querySelector('#seven-note-ratio').value = 0;

    // その他変更
    playerChange()
    suddenChange()
    liftChange()
    scratchIntervalChange()
})

saveButton.addEventListener('click', () => {
    let iidxSettingSaveData = {
        playerValue: document.querySelector('#player').value,
        suddenSliderValue: document.querySelector('#sudden-slider').value,
        liftSliderValue: document.querySelector('#lift-slider').value,
        greenNumberValue: document.querySelector('#green-number').value,
        bpmValue: document.querySelector('#bpm').value,
        keyIntervalValue: document.querySelector('#key-interval').value,
        scratchIntervalValue: document.querySelector('#scratch-interval').value,
        isSrandChecked: document.querySelector('#is-srand').checked,
        scratchNoteRatioValue: document.querySelector('#scratch-note-ratio').value,
        zeroNoteRatioValue: document.querySelector('#zero-note-ratio').value,
        oneNoteRatioValue: document.querySelector('#one-note-ratio').value,
        twoNoteRatioValue: document.querySelector('#two-note-ratio').value,
        threeNoteRatioValue: document.querySelector('#three-note-ratio').value,
        fourNoteRatioValue: document.querySelector('#four-note-ratio').value,
        fiveNoteRatioValue: document.querySelector('#five-note-ratio').value,
        sixNoteRatioValue: document.querySelector('#six-note-ratio').value,
        sevenNoteRatioValue: document.querySelector('#seven-note-ratio').value,
    }
    localStorage.setItem('iidxSettingSaveData', JSON.stringify(iidxSettingSaveData))
})