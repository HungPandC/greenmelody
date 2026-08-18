import type { OctaveType } from "./typeGenerators";
const BacNote = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
const NOTES   = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// const mocchia = bac("C4");
// const baseSol = bac("E4");
// const baseFa  = bac("G2");

// let notes    = {};
// let tenranot = {};

// for (let x = 1; x <= 88; x++) {
//   let midi = x + 20;
//   let ten  = taoten(midi);
//   let obj  = { Tennot: ten, Midi: midi, NoteY: layvitri(ten) };
//   notes[x]      = obj;
//   tenranot[ten] = obj;
// }
const octaveLocation = [
    2,   // B0
    14,  // B1
    26,  // B2
    38,  // B3
    50,  // B4
    62,  // B5
    74,  // B6
    86,  // B7
    87   // C8
];
const AllNote = 88;
const getNoteName = (note: number): string => {
    return NOTES[note % 12];
};

const getRandomNoteInOctave = (octave: OctaveType) => {
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    return (
        Math.floor(Math.random() * (maxNote - minNote + 1)) +
        minNote
    );
};

const getNote = (
    root: number,
    distance: number,
    octave: OctaveType
) => {
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    const canUp = root + distance <= maxNote;
    const canDown = root - distance >= minNote;

    let target: number;

    if (canUp && canDown) {
        target = root + (Math.random() < 0.5 ? distance : -distance);
    } else if (canUp) {
        target = root + distance;
    } else {
        target = root - distance;
    }

    return target;
};

export const generatePitchDirectionQuestion = (
    octave: OctaveType,
    maxDistance: number,
    allowSame: boolean,
) => {
    const root = getRandomNoteInOctave(octave);

    const distance =
        Math.floor(Math.random() * maxDistance) +
        (allowSame ? 0 : 1);

    const target = getNote(root, distance, octave);

    return [
        getNoteName(root),
        getNoteName(target),
    ];
};

const distanceRange = {
    easy: [3, 8],
    medium: [2, 10],
    hard: [1, 12],
};

const questionNoteCount = {
    // not dc tim bang for nen can tru 1
    "nghelonhoacnhonhat": 2,
    "tim2notbangnhau": 3,
};

type Difficulty = "easy" | "medium" | "hard";

type QuestionType =
    | "nghelonhoacnhonhat"
    | "tim2notbangnhau";

export const generateHighestLowestPitchQuestion = (
    octave: OctaveType,
    difficulty: Difficulty = "easy",
    questionType: QuestionType = "nghelonhoacnhonhat",
) => {
    const minNote = octaveLocation[octave.minOctave];
    const maxNote = octaveLocation[octave.maxOctave];

    const root = getRandomNoteInOctave(octave);

    const range = distanceRange[difficulty];

    const possibleNotes: number[] = [];

    for (let note = minNote; note <= maxNote; note++) {
        const distance = Math.abs(note - root);

        if (
            distance >= range[0] &&
            distance <= range[1]
        ) {
            possibleNotes.push(note);
        }
    }

    const note1 =
        possibleNotes[
            Math.floor(Math.random() * possibleNotes.length)
        ];

    const remainingNotes = possibleNotes.filter(
        note => note !== note1
    );

    const note2 =
        remainingNotes[
            Math.floor(Math.random() * remainingNotes.length)
        ];

    let result = [
        getNoteName(root),
        getNoteName(note1),
        getNoteName(note2),
    ];

    if (questionType === "tim2notbangnhau") {
        const duplicateIndex =
            Math.floor(Math.random() * 3);

        const duplicateNote =
            result[
                Math.floor(Math.random() * 3)
            ];

        result.splice(
            duplicateIndex,
            0,
            duplicateNote
        );
    }

    return result;
};
// let arrgoc = [], arrdau = [], array = [], arrsau = [];
// let arrquangdau = [], arrquangsau = [], quangdung = [], quangsai = [];
// let dot1 = [], dot2 = [];
// let phatlai = true;
// let q1, q2;
// let duocve;
// let SoLuongTaskHienTai;
// let ketquadungsai = null;
// let TongChieuDaiTask = 0;
// let historyGiu   = [];
// let historyKoGiu = [];
// let done = false;
// let dung, sai;
// let baiHienTai = [];
// let taskIndex  = 0;
// let TaskDuocLayHienTai;
// let Alltasks;
// let batdau, ketthuc;

