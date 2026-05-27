create table if not exists users (
    id uuid primary key,
    email varchar(320) not null unique,
    password_hash varchar(255) not null,
    display_name varchar(120) not null,
    skills text not null default '',
    goal text not null default '',
    weekly_hours integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists growth (
    user_id uuid primary key references users(id) on delete cascade,
    xp integer not null default 0,
    level integer not null default 1,
    streak_days integer not null default 0,
    achievements text not null default '',
    activity_log text not null default ''
);

create table if not exists notifications (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    type varchar(80) not null,
    message text not null,
    read boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_read on notifications(user_id, read);

create table if not exists roadmaps (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    target_role varchar(160) not null,
    weekly_hours integer not null,
    active boolean not null,
    created_at timestamptz not null default now()
);

create unique index if not exists ux_roadmaps_one_active
    on roadmaps(user_id)
    where active;

create table if not exists roadmap_tasks (
    id uuid primary key,
    roadmap_id uuid not null references roadmaps(id) on delete cascade,
    week integer not null,
    title text not null,
    completed boolean not null default false
);

create table if not exists coach_sessions (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    title varchar(160) not null,
    context_type varchar(60),
    created_at timestamptz not null default now()
);

create table if not exists chat_messages (
    id uuid primary key,
    session_id uuid not null references coach_sessions(id) on delete cascade,
    role varchar(20) not null,
    content text not null,
    created_at timestamptz not null default now()
);

create index if not exists idx_chat_messages_session on chat_messages(session_id, created_at);

create table if not exists projects (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    name varchar(200) not null,
    type varchar(80) not null,
    status varchar(40) not null,
    created_at timestamptz not null default now()
);

create table if not exists project_tasks (
    id uuid primary key,
    project_id uuid not null references projects(id) on delete cascade,
    title text not null,
    completed boolean not null default false
);

create table if not exists code_reviews (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    language varchar(80) not null,
    score integer not null,
    suggestions text not null,
    created_at timestamptz not null default now()
);
