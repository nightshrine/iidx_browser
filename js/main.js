let startButton = document.querySelector('#start-button')
let stopButton = document.querySelector('#stop-button')

let scratchDisplay = document.querySelector('#scratch-display')
let notesDisplay = document.querySelectorAll('.note-display')
let gameSudden = document.querySelector('#game-sudden')
let gameLift = document.querySelector('#game-lift')

let suddenSlider = document.querySelector('#sudden-slider')
let liftSlider = document.querySelector('#lift-slider')

let keyInterval = document.querySelector('#key-interval')
let scratchInterval = document.querySelector('#scratch-interval')

let started = false


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




// ノーツのアニメーション
let suddenHeight = suddenSlider.value || 10
let liftHeight = liftSlider.value || 10

// SUDDENの変更
suddenSlider.addEventListener('input', () => {
    gameSudden.style.height = suddenSlider.value + '%'
    suddenHeight = suddenSlider.value
    liftSlider.max = 90 - suddenHeight
})

// LIFTの変更
liftSlider.addEventListener('input', () => {
    gameLift.style.height = liftSlider.value  + '%'
    liftHeight = liftSlider.value
    suddenSlider.max = 90 - liftHeight
})



keyInterval.addEventListener('input', () => {
    let keyIntervalValue = keyInterval.value
    let intervals = [1,2,4,8,12,16,24,32]
    scratchInterval.innerHTML = ''
    for (let interval of intervals) {
        if (interval > keyIntervalValue) {
            break
        }
        scratchInterval.innerHTML += `<option value="${interval}">${interval}</option>`
    }
})



startButton.addEventListener('click', () => {
    if (started) {
        return
    }
    // ノーツの割合を取得
    let scratchNoteRatio = document.querySelector('#scratch-note-ratio').value
    let zeroNoteRatio = document.querySelector('#zero-note-ratio').value
    let oneNoteRatio = document.querySelector('#one-note-ratio').value
    let twoNoteRatio = document.querySelector('#two-note-ratio').value
    let threeNoteRatio = document.querySelector('#three-note-ratio').value
    let fourNoteRatio = document.querySelector('#four-note-ratio').value
    let fiveNoteRatio = document.querySelector('#five-note-ratio').value
    let sixNoteRatio = document.querySelector('#six-note-ratio').value
    let sevenNoteRatio = document.querySelector('#seven-note-ratio').value
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
        { top: `calc(${suddenHeight}% - 10px)` },
        { top: `${100 - liftHeight}%` },
    ];

    started = true
    let si = setInterval(()=> {
        if (!started) {
            clearInterval(si);// インターバルを止める
            return
        }
        // ノーツの作成
        // 0notesから7notesまでのそれぞれ出てくる確率を配列で渡す
        let notes_rate_list = [zeroNoteRatio, oneNoteRatio, twoNoteRatio, threeNoteRatio, fourNoteRatio, fiveNoteRatio, sixNoteRatio, sevenNoteRatio]
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
        if (scratchNoteRatio !== '0') {
            // スクラッチの作成
            let newScratch = document.createElement("div");
            newScratch.classList.add('scratch-note')
            scratchIntervalCount++;
            if (scratchIntervalCount >= scratchIntervalJudge) {
                scratchIntervalCount = 0;
                let scratchRandom = Math.floor(Math.random() * 100)
                if (scratchRandom < scratchNoteRatio) {
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