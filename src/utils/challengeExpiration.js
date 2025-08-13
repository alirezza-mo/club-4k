import connectToDb from '../../configs/db';
import Challenge from '../../models/Challenge';

/**
 * بررسی و انقضای چالش‌های منقضی شده
 * این تابع هر بار که چالش‌ها فراخوانی می‌شوند اجرا می‌شود
 * انقضا بر اساس fightTime (زمان مقرر چالش) محاسبه می‌شود
 * چالش‌هایی که 1 ساعت و 30 دقیقه بعد از زمان مقرر رد می‌شوند
 */
export const checkAndExpireChallenges = async () => {
  try {
    await connectToDb();
    
    // محاسبه زمان آستانه (1 ساعت و 30 دقیقه بعد از زمان مقرر)
    const oneHourThirtyMinutesAfterFightTime = new Date(Date.now() - (90 * 60 * 1000));
    
    // یافتن چالش‌های pending که زمان مقررشان گذشته و 1 ساعت و 30 دقیقه اضافی هم گذشته
    const expiredChallenges = await Challenge.find({
      status: "pending",
      fightTime: { $lt: oneHourThirtyMinutesAfterFightTime }
    });
    
    if (expiredChallenges.length > 0) {
      // به‌روزرسانی چالش‌های منقضی شده
      const updateResult = await Challenge.updateMany(
        {
          status: "pending",
          fightTime: { $lt: oneHourThirtyMinutesAfterFightTime }
        },
        {
          $set: { status: "rejected" }
        }
      );
      
      console.log(`🕐 [${new Date().toLocaleString('fa-IR')}] ${expiredChallenges.length} چالش منقضی شده به صورت خودکار رد شد`);
      
      return {
        success: true,
        expiredCount: expiredChallenges.length,
        updatedCount: updateResult.modifiedCount
      };
    }
    
    return {
      success: true,
      expiredCount: 0,
      updatedCount: 0
    };
    
  } catch (error) {
    console.error('❌ خطا در بررسی چالش‌های منقضی شده:', error);
    return {
      success: false,
      error: error.message
    };
  }
};


/**
 * محاسبه اطلاعات انقضا برای یک چالش
 * انقضا بر اساس fightTime (زمان مقرر چالش) محاسبه می‌شود
 */
export const getExpirationInfo = (challenge) => {
  if (challenge.status !== 'pending') return null;
  
  const fightTime = new Date(challenge.fightTime);
  const expirationTime = new Date(fightTime.getTime() + (90 * 60 * 1000)); // 1 hour 30 minutes after fight time
  const now = new Date();
  const timeLeft = expirationTime.getTime() - now.getTime();
  
  if (timeLeft <= 0) return { expired: true, timeLeft: 0 };
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, timeLeft, hours, minutes };
};
