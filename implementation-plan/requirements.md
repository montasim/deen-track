# Campaign Management System - Requirements

## Overview
Build a task-based campaign management SaaS application where users can join campaigns, complete tasks, submit proofs (images, audio, URLs), and earn achievements. Admins verify submissions manually (with future auto-validation capability).

---

## 1. Functional Requirements

### 1.1 Campaign Management
- [x] Create gamified campaigns with multiple tasks
- [ ] Campaigns have start/end dates
- [ ] Campaigns can have max participants limit
- [ ] Campaigns can be active/inactive
- [ ] Users can browse available campaigns
- [ ] Users can join campaigns
- [ ] Campaigns display participant count and available points

### 1.2 Task Management
- [ ] Create individual tasks with:
  - Name and description
  - Rules and disqualification rules
  - Start/end dates
  - Validation type (MANUAL, AUTO, ADMIN)
  - Associated achievements
- [ ] Tasks can be added to campaigns
- [ ] Tasks can be reordered within campaigns
- [ ] Tasks can be reused across campaigns

### 1.3 Achievement System
- [ ] Each task has one or more achievements
- [ ] Achievements have:
  - Name and description
  - Points value
  - Icon/image
  - "How to achieve" instructions
- [ ] Points are awarded when submissions are approved
- [ ] Progress tracking per campaign

### 1.4 User Submissions
- [ ] Users can submit proofs for tasks:
  - Image files
  - Audio files
  - URL links
  - Text descriptions
- [ ] Submissions have status tracking:
  - DRAFT (user working on it)
  - SUBMITTED (awaiting review)
  - APPROVED (completed)
  - REJECTED (needs revision)
  - RESUBMIT (needs resubmission)
- [ ] Users can submit notes with their proofs
- [ ] Users can view their submission history

### 1.5 Admin Verification
- [ ] Admin can view pending submissions
- [ ] Admin can approve proofs
- [ ] Admin can reject proofs with reason
- [ ] Admin can add notes to proofs
- [ ] Notifications sent to users on approval/rejection
- [ ] Points awarded automatically on approval

### 1.6 Progress Tracking
- [ ] Users can view:
  - Joined campaigns
  - Completed tasks
  - Pending submissions
  - Total points earned
  - Campaign leaderboard
- [ ] Campaign participation status:
  - JOINED
  - IN_PROGRESS
  - COMPLETED
  - DISQUALIFIED

### 1.7 Task Dependencies
- [ ] Tasks can have dependencies on other tasks
- [ ] Users must complete prerequisite tasks before unlocking dependent tasks
- [ ] Visual indicator of locked/unlocked tasks
- [ ] Task dependency chain visualization
- [ ] Admin can set dependency rules (all must complete / any one required)

### 1.8 Team Campaigns
- [ ] Users can create or join teams
- [ ] Teams can participate in campaigns together
- [ ] Team progress tracking (collective submissions)
- [ ] Team leaderboards
- [ ] Team member roles (Captain, Member)
- [ ] Team chat/discussion for campaigns

### 1.9 Leaderboards
- [ ] Global leaderboard across all campaigns
- [ ] Per-campaign leaderboard
- [ ] Team leaderboard
- [ ] Time-based filtering (all time, weekly, monthly)
- [ ] Ranking by points, tasks completed, streaks
- [ ] User's rank visualization with progress to next rank

### 1.10 Campaign Templates
- [ ] Admin can create reusable campaign templates
- [ ] Templates include task definitions and achievements
- [ ] Campaigns can be created from templates
- [ ] Templates can be duplicated and customized
- [ ] Template categories/tags for organization

---

## 2. Non-Functional Requirements

### 2.1 Scalability
- [ ] Proper database indexing for high-traffic queries
- [ ] Pagination for submission lists
- [ ] Caching strategy for campaign data
- [ ] File upload optimization

### 2.2 Security
- [ ] Role-based access control (USER, ADMIN, SUPER_ADMIN)
- [ ] File upload validation
- [ ] SQL injection prevention
- [ ] XSS prevention in user inputs

### 2.3 Usability
- [ ] Mobile-responsive design
- [ ] Intuitive submission flow
- [ ] Clear status indicators
- [ ] Helpful error messages

### 2.4 Extensibility
- [ ] Design for future AI/ML auto-validation
- [ ] Plugin architecture for validation types
- [ ] API-first design for mobile apps

