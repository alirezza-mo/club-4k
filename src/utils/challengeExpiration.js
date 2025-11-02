import connectToDb from '../../configs/db';
import Challenge from '../../models/Challenge';

export const checkAndExpireChallenges = async () => {
  try {
    await connectToDb();
    
    const oneHourThirtyMinutesAfterFightTime = new Date(Date.now() - (90 * 60 * 1000));
    
    const expiredChallenges = await Challenge.find({
      status: "pending",
      fightTime: { $lt: oneHourThirtyMinutesAfterFightTime }
    });
    
    if (expiredChallenges.length > 0) {
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



export const getExpirationInfo = (challenge) => {
  
  if (challenge.status !== 'pending') return null;
  console.log(challenge.status);
  
  const fightTime = new Date(challenge.fightTime);
  const expirationTime = new Date(fightTime.getTime() + (90 * 60 * 1000)); 
  const now = new Date();
  const timeLeft = expirationTime.getTime() - now.getTime();
  
  if (timeLeft <= 0) return { expired: true, timeLeft: 0 };
  
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  return { expired: false, timeLeft, hours, minutes };
};
