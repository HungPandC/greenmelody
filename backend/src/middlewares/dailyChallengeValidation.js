const allowedPracticeTimes = [5, 10, 15, 20, 30, 45, 60];
const allowedExercises = [3, 5, 10, 15, 25, 40, 60];
const allowedStars = [1, 2, 3, 5, 8, 12, 15];

export const validateDailyChallengeTargets=(req,res)=>{
    const { practiceTime, exercises, stars } = req.body.targets;
    const validPracticeTime =
        allowedPracticeTimes.includes(practiceTime);

    const validExercises =
        allowedExercises.includes(exercises);

    const validStars =
        allowedStars.includes(stars);

    if (!validPracticeTime || !validExercises || !validStars) {
        return res.status(400).json({
            message: "Invalid daily challenge target"
        });
    }
    next();
}