---

## 3. Data Models

### 3.1 Core Entities

**GamifiedCampaign**
- id, name, description
- startDate, endDate
- isActive, maxParticipants
- imageUrl, directImageUrl
- entryById, createdAt, updatedAt

**CampaignTask**
- id, name, description
- rules, disqualificationRules
- startDate, endDate
- validationType (AUTO, MANUAL, ADMIN)
- imageUrl, directImageUrl
- entryById, createdAt, updatedAt

**TaskAchievement**
- id, taskId
- name, description
- points, icon, imageUrl
- howToAchieve, order

**CampaignToTask** (Junction)
- id, campaignId, taskId
- order

**UserCampaignProgress**
- id, userId, campaignId
- status (JOINED, IN_PROGRESS, COMPLETED, DISQUALIFIED)
- joinedAt, completedAt, totalPoints

**UserTaskSubmission**
- id, userId, taskId, campaignId, progressId
- status (DRAFT, SUBMITTED, APPROVED, REJECTED, RESUBMIT)
- submittedAt, reviewedAt, reviewedById
- feedback

**ProofSubmission**
- id, submissionId
- type (IMAGE, AUDIO, URL, TEXT)
- fileUrl, directFileUrl, url, text
- validationStatus (PENDING, APPROVED, REJECTED, NEEDS_INFO)
- validatedAt, validatedById, adminNotes

**TaskDependency**
- id, taskId, dependsOnTaskId
- dependencyType (ALL, ANY) - ALL: all prerequisites must complete, ANY: at least one
- order - sequence number for visual ordering

**Team**
- id, name, description, imageUrl, directImageUrl
- captainId (user who created team)
- maxMembers, isActive
- createdAt, updatedAt

**TeamMembership**
- id, teamId, userId, role (CAPTAIN, MEMBER)
- joinedAt, pointsContributed

**TeamCampaignProgress**
- id, teamId, campaignId
- status (JOINED, IN_PROGRESS, COMPLETED, DISQUALIFIED)
- joinedAt, completedAt, totalPoints, totalTasksCompleted

**CampaignTemplate**
- id, name, description, category
- isPublic, isSystemTemplate
- estimatedDuration, difficulty
- createdAt, updatedAt, entryById

**TemplateTask**
- id, templateId, name, description, rules
- order, achievementsTemplate
- createdAt, updatedAt

---

## 4. API Endpoints (Server Actions)

### 4.1 Public/User Actions
- `getActiveGamifiedCampaigns()` - List active campaigns
- `joinCampaign(campaignId)` - Join a campaign
- `submitTaskProof(data)` - Submit task proof
- `getUserCampaignProgress()` - Get user's progress
- `getUserSubmissions()` - Get user's submissions

### 4.2 Admin Actions
- `approveProof(proofId, adminNotes)` - Approve a proof
- `rejectProof(proofId, reason)` - Reject a proof
- `getPendingSubmissions(filters)` - Get pending submissions
- `getPendingProofs(page, limit)` - Get pending proofs

### 4.3 Team Actions
- `createTeam(data)` - Create a new team
- `joinTeam(teamId)` - Join a team
- `leaveTeam(teamId)` - Leave a team
- `inviteToTeam(teamId, userId)` - Invite user to team
- `getTeamMembers(teamId)` - Get team members
- `getTeamProgress(teamId, campaignId)` - Get team's campaign progress
- `joinCampaignAsTeam(campaignId, teamId)` - Join campaign as team

### 4.4 Leaderboard Actions
- `getGlobalLeaderboard(filters)` - Get global rankings
- `getCampaignLeaderboard(campaignId, filters)` - Get campaign rankings
- `getTeamLeaderboard(campaignId, filters)` - Get team rankings
- `getUserRank(userId, campaignId?)` - Get user's rank
- `getTeamRank(teamId, campaignId?)` - Get team's rank

### 4.5 Template Actions
- `createCampaignTemplate(data)` - Create template
- `getCampaignTemplates(filters)` - List templates
- `createCampaignFromTemplate(templateId, data)` - Create campaign from template
- `duplicateTemplate(templateId)` - Duplicate template
- `updateTemplate(templateId, data)` - Update template
- `deleteTemplate(templateId)` - Delete template

---

## 5. UI Components Required