// function RandomNoteNhieuQuang(arr, ketqua) {
//   arrgoc = []; arrdau = []; arrsau = []; arrquangdau = []; arrquangsau = []; array = [];
//   let quanglonnhat = arr[0];
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i] > quanglonnhat) quanglonnhat = arr[i];
//   }
//   let goc = Math.floor(Math.random() * (max - min + 1)) + min - quanglonnhat;
//   if (goc <= 1) goc = 1;
//   let dau, sau;

//   function haiquang(arr) {
//     if (arr.length < 2) return;
//     let dodai = arr.length;
//     let so1   = Math.floor(Math.random() * dodai);
//     let so2   = Math.floor(Math.random() * (dodai - 1));
//     if (so2 >= so1) so2++;
//     let chonthutu = Math.floor(Math.random() * 2) + 1;
//     let not  = arr[so1];
//     let not2 = arr[so2];
//     switch (chonthutu) {
//       case 1: dau = not;  sau = not2; break;
//       case 2: dau = not2; sau = not;  break;
//     }
//   }

//   haiquang(arr);
//   if (dau === undefined || sau === undefined) return RandomNoteNhieuQuang(arr, ketqua);
//   if (!notes[goc + dau] || !notes[goc + sau]) return RandomNoteNhieuQuang(arr, ketqua);

//   arrgoc.push({ note: notes[goc].Tennot,       truongdo: mocden, wait: tocdo(truongdo) / 1000 });
//   arrdau.push({ note: notes[goc + dau].Tennot, truongdo: mocden, wait: mocden + mocdon });
//   arrsau.push({ note: notes[goc + sau].Tennot, truongdo: mocden, wait: mocden + mocdon });

//   arrquangdau = [...arrgoc, ...arrdau];
//   arrquangsau = [...arrgoc, ...arrsau];
//   q1 = Math.abs(dau);
//   q2 = Math.abs(sau);

//   if (ketqua === "first" && q1 < q2) {
//     [q1, q2] = [q2, q1];
//     [arrquangdau, arrquangsau] = [arrquangsau, arrquangdau];
//   } else if (ketqua === "second" && q1 > q2) {
//     [q1, q2] = [q2, q1];
//     [arrquangdau, arrquangsau] = [arrquangsau, arrquangdau];
//   }

//   if (ketqua === "second") {
//     quangdung = [...arrquangsau];
//     quangsai  = [...arrquangdau];
//   } else {
//     quangdung = [...arrquangdau];
//     quangsai  = [...arrquangsau];
//   }
//   array     = [...arrquangdau, ...arrquangsau];
// }
// function taoMoiBaiQuang(arr, soTask = 10, tiLe = 0.6) {
//   Alltasks           = soTask;
//   baiHienTai         = [];
//   taskIndex          = 0;
//   dung               = 0;
//   sai                = 0;
//   done               = false;
//   SoLuongTaskHienTai = 0;
//   resetCombo();
//   batdau             = performance.now();

//   let SoCauFirst, SoCauSecond;
//   let chon1hay2 = Math.floor(Math.random() * 2) + 1;

//   switch (chon1hay2) {
//     case 1:
//       SoCauFirst  = Math.floor(soTask * tiLe);
//       SoCauSecond = soTask - SoCauFirst;
//       break;
//     case 2:
//       SoCauSecond = Math.floor(soTask * tiLe);
//       SoCauFirst  = soTask - SoCauSecond;
//       break;
//   }

//   if (SoCauFirst + SoCauSecond < soTask) {
//     if (SoCauFirst <= SoCauSecond) SoCauFirst++;
//     else SoCauSecond++;
//   }

