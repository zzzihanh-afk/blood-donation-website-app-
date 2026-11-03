const test = require('node:test');
const assert = require('node:assert');
const { calculateNextEligibleDate, evaluateAvailabilityStatus, getEligibleAchievements, isCompatibleDonor } = require('../dist/index.js');

test('Calendar Month: Jan 31 -> Apr 30 (30-day month handling)', () => {
  const result = calculateNextEligibleDate('2025-01-31', 3);
  assert.strictEqual(result, '2025-04-30');
});

test('Calendar Month: Nov 30, 2023 -> Feb 29, 2024 (Leap year handling)', () => {
  const result = calculateNextEligibleDate('2023-11-30', 3);
  assert.strictEqual(result, '2024-02-29');
});

test('Calendar Month: Nov 30, 2024 -> Feb 28, 2025 (Standard year handling)', () => {
  const result = calculateNextEligibleDate('2024-11-30', 3);
  assert.strictEqual(result, '2025-02-28');
});

test('Availability Status: active cooldown', () => {
  const status = evaluateAvailabilityStatus('available', '2025-05-01', '2025-04-15');
  assert.strictEqual(status, 'temporarily_unavailable');
});

test('Availability Status: review window reached requires confirmation', () => {
  const status = evaluateAvailabilityStatus('temporarily_unavailable', '2025-04-01', '2025-04-02');
  assert.strictEqual(status, 'needs_confirmation');
});

test('Achievements: milestone unlocking', () => {
  const achievements0 = getEligibleAchievements(0);
  assert.strictEqual(achievements0[0].unlocked, false);

  const achievements5 = getEligibleAchievements(5);
  assert.strictEqual(achievements5[0].unlocked, true); // First Drop
  assert.strictEqual(achievements5[1].unlocked, true); // Life Saver
  assert.strictEqual(achievements5[2].unlocked, false); // Hero Donor (needs 10)
});

test('Blood Compatibility matching', () => {
  assert.strictEqual(isCompatibleDonor('O-', 'A+'), true);
  assert.strictEqual(isCompatibleDonor('O+', 'O-'), false);
  assert.strictEqual(isCompatibleDonor('AB+', 'B+'), false);
  assert.strictEqual(isCompatibleDonor('B-', 'AB+'), true);
});