### 5.1 Campaign Views
- [ ] CampaignCard - Display campaign overview
- [ ] CampaignList - Grid of available campaigns
- [ ] CampaignDetail - Full campaign details
- [ ] CampaignLeaderboard - Participant rankings

### 5.2 Task Views
- [ ] TaskCard - Display task information
- [ ] TaskList - Tasks within a campaign
- [ ] TaskDetail - Full task details with rules

### 5.3 Submission Views
- [ ] SubmissionForm - Submit proof (file/URL/text)
- [ ] SubmissionHistory - User's past submissions
- [ ] SubmissionReview - Admin review interface
- [ ] ProofViewer - Display submitted proofs

### 5.4 Progress Views
- [ ] UserProgress - User's overall progress
- [ ] CampaignProgress - Progress within a campaign
- [ ] AchievementDisplay - Show earned achievements
- [ ] PointsTracker - Display total points

### 5.5 Task Dependency Views
- [ ] TaskDependencyTree - Visual tree of task dependencies
- [ ] LockedTaskCard - Show locked tasks with prerequisites
- [ ] TaskProgressFlow - Flow diagram of task completion path

### 5.6 Team Views
- [ ] TeamCard - Display team overview
- [ ] TeamList - List of available teams
- [ ] TeamDetail - Full team details with members
- [ ] TeamCreateForm - Create new team
- [ ] TeamJoinDialog - Join team dialog
- [ ] TeamProgress - Team's campaign progress
- [ ] TeamLeaderboard - Team rankings

### 5.7 Leaderboard Views
- [ ] LeaderboardTable - Rankings table with user/team info
- [ ] LeaderboardFilters - Filter by time period, campaign
- [ ] UserRankCard - User's current rank with progress
- [ ] TopPerformers - Top 3 podium display
- [ ] RankChangeIndicator - Show rank movement

### 5.8 Template Views
- [ ] TemplateCard - Display template overview
- [ ] TemplateList - Grid/list of templates
- [ ] TemplatePreview - Preview template details
- [ ] TemplateCreateForm - Create/edit template
- [ ] TemplateUseDialog - Create campaign from template

---

## 6. Integration Points

### 6.1 Existing Systems
- **Authentication** - Use existing session management
- **Notifications** - Use existing notification system
- **Activity Logging** - Log all campaign activities
- **File Upload** - Use existing Google Drive integration
- **Achievements** - Integrate with existing achievement system

### 6.2 New Systems
- **Validation Service** - Future AI/ML validation
- **Leaderboard Service** - Ranking calculations
- **Points Service** - Points aggregation

---

## 7. Implementation Phases

### Phase 1: Database Schema ✅
- [x] Create Prisma models
- [x] Define enums
- [x] Set up relations
- [x] Run migrations

### Phase 2: Repository Layer ✅
- [x] Campaign repository
- [x] Task repository
- [x] Submission repository
- [x] Proof repository
- [x] Team repository
- [x] Leaderboard repository
- [x] Template repository

### Phase 3: Server Actions ✅
- [x] User actions (join, submit)
- [x] Admin actions (approve, reject)
- [x] Query actions (list, get)
- [x] Team actions
- [x] Leaderboard actions
- [x] Template actions

### Phase 4: Validation & Security ✅
- [x] Zod schemas
- [x] Input validation
- [x] Authorization checks

### Phase 5: UI Components ✅
- [x] Campaign cards and lists
- [x] Submission forms
- [x] Admin verification UI
- [x] Progress tracking UI
- [x] Team components
- [x] Leaderboard components
- [x] Template components
- [x] Task detail dialog

### Phase 6: Pages & Routes ✅
- [x] Campaign browse page
- [x] Campaign detail page
- [x] User progress page
- [x] Admin verification page
- [x] Teams pages
- [x] Template management pages
- [x] Leaderboard pages

### Phase 7: Testing & Polish
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance optimization

---

## 8. Future Enhancements (Out of Scope)

1. **AI/ML Auto-Validation** - Integrate with AI services for image/URL verification
2. **Social Sharing** - Share achievements on social media
3. **Real-time Updates** - WebSocket integration for live progress updates
4. **Mobile Apps** - Native iOS/Android applications
5. **Advanced Analytics** - Detailed engagement analytics and insights
6. **Gamification Enhancements** - Streaks, badges, daily challenges
7. **Campaign Marketplace** - User-generated campaigns marketplace