//   let danhSachDapAn = [];
//   for (let cauThu = 0; cauThu < SoCauFirst; cauThu++)  danhSachDapAn.push("first");
//   for (let cauThu = 0; cauThu < SoCauSecond; cauThu++) danhSachDapAn.push("second");

//   for (let viTri = danhSachDapAn.length - 1; viTri > 0; viTri--) {
//     let ramdom = Math.floor(Math.random() * (viTri + 1));
//     [danhSachDapAn[viTri], danhSachDapAn[ramdom]] = [danhSachDapAn[ramdom], danhSachDapAn[viTri]];
//   }

//   for (let cauThu = 0; cauThu < soTask; cauThu++) {
//     baiHienTai.push({
//       array:    [...arr],
//       dapAnDung: danhSachDapAn[cauThu]
//     });
//   }

//   console.log("🎵 Bài mới:", baiHienTai.map(t => t.dapAnDung));
//   let laybaihientai  = baiHienTai.shift();
//   TaskDuocLayHienTai = laybaihientai;
//   vehet1goc(laybaihientai.array);
// }

// function loadTaskTiepTheo() {
//   if (baiHienTai.length === 0) return;
//   TaskDuocLayHienTai = baiHienTai.shift();
//   vehet1goc(TaskDuocLayHienTai.array);
// }

// function vehet1goc(mang) {
//   phatlai       = true;
//   ketquadungsai = null;
//   duocve        = false;
//   dot1          = [];
//   dot2          = [];
//   duocve        = true;
//   donCanvas(); vekhuong(); vesol(); vefa();
//   RandomNoteNhieuQuang(mang, TaskDuocLayHienTai.dapAnDung);
//   play(array);

//   let ten = array[0].note;
//   let y   = tenranot[ten].NoteY;

//   if (y <= layvitri("A6") || y >= layvitri("C1")) {
//     const khuong = document.getElementById("khungnho");
//     khuong.classList.add("show");
//     khuong.addEventListener("animationend", () => { khuong.classList.remove("show"); }, { once: true });
//     duocve = false;
//   } else {
//     venot(ChoVe, y, ten);
//     venot(KeNganCach(ChoVe) + cachnhau, y, ten);
//   }
// }

// function thaydoivitriTask(trang) {
//   let ChieuDaiTaskHienTai = SoLuongTaskHienTai / Alltasks * TongChieuDaiTask;
//   if (SoLuongTaskHienTai === 0) {
//     document.documentElement.style.setProperty("--vitrithanhtiendo", `0px`);
//     return;
//   }
//   if (SoLuongTaskHienTai === Alltasks) done = true;
//   document.documentElement.style.setProperty("--vitrithanhtiendo", `${ChieuDaiTaskHienTai}px`);
// }

// function batthanhnext(dulieutruyen) {
//   const box     = document.getElementById("boxquatiep");
//   const phanhoi = document.getElementById("loiphanhoi");
//   box.classList.add("active");
//   box.classList.remove("dung", "sai");
//   if (dulieutruyen) {
//     box.classList.add("dung");
//     phanhoi.textContent = randomArr(arrChucMung);
//   } else {
//     box.classList.add("sai");
//     phanhoi.textContent = randomArr(arrDongVien);
//   }
// }

// function clearNext() {
//   document.getElementById("boxquatiep").classList.remove("active", "dung", "sai");
//   const page = document.querySelector(".page.active");
//   phatlai = true;
//   page.querySelectorAll(".answer").forEach(answer => {
//     answer.classList.remove("dung", "sai");
//   });
//   return page;
// }

// function next() {
//   const page = clearNext();

//   if (page.dataset.baitap !== "true") return;

//   if (baiHienTai.length === 0) {
//     document.getElementById("quatiep").textContent = "HOAN THANH";
//     TongKet();
//     return;
//   }

