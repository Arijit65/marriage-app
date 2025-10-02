const cron = require('node-cron');
const { logger } = require('../utils/logger');
const { OTP, Proposal, Ad, User, ProfileScore, UserActivity } = require('../models');
const { OTPService } = require('./otpService');

// Scheduler Service class
class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.otpService = new OTPService();
  }

  // Initialize all scheduled tasks
  async initializeScheduledTasks() {
    try {
      // Cleanup expired OTPs (every hour)
      this.scheduleJob('cleanup-otps', '0 * * * *', this.cleanupExpiredOTPs.bind(this));

      // Expire old proposals (every 6 hours)
      this.scheduleJob('expire-proposals', '0 */6 * * *', this.expireOldProposals.bind(this));

      // Expire old ads (every 12 hours)
      this.scheduleJob('expire-ads', '0 */12 * * *', this.expireOldAds.bind(this));

      // Update profile scores (daily at 2 AM)
      this.scheduleJob('update-scores', '0 2 * * *', this.updateProfileScores.bind(this));

      // Send proposal reminders (daily at 10 AM)
      this.scheduleJob('proposal-reminders', '0 10 * * *', this.sendProposalReminders.bind(this));

      // Cleanup old user activities (weekly on Sunday at 3 AM)
      this.scheduleJob('cleanup-activities', '0 3 * * 0', this.cleanupOldActivities.bind(this));

      // Update user engagement scores (daily at 4 AM)
      this.scheduleJob('update-engagement', '0 4 * * *', this.updateEngagementScores.bind(this));

      // Check and downgrade expired plans (daily at 6 AM)
      this.scheduleJob('check-plans', '0 6 * * *', this.checkExpiredPlans.bind(this));

      // Generate analytics reports (weekly on Monday at 5 AM)
      this.scheduleJob('analytics-reports', '0 5 * * 1', this.generateAnalyticsReports.bind(this));

      logger.info('All scheduled tasks initialized successfully');
    } catch (error) {
      logger.error('Error initializing scheduled tasks:', error);
    }
  }

  // Schedule a job
  scheduleJob(name, cronExpression, task) {
    try {
      const job = cron.schedule(cronExpression, async () => {
        try {
          logger.info(`Starting scheduled job: ${name}`);
          await task();
          logger.info(`Completed scheduled job: ${name}`);
        } catch (error) {
          logger.error(`Error in scheduled job ${name}:`, error);
        }
      }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
      });

      this.jobs.set(name, job);
      logger.info(`Scheduled job: ${name} with expression: ${cronExpression}`);
    } catch (error) {
      logger.error(`Error scheduling job ${name}:`, error);
    }
  }

  // Stop a specific job
  stopJob(name) {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      logger.info(`Stopped scheduled job: ${name}`);
    }
  }

  // Stop all jobs
  stopAllJobs() {
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped scheduled job: ${name}`);
    });
    this.jobs.clear();
  }

  // Cleanup expired OTPs
  async cleanupExpiredOTPs() {
    try {
      const deletedCount = await this.otpService.cleanupExpiredOTPs();
      logger.info(`Cleaned up ${deletedCount} expired OTPs`);
    } catch (error) {
      logger.error('Error cleaning up expired OTPs:', error);
    }
  }

  // Expire old proposals
  async expireOldProposals() {
    try {
      const expiredProposals = await Proposal.findExpiredProposals();
      
      for (const proposal of expiredProposals) {
        await proposal.update({ status: 'expired' });
      }

      logger.info(`Expired ${expiredProposals.length} old proposals`);
    } catch (error) {
      logger.error('Error expiring old proposals:', error);
    }
  }

  // Expire old ads
  async expireOldAds() {
    try {
      const expiredAds = await Ad.findExpiredAds();
      
      for (const ad of expiredAds) {
        await ad.autoExpire();
      }

      logger.info(`Expired ${expiredAds.length} old ads`);
    } catch (error) {
      logger.error('Error expiring old ads:', error);
    }
  }

  // Update profile scores
  async updateProfileScores() {
    try {
      const users = await User.findAll();

      let updatedCount = 0;
      for (const user of users) {
        if (user.profileScore) {
          await user.profileScore.calculateOverallScore();
          updatedCount++;
        }
      }

      logger.info(`Updated profile scores for ${updatedCount} users`);
    } catch (error) {
      logger.error('Error updating profile scores:', error);
    }
  }

  // Send proposal reminders
  async sendProposalReminders() {
    try {
      const pendingProposals = await Proposal.findAll({
        where: {
          status: 'pending',
          reminder_sent: false,
          created_at: {
            [require('sequelize').Op.lte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Older than 24 hours
          }
        },
        include: ['proposedUser']
      });

      let sentCount = 0;
      for (const proposal of pendingProposals) {
        try {
          const canSend = await proposal.sendReminder();
          if (canSend) {
            // Here you would integrate with notification service
            // For now, just log it
            logger.info(`Reminder sent for proposal ${proposal.id} to user ${proposal.proposedUser.id}`);
            sentCount++;
          }
        } catch (error) {
          logger.error(`Error sending reminder for proposal ${proposal.id}:`, error);
        }
      }

      logger.info(`Sent ${sentCount} proposal reminders`);
    } catch (error) {
      logger.error('Error sending proposal reminders:', error);
    }
  }

  // Cleanup old user activities
  async cleanupOldActivities() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const deletedCount = await UserActivity.destroy({
        where: {
          activity_timestamp: {
            [require('sequelize').Op.lt]: thirtyDaysAgo
          },
          is_sensitive: false // Don't delete sensitive activities
        }
      });

      logger.info(`Cleaned up ${deletedCount} old user activities`);
    } catch (error) {
      logger.error('Error cleaning up old activities:', error);
    }
  }

  // Update engagement scores
  async updateEngagementScores() {
    try {
      const users = await User.findAll({
        include: ['profileScore']
      });

      let updatedCount = 0;
      for (const user of users) {
        if (user.profileScore) {
          await user.profileScore.calculateUsageScore();
          updatedCount++;
        }
      }

      logger.info(`Updated engagement scores for ${updatedCount} users`);
    } catch (error) {
      logger.error('Error updating engagement scores:', error);
    }
  }

  // Check and downgrade expired plans
  async checkExpiredPlans() {
    try {
      const usersWithExpiredPlans = await User.findAll({
        where: {
          plan_expires_at: {
            [require('sequelize').Op.lt]: new Date()
          },
          plan_id: {
            [require('sequelize').Op.ne]: 1 // Not already on free plan
          }
        }
      });

      let downgradedCount = 0;
      for (const user of usersWithExpiredPlans) {
        await user.update({ plan_id: 1 }); // Downgrade to free plan
        downgradedCount++;
      }

      logger.info(`Downgraded ${downgradedCount} users with expired plans`);
    } catch (error) {
      logger.error('Error checking expired plans:', error);
    }
  }

  // Generate analytics reports
  async generateAnalyticsReports() {
    try {
      const reports = {
        userStats: await this.generateUserStats(),
        proposalStats: await this.generateProposalStats(),
        activityStats: await this.generateActivityStats(),
        otpStats: await this.otpService.getOTPStats(7)
      };

      logger.info('Generated weekly analytics reports:', reports);
      
      // Here you could save reports to database or send via email
      return reports;
    } catch (error) {
      logger.error('Error generating analytics reports:', error);
    }
  }

  // Generate user statistics
  async generateUserStats() {
    try {
      const totalUsers = await User.count();
      const activeUsers = await User.count({
        where: {
          is_active: true,
          account_status: 'active'
        }
      });
      const verifiedUsers = await User.count({
        where: { is_verified: true }
      });

      return {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers * 100).toFixed(2) : 0
      };
    } catch (error) {
      logger.error('Error generating user stats:', error);
      return {};
    }
  }

  // Generate proposal statistics
  async generateProposalStats() {
    try {
      const totalProposals = await Proposal.count();
      const pendingProposals = await Proposal.count({
        where: { status: 'pending' }
      });
      const acceptedProposals = await Proposal.count({
        where: { status: 'accepted' }
      });

      return {
        total: totalProposals,
        pending: pendingProposals,
        accepted: acceptedProposals,
        acceptanceRate: totalProposals > 0 ? (acceptedProposals / totalProposals * 100).toFixed(2) : 0
      };
    } catch (error) {
      logger.error('Error generating proposal stats:', error);
      return {};
    }
  }

  // Generate activity statistics
  async generateActivityStats() {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const totalActivities = await UserActivity.count({
        where: {
          activity_timestamp: {
            [require('sequelize').Op.gte]: sevenDaysAgo
          }
        }
      });

      const uniqueUsers = await UserActivity.count({
        distinct: true,
        col: 'user_id',
        where: {
          activity_timestamp: {
            [require('sequelize').Op.gte]: sevenDaysAgo
          }
        }
      });

      return {
        totalActivities,
        uniqueUsers,
        averageActivitiesPerUser: uniqueUsers > 0 ? (totalActivities / uniqueUsers).toFixed(2) : 0
      };
    } catch (error) {
      logger.error('Error generating activity stats:', error);
      return {};
    }
  }

  // Get job status
  getJobStatus() {
    const status = {};
    this.jobs.forEach((job, name) => {
      status[name] = {
        running: job.running,
        lastRun: job.lastDate,
        nextRun: job.nextDate
      };
    });
    return status;
  }
}

// Initialize scheduler service
const initializeScheduledTasks = async () => {
  try {
    const scheduler = new SchedulerService();
    await scheduler.initializeScheduledTasks();
    
    // Store scheduler instance globally for access
    global.schedulerService = scheduler;
    
    logger.info('Scheduler service initialized successfully');
  } catch (error) {
    logger.error('Error initializing scheduler service:', error);
  }
};

module.exports = {
  SchedulerService,
  initializeScheduledTasks
};
