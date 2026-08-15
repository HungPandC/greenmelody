import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./LessonExercise.module.css";
import { mockExercise } from "../../data/mockLessons";
import { skillLessons, skillMeta } from "../../data/mockLessons";

// State machine đơn giản cho 1 câu hỏi: chưa chọn -> đã chọn -> đã submit (hiện đúng/sai)
type QuestionState = "idle" | "selected" | "submitted";

function LessonExercise() {
    const { skill, lessonId } = useParams<{ skill: string; lessonId: string }>();
    const navigate = useNavigate();

    const [questionIndex, setQuestionIndex] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [state, setState] = useState<QuestionState>("idle");
    const [correctCount, setCorrectCount] = useState(0);
    const [finished, setFinished] = useState(false);

    const meta = skill ? skillMeta[skill] : undefined;
    const lessons = skill ? skillLessons[skill] : undefined;
    const lesson = lessons?.find(l => l.id === lessonId);
    const question = mockExercise[questionIndex];

    if (!meta || !lesson || !question) {
        return (
            <div className={styles.wrap}>
                <div className={styles.card}>
                    <p>Không tìm thấy bài học này.</p>
                    <button className={styles.primaryBtn} onClick={() => navigate("/ear-training")}>← Về Cảm âm</button>
                </div>
            </div>
        );
    }

    function selectOption(i: number) {
        if (state === "submitted") return; // đã submit thì không cho đổi đáp án nữa
        setSelected(i);
        setState("selected");
    }

    function submitAnswer() {
        if (selected === null) return;
        setState("submitted");
        if (selected === question.correctIndex) {
            setCorrectCount((c) => c + 1);
        }
    }

    function nextQuestion() {
        if (questionIndex + 1 < mockExercise.length) {
            setQuestionIndex((i) => i + 1);
            setSelected(null);
            setState("idle");
        } else {
            setFinished(true);
        }
    }

    const progressPct = Math.round(((questionIndex + (state === "submitted" ? 1 : 0)) / mockExercise.length) * 100);

    // ---- REWARD SCREEN (sau khi trả lời hết câu hỏi) ----
    if (finished) {
        const earnedXp = correctCount * 10;
        const earnedCoin = correctCount * 5;
        const nextLesson = lessons?.find(l => !l.locked && l.id !== lesson.id);

        return (
            <div className={styles.wrap}>
                <div className={styles.rewardCard}>
                    <div className={styles.rewardIcon}>🎉</div>
                    <h1>Hoàn thành bài học!</h1>
                    <p className={styles.rewardSub}>{lesson.title} · {meta.title}</p>

                    <div className={styles.scoreRow}>
                        <div className={styles.scoreBox}>
                            <span className={styles.scoreVal}>{correctCount}/{mockExercise.length}</span>
                            <span className={styles.scoreLabel}>Câu đúng</span>
                        </div>
                        <div className={styles.scoreBox}>
                            <span className={styles.scoreVal}>+{earnedXp}</span>
                            <span className={styles.scoreLabel}>XP</span>
                        </div>
                        <div className={styles.scoreBox}>
                            <span className={styles.scoreVal}>+{earnedCoin}</span>
                            <span className={styles.scoreLabel}>Xu</span>
                        </div>
                    </div>

                    <div className={styles.rewardActions}>
                        {nextLesson && (
                            <button
                                className={styles.primaryBtn}
                                onClick={() => navigate(`/ear-training/${skill}/lesson/${nextLesson.id}`)}
                            >
                                Bài tiếp theo: {nextLesson.title} →
                            </button>
                        )}
                        <button className={styles.secondaryBtn} onClick={() => navigate(`/ear-training/${skill}`)}>
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---- QUESTION SCREEN ----
    return (
        <div className={styles.wrap}>
            <div className={styles.topRow}>
                <span className={styles.exitBtn} onClick={() => navigate(`/ear-training/${skill}`)}>✕</span>
                <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                </div>
                <span className={styles.questionCount}>{questionIndex + 1}/{mockExercise.length}</span>
            </div>

            <div className={styles.card}>
                <div className={styles.questionLabel}>{lesson.title} · {meta.title}</div>
                <h2 className={styles.questionText}>{question.question}</h2>

                <div className={styles.options}>
                    {question.options.map((opt, i) => {
                        let cls = styles.option;
                        if (state === "submitted") {
                            if (i === question.correctIndex) cls += ` ${styles.correct}`;
                            else if (i === selected) cls += ` ${styles.wrong}`;
                        } else if (i === selected) {
                            cls += ` ${styles.selected}`;
                        }
                        return (
                            <div key={i} className={cls} onClick={() => selectOption(i)}>
                                {opt}
                            </div>
                        );
                    })}
                </div>

                {state === "submitted" && (
                    <div className={selected === question.correctIndex ? styles.feedbackCorrect : styles.feedbackWrong}>
                        {selected === question.correctIndex ? "✔ Chính xác!" : `✕ Chưa đúng. Đáp án: ${question.options[question.correctIndex]}`}
                    </div>
                )}

                {state !== "submitted" ? (
                    <button className={styles.primaryBtn} disabled={selected === null} onClick={submitAnswer}>
                        Kiểm tra
                    </button>
                ) : (
                    <button className={styles.primaryBtn} onClick={nextQuestion}>
                        {questionIndex + 1 < mockExercise.length ? "Câu tiếp theo →" : "Xem kết quả →"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default LessonExercise;
