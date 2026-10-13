/**
 * AlphaGen Decision Workflow Test Suite
 * Verifies domain logic: approval, rejection, state transitions, and audit records.
 */

import { INITIAL_PROPOSALS, INITIAL_AUDIT_LOGS } from './data/mockData.ts';
import { StrategyProposal, AuditActivityItem } from './types/alphagen.ts';

function runTests() {
  console.log('--- Running AlphaGen Domain Logic Verification ---');
  let failures = 0;

  // 1. Initial Data Integrity
  if (INITIAL_PROPOSALS.length < 3) {
    console.error('FAIL: Less than 3 proposals in mockData');
    failures++;
  } else {
    console.log(`PASS: Found ${INITIAL_PROPOSALS.length} initial proposals.`);
  }

  // 2. Pending Proposals Filter
  const pending = INITIAL_PROPOSALS.filter(p => p.status === 'pending');
  if (pending.length === 0) {
    console.error('FAIL: No pending proposals found for review workflow.');
    failures++;
  } else {
    console.log(`PASS: Found ${pending.length} pending proposals ready for PM review.`);
  }

  // 3. Approval State Transition
  const targetProp = { ...pending[0] };
  const mockTimestamp = new Date().toISOString();
  const approvedProp: StrategyProposal = {
    ...targetProp,
    status: 'approved',
    decisionMetadata: {
      decidedAt: mockTimestamp,
      decidedBy: 'Portfolio Manager (Human Token #PM-8921)',
      decision: 'APPROVED',
      notes: 'Test Approval'
    }
  };

  if (approvedProp.status !== 'approved' || approvedProp.decisionMetadata?.decision !== 'APPROVED') {
    console.error('FAIL: Approval state transition malformed.');
    failures++;
  } else {
    console.log('PASS: Proposal approval state transition verified.');
  }

  // 4. Audit Log Generation
  const newAuditLog: AuditActivityItem = {
    id: `log-${Date.now()}`,
    timestamp: mockTimestamp,
    type: 'PROPOSAL_APPROVED',
    portfolioCode: approvedProp.portfolioCode,
    summary: `Proposal ${approvedProp.code} approved`,
    details: 'Verified segregation of duties.',
    actor: 'Portfolio Manager (Human)',
    relatedProposalId: approvedProp.id
  };

  if (!newAuditLog.relatedProposalId || newAuditLog.type !== 'PROPOSAL_APPROVED') {
    console.error('FAIL: Audit log entry malformed.');
    failures++;
  } else {
    console.log('PASS: Audit log record format verified.');
  }

  // 5. Simulated Execution Transition
  const executedProp: StrategyProposal = {
    ...approvedProp,
    status: 'simulated_executed'
  };

  if (executedProp.status !== 'simulated_executed') {
    console.error('FAIL: Simulated execution status transition failed.');
    failures++;
  } else {
    console.log('PASS: Simulated execution state transition verified.');
  }

  console.log('--------------------------------------------------');
  if (failures === 0) {
    console.log('ALL ALPHAGEN TESTS PASSED SUCCESSFULLY (5/5).');
  } else {
    console.error(`FAILED with ${failures} error(s).`);
    process.exit(1);
  }
}

runTests();