//   loadTaskTiepTheo();
//   return true;
// }
// function vehetnotdaco(data) {
//   dot1 = []; dot2 = [];
//   if (!quangdung || !quangsai || quangdung.length < 2 || quangsai.length < 2) {
//     console.warn("vehetnotdaco: quangdung/quangsai chưa đủ dữ liệu", quangdung, quangsai);
//     return;
//   }
//   donCanvas(); vekhuong(); vesol(); vefa();

//   let luuvitri = [];
//   for (let i = 0; i < array.length; i++) luuvitri.push(layvitri(array[i].note));

//   for (let a = 0; a < 4; a++) {
//     let congdon = a - 2;
//     if (a >= 2) { dot2.push({ chox: KeNganCach(ChoVe + congdon * cachnhau, false) + cachnhau }); }
//     else         { dot1.push({ chox: ChoVe + a * cachnhau }); }
//   }

//   if (data) {
//     for (let b = 0; b < 2; b++) {
//       ve.fillStyle = "green";
//       venot(dot1[b].chox, layvitri(quangdung[b].note), quangdung[b].note);
//     }
//   }
//   if (!data) {
//     for (let c = 0; c < 2; c++) {
//       ve.fillStyle = "red";
//       venot(dot1[c].chox, layvitri(quangsai[c].note), quangsai[c].note);
//     }
//     KeNganCach(ChoVe);
//     for (let d = 0; d < 2; d++) {
//       ve.fillStyle = "green";
//       venot(dot2[d].chox, layvitri(quangdung[d].note), quangdung[d].note);
//     }
//   }
//   return data;
// }

// function check1or2(data, event) {
//   if (data === "first") {
//     if (!phatlai) { play(arrquangdau); return thaydoivitriTask(); }
//     else {
//       ketquadungsai = vehetnotdaco(q1 > q2);
//       phatlai = false;
//       SoLuongTaskHienTai += 1;
//     }
//   }
//   if (data === "second") {
//     if (!phatlai) { play(arrquangsau); return thaydoivitriTask(); }
//     else {
//       ketquadungsai = vehetnotdaco(q1 < q2);
//       phatlai = false;
//       SoLuongTaskHienTai += 1;
//     }
//   }

//   thaydoivitriTask();
//   const elementDuocChon = event.currentTarget;
//   const parent  = elementDuocChon.parentElement;
//   const tatca   = parent.querySelectorAll(".answer");

//   tatca.forEach(div => { div.classList.remove("dung", "sai"); });

//   if (ketquadungsai) {
//     tatca.forEach(div => {
//       div.classList.add(div === elementDuocChon ? "dung" : "sai");
//     });
//   } else {
//     tatca.forEach(div => {
//       div.classList.add(div !== elementDuocChon ? "dung" : "sai");
//     });
//   }
//   KiemTraHp(ketquadungsai);
//   batthanhnext(ketquadungsai);
// }

// function playlaiquang() {
//   play(array);
// }

// // ketthuc/TongChieuDaiTask can duoc SET tu file khac (08-results-reward.js, 09-router.js)
// // nhung import binding la read-only nen phai di qua ham setter nay
// function ketThucBaiTap() {
//   ketthuc = performance.now();
//   return ketthuc;
// }
// function setTongChieuDaiTask(px) {
//   TongChieuDaiTask = px;
// }

// // z-main.js (resetBien) khong the gan truc tiep vao cac bien o day
// // (baiHienTai, dung, sai, done...) vi day la import binding read-only.
// // Goi ham nay thay the.
// function resetQuiz() {
//   arrgoc = []; arrdau = []; array = []; arrsau = [];
//   arrquangdau = []; arrquangsau = []; quangdung = []; quangsai = [];
//   dot1 = []; dot2 = [];
//   phatlai = true;
//   duocve = undefined;
//   SoLuongTaskHienTai = undefined;
//   ketquadungsai = null;
//   TongChieuDaiTask = 0;
//   historyGiu = [];
//   historyKoGiu = [];
//   done = false;
//   dung = 0;
//   sai = 0;
//   baiHienTai = [];
//   taskIndex = 0;
//   TaskDuocLayHienTai = undefined;
//   Alltasks = undefined;
// }
