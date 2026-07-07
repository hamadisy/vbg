// Distinct from CaseStatus: this is the qualitative result recorded by whoever
// is following up, not the system workflow stage - see spec "Follow-up Entry".
export enum FollowUpOutcome {
  CommunityResolution = 'community_resolution',
  ReferredToJustice = 'referred_to_justice',
  InProcess = 'in_process',
  Other = 'other',
}
