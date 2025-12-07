/**
 * Migration: Add Referral System fields to users table
 * Sprint 29 - Bônus de Indicação
 *
 * Adds:
 * - referralCode: Unique code to share
 * - referredBy: User ID of who referred this user
 * - referralBonusGiven: Track if they've received referral bonus
 * - totalReferrals: Count of successful referrals
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable('users');
    const results = [];

    // Add referralCode if not exists
    if (!tableInfo.referralCode) {
      await queryInterface.addColumn('users', 'referralCode', {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
      });
      results.push({ column: 'referralCode', status: 'added' });
    } else {
      results.push({ column: 'referralCode', status: 'already_exists' });
    }

    // Add referredBy if not exists
    if (!tableInfo.referredBy) {
      await queryInterface.addColumn('users', 'referredBy', {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      });
      results.push({ column: 'referredBy', status: 'added' });
    } else {
      results.push({ column: 'referredBy', status: 'already_exists' });
    }

    // Add referralBonusGiven if not exists
    if (!tableInfo.referralBonusGiven) {
      await queryInterface.addColumn('users', 'referralBonusGiven', {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
      results.push({ column: 'referralBonusGiven', status: 'added' });
    } else {
      results.push({ column: 'referralBonusGiven', status: 'already_exists' });
    }

    // Add totalReferrals if not exists
    if (!tableInfo.totalReferrals) {
      await queryInterface.addColumn('users', 'totalReferrals', {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      });
      results.push({ column: 'totalReferrals', status: 'added' });
    } else {
      results.push({ column: 'totalReferrals', status: 'already_exists' });
    }

    console.log('✅ Referral fields migration completed:', results);
    return results;
  },

  down: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable('users');

    if (tableInfo.referralCode) {
      await queryInterface.removeColumn('users', 'referralCode');
    }
    if (tableInfo.referredBy) {
      await queryInterface.removeColumn('users', 'referredBy');
    }
    if (tableInfo.referralBonusGiven) {
      await queryInterface.removeColumn('users', 'referralBonusGiven');
    }
    if (tableInfo.totalReferrals) {
      await queryInterface.removeColumn('users', 'totalReferrals');
    }

    console.log('✅ Referral fields migration rolled back');
  }
};
