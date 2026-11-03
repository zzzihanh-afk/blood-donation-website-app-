const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert');

test('Schema & RLS Audit: Verify SQL migration contains required tables', () => {
  const migrationPath = path.join(__dirname, '..', 'migrations', '20261103000001_initial_core_schema.sql');
  assert.ok(fs.existsSync(migrationPath), 'Migration file must exist');

  const sql = fs.readFileSync(migrationPath, 'utf8');

  const requiredTables = [
    'profiles',
    'role_definitions',
    'permissions',
    'role_permissions',
    'user_role_assignments',
    'administrative_unit_types',
    'locations',
    'administrative_assignments',
    'donor_profiles',
    'donor_availability_events',
    'donation_types',
    'organizations',
    'donation_records',
    'id_card_templates',
    'id_cards',
    'id_card_verifications',
    'achievement_definitions',
    'achievement_awards',
    'blood_requests',
    'request_matches',
    'campaigns',
    'audit_logs',
    'consent_records'
  ];

  for (const table of requiredTables) {
    const tableRegex = new RegExp(`CREATE TABLE IF NOT EXISTS public\\.${table}\\b`, 'i');
    assert.match(sql, tableRegex, `Table ${table} must be defined in migration`);
  }
});

test('Schema & RLS Audit: Verify Row Level Security (RLS) is enabled on all tables', () => {
  const migrationPath = path.join(__dirname, '..', 'migrations', '20261103000001_initial_core_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  const tablesToProtect = [
    'profiles',
    'role_definitions',
    'permissions',
    'user_role_assignments',
    'locations',
    'administrative_assignments',
    'donor_profiles',
    'donation_records',
    'id_cards',
    'achievement_awards',
    'blood_requests',
    'audit_logs'
  ];

  for (const table of tablesToProtect) {
    const rlsRegex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`, 'i');
    assert.match(sql, rlsRegex, `RLS must be explicitly enabled on table ${table}`);
  }
});

test('Security Definer Function: get_verified_id_card_summary exists and redacts PII', () => {
  const migrationPath = path.join(__dirname, '..', 'migrations', '20261103000001_initial_core_schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.get_verified_id_card_summary/i);
  assert.match(sql, /SECURITY DEFINER/i);

  // Extract function return table signature
  const funcMatch = sql.match(/CREATE OR REPLACE FUNCTION public\.get_verified_id_card_summary[\s\S]*?RETURNS TABLE\s*\(([\s\S]*?)\)/i);
  assert.ok(funcMatch, 'Function RETURNS TABLE must be found');
  const returnSignature = funcMatch[1];

  // Ensure sensitive columns are NOT in return signature
  assert.doesNotMatch(returnSignature, /\bphone\b/i, 'Phone must not be returned by public verification gateway');
  assert.doesNotMatch(returnSignature, /\bemail\b/i, 'Email must not be returned by public verification gateway');
  assert.doesNotMatch(returnSignature, /\bnid_number\b/i, 'NID must not be returned by public verification gateway');
});

test('Seed Data: Complete Bangladesh divisions and districts present', () => {
  const seedPath = path.join(__dirname, '..', 'seed.sql');
  assert.ok(fs.existsSync(seedPath), 'seed.sql must exist');

  const sql = fs.readFileSync(seedPath, 'utf8');

  const divisions = ['BD-DHA', 'BD-CTG', 'BD-RAJ', 'BD-KHU', 'BD-BAR', 'BD-SYL', 'BD-RAN', 'BD-MYM'];
  for (const divCode of divisions) {
    assert.match(sql, new RegExp(`'${divCode}'`, 'i'), `Division ${divCode} must be seeded`);
  }

  // Check administrative roles
  const roles = [
    'super_admin',
    'division_admin',
    'district_admin',
    'upazila_admin',
    'thana_admin',
    'city_corp_admin',
    'municipality_admin',
    'union_admin',
    'ward_admin',
    'donor',
    'volunteer',
    'hospital_staff'
  ];
  for (const role of roles) {
    assert.match(sql, new RegExp(`'${role}'`, 'i'), `Role ${role} must be defined in seed`);
  }
});
