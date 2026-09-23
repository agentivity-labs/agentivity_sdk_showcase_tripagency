import type { AgUiChatMember, AgUiMemberAvatar } from '@agentivity-labs/sdk-react';
import { TRIP_MANAGER_AGENT_ID } from './config';

/** memberEntityId → avatar, for every member of the Trip Manager Team (see agentivity_service _data/agentic/Showcase). */
const AVATARS_BY_ID: Record<string, AgUiMemberAvatar> = {
  [TRIP_MANAGER_AGENT_ID]: { emoji: '🧭', color: '#171A1D' },
  '6f7781c8-c773-4568-a0d9-e13ddfd31a88': { emoji: '💳', color: '#E3A94F' }, // Payment Agent
  '1993f6d4-f9b9-469d-a425-91cb32d7bd46': { emoji: '✈️', color: '#3B7CF1' }, // Flight Specialist
  'bc9a6c36-7b4b-4c07-8819-1dc70e71fff4': { emoji: '🏨', color: '#F1633B' }, // Hotel Specialist
  '677bc558-75d4-42aa-b076-cf47da390dcf': { emoji: '🚗', color: '#4F8C82' }, // Car Rental Specialist
  '021488d1-8886-4ea3-9406-4863d69b220b': { emoji: '🍽️', color: '#C9506B' }, // Restaurant & Dining Specialist
  '7c8ce0cd-a41a-4786-91f5-a027a9a8c5b6': { emoji: '🚕', color: '#8B6B9C' }, // Ground Transport Specialist
  'deaa7e86-0e56-4358-bea4-1bca7a28e046': { emoji: '🛡️', color: '#5B7BA8' }, // Travel Insurance Specialist
  '1f17f5ac-b1c0-4149-b479-de64756020d5': { emoji: '🗺️', color: '#7A9B4F' }, // Activity Planner
  'ee454e22-6911-4b4d-a599-6fca7444e1a0': { emoji: '🛂', color: '#9C7B4F' }, // Visa & Documents Specialist
  'c1e9a393-c047-450b-a5bf-6da93b4fd442': { emoji: '💱', color: '#4F9C8E' }, // Currency & Budget Advisor
  'ce1ce75e-d0f1-47f2-b793-c764980b0d1f': { emoji: '🛎️', color: '#B0824F' }, // On-Trip Assistant / Concierge
};

/** Pass as `resolveMemberAvatar` on `<ChatDiscussion>` to show a per-specialist icon and color. */
export function resolveTripAvatar(member: AgUiChatMember): AgUiMemberAvatar | undefined {
  return member.memberEntityId ? AVATARS_BY_ID[member.memberEntityId] : undefined;
}
