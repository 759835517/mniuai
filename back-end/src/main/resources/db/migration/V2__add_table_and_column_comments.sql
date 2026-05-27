comment on table users is 'User account and learner profile table.';
comment on column users.id is 'Primary key: user id.';
comment on column users.email is 'Unique login email, normalized to lower case.';
comment on column users.password_hash is 'BCrypt password hash; never exposed in API responses.';
comment on column users.display_name is 'Display name shown in the application.';
comment on column users.skills is 'Newline-separated skill names for the MVP schema.';
comment on column users.goal is 'Current learning goal or target direction.';
comment on column users.weekly_hours is 'Weekly learning hours the user can invest.';
comment on column users.created_at is 'Row creation timestamp.';
comment on column users.updated_at is 'Last profile update timestamp.';

comment on table growth is 'User growth state including XP, level, streak, achievements and activity log.';
comment on column growth.user_id is 'Primary key and foreign key to users.id.';
comment on column growth.xp is 'Total experience points earned by the user.';
comment on column growth.level is 'Derived user level, currently xp / 100 + 1.';
comment on column growth.streak_days is 'Consecutive active days.';
comment on column growth.achievements is 'Newline-separated unlocked achievement codes for the MVP schema.';
comment on column growth.activity_log is 'Newline-separated activity event codes for the MVP schema.';

comment on table notifications is 'In-app notification table.';
comment on column notifications.id is 'Primary key: notification id.';
comment on column notifications.user_id is 'Owner user id.';
comment on column notifications.type is 'Notification category code.';
comment on column notifications.message is 'Human-readable notification message.';
comment on column notifications.read is 'Whether the notification has been read.';
comment on column notifications.created_at is 'Row creation timestamp.';

comment on table roadmaps is 'Generated learning roadmap table.';
comment on column roadmaps.id is 'Primary key: roadmap id.';
comment on column roadmaps.user_id is 'Owner user id.';
comment on column roadmaps.target_role is 'Target role or learning direction.';
comment on column roadmaps.weekly_hours is 'Weekly hours used when generating this roadmap.';
comment on column roadmaps.active is 'Whether this is the user active roadmap.';
comment on column roadmaps.created_at is 'Row creation timestamp.';

comment on table roadmap_tasks is 'Weekly task table for a learning roadmap.';
comment on column roadmap_tasks.id is 'Primary key: roadmap task id.';
comment on column roadmap_tasks.roadmap_id is 'Parent roadmap id.';
comment on column roadmap_tasks.week is 'Roadmap week number, starting from 1.';
comment on column roadmap_tasks.title is 'Task title.';
comment on column roadmap_tasks.completed is 'Completion state.';

comment on table coach_sessions is 'AI coach chat session table.';
comment on column coach_sessions.id is 'Primary key: coach session id.';
comment on column coach_sessions.user_id is 'Owner user id.';
comment on column coach_sessions.title is 'Session title.';
comment on column coach_sessions.context_type is 'Context type such as GENERAL, PROJECT or ROADMAP.';
comment on column coach_sessions.created_at is 'Row creation timestamp.';

comment on table chat_messages is 'Messages belonging to an AI coach session.';
comment on column chat_messages.id is 'Primary key: chat message id.';
comment on column chat_messages.session_id is 'Parent coach session id.';
comment on column chat_messages.role is 'Message role: user or assistant.';
comment on column chat_messages.content is 'Message body.';
comment on column chat_messages.created_at is 'Row creation timestamp.';

comment on table projects is 'AI project plan table.';
comment on column projects.id is 'Primary key: project id.';
comment on column projects.user_id is 'Owner user id.';
comment on column projects.name is 'Project name.';
comment on column projects.type is 'Project type such as RAG, AGENT, AI_SAAS or MCP_SERVER.';
comment on column projects.status is 'Project lifecycle status.';
comment on column projects.created_at is 'Row creation timestamp.';

comment on table project_tasks is 'Checklist tasks for an AI project plan.';
comment on column project_tasks.id is 'Primary key: project task id.';
comment on column project_tasks.project_id is 'Parent project id.';
comment on column project_tasks.title is 'Task title.';
comment on column project_tasks.completed is 'Completion state.';

comment on table code_reviews is 'AI code review result table.';
comment on column code_reviews.id is 'Primary key: code review id.';
comment on column code_reviews.user_id is 'Owner user id.';
comment on column code_reviews.language is 'Source language label submitted by the user.';
comment on column code_reviews.score is 'Numeric review score from 0 to 100.';
comment on column code_reviews.suggestions is 'Newline-separated review suggestions for the MVP schema.';
comment on column code_reviews.created_at is 'Row creation timestamp.';
