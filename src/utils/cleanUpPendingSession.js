// /lib/utils.js
import mongoose from "mongoose";
import Console from "../../models/Console";
import GameSession from "../../models/GameSession";

export async function cleanupPendingSessions() {
  const TIMEOUT_MINUTES = 5;
  const timeoutThreshold = new Date(Date.now() - TIMEOUT_MINUTES * 60 * 1000);

  const expiredSessions = await GameSession.find({
    status: { $in: ["pendingStart", "pendingEnd"] },
    createdAt: { $lt: timeoutThreshold },
  });

  if (expiredSessions.length === 0) return { count: 0 };

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();

    for (const gameSession of expiredSessions) {
      const consoleDevice = await Console.findById(gameSession.console).session(session);
      if (consoleDevice) {
        consoleDevice.currentSession = null;
        consoleDevice.status = "idle";
        await consoleDevice.save({ session });
      }

      gameSession.status = "ended";
      gameSession.endedAt = new Date();
      if (gameSession.startedAt) {
        gameSession.durationSeconds = Math.floor(
          (gameSession.endedAt - gameSession.startedAt) / 1000
        );
      }
      await gameSession.save({ session });
    }

    await session.commitTransaction();
    return { count: expiredSessions.length };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}