import User from "../models/User";

export const updateStreak = async (userId)=> {
    const updateLongest = ()=>{
        user.longestStreak = Math.max(
            user.currentStreak,
            user.longestStreak
        );
    }
    const updateLast = ()=> {
        user.lastStreakDate = new Date();
    }
    const user = await User.findById(userId)
    if(!user){
        throw new Error("khong tim thay nguoi dung");
    }

    if(!user.lastStreakDate){
        user.currentStreak = 1;
        updateLongest()
        updateLast()
        await user.save();
        return
    }
    const today = new Date();
    const last = new Date(user.lastStreakDate);
    today.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);
    const difference = Math.floor((today - last) / 86400000);
    if(difference === 1){
        user.currentStreak += 1;
        updateLongest()
        updateLast()
        await user.save()
        return 
    }
    if(difference > 1){
        user.currentStreak = 1
        updateLongest()
        updateLast()
        await user.save()
        return
    }
    if(difference === 0){
        return
    }
}