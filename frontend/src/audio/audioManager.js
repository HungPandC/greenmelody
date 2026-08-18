import { sleep } from "./utils"; // đổi path này cho khớp cấu trúc project React của bạn

// ==== State nội bộ (module-level, không phải React state) ====
let dangPlay = false;
let playId = 0;
let audioContext = null;
let piano = null;
let dangTaiAudio = false;
let audioSanSang = false;
let currentNotes = [];
let tempo = 80;

/**
 * Khởi tạo AudioContext + load piano soundfont.
 * Khác bản cũ: KHÔNG tự query DOM (#ManHinhCho) nữa.
 * Thay vào đó nhận callback onLoadingChange(true/false) để component React
 * tự set state hiển thị màn hình chờ.
 *
 * Ví dụ dùng trong component:
 *   const [dangTai, setDangTai] = useState(false);
 *   khoiTaoAudio(setDangTai);
 */
async function khoiTaoAudio(onLoadingChange = () => {}) {
  return new Promise(async (resolve) => {
    if (audioSanSang) {
      resolve(true);
      return;
    }

    if (dangTaiAudio) {
      let dem = 0;
      const cho = setInterval(() => {
        dem += 100;
        if (audioSanSang) {
          clearInterval(cho);
          resolve(true);
        }
        if (dem >= 30000) {
          clearInterval(cho);
          dangTaiAudio = false;
          resolve(false);
        }
      }, 100);
      return;
    }

    dangTaiAudio = true;
    onLoadingChange(true);

    let soLanThu = 0;
    const maxThu = 3;

    while (soLanThu < maxThu) {
      soLanThu++;
      try {
        audioContext = new AudioContext();
        await audioContext.resume();

        const inst = await Promise.race([
          Soundfont.instrument(audioContext, "acoustic_grand_piano", {
            nameToUrl: () => "./acoustic_grand_piano-mp3.js",
            format: "mp3",
          }),
          new Promise((_, reject) => setTimeout(() => reject("timeout"), 20000)),
        ]);

        piano = inst;
        audioSanSang = true;
        dangTaiAudio = false;
        onLoadingChange(false);
        resolve(true);
        return;
      } catch (err) {
        console.log(`❌ Lần ${soLanThu} thất bại:`, err);
        if (soLanThu < maxThu) await sleep(1);
      }
    }

    dangTaiAudio = false;
    audioSanSang = false;
    onLoadingChange(false);
    alert("Không tải được âm thanh. Kiểm tra mạng rồi thử lại.");
    resolve(false);
  });
}

function tocdo(truongdo) {
  return (60000 / tempo) * truongdo;
}

function stopAll() {
  dangPlay = false;
  if (piano) {
    try {
      const oldRelease = piano.opts.release;
      piano.opts.release = 0;
      piano.stop(audioContext.currentTime);
      piano.opts.release = oldRelease;
    } catch (e) {}
  }
  currentNotes = [];
}

async function play(arr) {
  if (!piano || !audioContext) return;
  if (audioContext.state === "suspended") await audioContext.resume();
  stopAll();
  dangPlay = true;
  const idLan = ++playId;

  let startTime = audioContext.currentTime;
  for (let i = 0; i < arr.length; i++) {
    if (playId !== idLan) return;
    let n = arr[i];
    let duration = tocdo(n.truongdo);
    piano.play(n.note, startTime, { duration: duration / 1000 });
    startTime += duration / 1000;
    await sleep(n.wait);
  }
  if (playId === idLan) dangPlay = false;
}

function setTempo(bpm) {
  tempo = bpm;
}

export { khoiTaoAudio, play, stopAll, tocdo, setTempo };