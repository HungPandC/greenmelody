cơ chế  reward{

    khung :
        ├── Difficulty        ← bài khó đáng giá hơn
        │
        ├── Accuracy          ← làm tốt nhận nhiều hơn
        │
        ├── Improvement       ← cải thiện bài cũ vẫn được thưởng
        │
        └── Replay             ← vẫn có reward nhỏ sau khi master



    mẫu :
        bestAccuracy: 0.9,
        bestStars: 4,
        totalAttempts: 7,
        totalRewardClaimed: 240

    vd :
        if (accuracy <= lesson.bestAccuracy) {
            // không thưởng
            return;
        }
        nếu có improvement → chỉ tính quà phần tăng thêm
        nếu lớn hơn cái đó từ phần trăm hơn 5% trở lên hoặc tính theo bài 
        // update : theo tôi nghĩ thì nên để cho có hiện ra các chổ nào tới đâu sẽ đc nhận xu 
            và kiểu như frontend chỉ hiện xu lúc đó nhận đc sẽ là j và nó sẽ ko có phần chính xác, phầ n trăm là khi gặp các bài dài
        const reward = calculateReward(
            lesson.bestAccuracy,
            accuracy,
            difficulty
        );

    Làm tốt hơn → accuracy tăng thì được thêm.
    Bài khó hơn → multiplier cao hơn.
    Lesson dài hơn → có nhiều câu/bài con hơn thì reward lớn hơn.

    tối đa 3 lần/ngày/lesson -> phải hoàn thành 100% mới bắt đầu tính như này
    Mỗi lần 100% → 2/10 tổng số tiền tối đa của bài đó

    tùy theo bài thì số lượng "sao" nhận đc sẽ khác:

        -với các bài dễ thì chỉ có 100%

        -với các bài có mức độ trung bình thì:
            50% - 100%

        -nếu vs các bài nhiều bài và khó thì có các mốc:
            50% - 75% - 100%
}