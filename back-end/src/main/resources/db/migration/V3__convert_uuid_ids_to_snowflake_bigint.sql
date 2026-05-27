do $$
declare
    users_id_type text;
begin
    select data_type
    into users_id_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'id';

    if users_id_type <> 'uuid' then
        return;
    end if;

    create temporary sequence if not exists mniu_snowflake_migration_seq;

    create or replace function pg_temp.next_mniu_snowflake_id()
        returns bigint
        language plpgsql
    as $fn$
    declare
        epoch_ms constant bigint := 1767225600000;
        base_ms bigint;
        seq bigint;
    begin
        seq := nextval('mniu_snowflake_migration_seq') - 1;
        base_ms := floor(extract(epoch from clock_timestamp()) * 1000)::bigint - epoch_ms;
        return ((base_ms + (seq / 4096)) << 22) | (1 << 12) | (seq % 4096);
    end;
    $fn$;

    create temporary table users_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from users;
    create temporary table notifications_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from notifications;
    create temporary table roadmaps_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from roadmaps;
    create temporary table roadmap_tasks_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from roadmap_tasks;
    create temporary table coach_sessions_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from coach_sessions;
    create temporary table chat_messages_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from chat_messages;
    create temporary table projects_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from projects;
    create temporary table project_tasks_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from project_tasks;
    create temporary table code_reviews_id_map as select id old_id, pg_temp.next_mniu_snowflake_id() new_id from code_reviews;

    alter table growth drop constraint if exists growth_user_id_fkey;
    alter table notifications drop constraint if exists notifications_user_id_fkey;
    alter table roadmaps drop constraint if exists roadmaps_user_id_fkey;
    alter table roadmap_tasks drop constraint if exists roadmap_tasks_roadmap_id_fkey;
    alter table coach_sessions drop constraint if exists coach_sessions_user_id_fkey;
    alter table chat_messages drop constraint if exists chat_messages_session_id_fkey;
    alter table projects drop constraint if exists projects_user_id_fkey;
    alter table project_tasks drop constraint if exists project_tasks_project_id_fkey;
    alter table code_reviews drop constraint if exists code_reviews_user_id_fkey;

    alter table users drop constraint if exists users_pkey;
    alter table growth drop constraint if exists growth_pkey;
    alter table notifications drop constraint if exists notifications_pkey;
    alter table roadmaps drop constraint if exists roadmaps_pkey;
    alter table roadmap_tasks drop constraint if exists roadmap_tasks_pkey;
    alter table coach_sessions drop constraint if exists coach_sessions_pkey;
    alter table chat_messages drop constraint if exists chat_messages_pkey;
    alter table projects drop constraint if exists projects_pkey;
    alter table project_tasks drop constraint if exists project_tasks_pkey;
    alter table code_reviews drop constraint if exists code_reviews_pkey;

    drop index if exists idx_notifications_user_read;
    drop index if exists ux_roadmaps_one_active;
    drop index if exists idx_chat_messages_session;

    alter table users add column snowflake_id bigint;
    update users t set snowflake_id = m.new_id from users_id_map m where t.id = m.old_id;
    alter table users drop column id;
    alter table users rename column snowflake_id to id;
    alter table users alter column id set not null;
    alter table users add primary key (id);

    alter table growth add column snowflake_user_id bigint;
    update growth t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table growth drop column user_id;
    alter table growth rename column snowflake_user_id to user_id;
    alter table growth alter column user_id set not null;
    alter table growth add primary key (user_id);
    alter table growth add constraint growth_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    alter table notifications add column snowflake_id bigint;
    alter table notifications add column snowflake_user_id bigint;
    update notifications t set snowflake_id = m.new_id from notifications_id_map m where t.id = m.old_id;
    update notifications t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table notifications drop column id;
    alter table notifications drop column user_id;
    alter table notifications rename column snowflake_id to id;
    alter table notifications rename column snowflake_user_id to user_id;
    alter table notifications alter column id set not null;
    alter table notifications alter column user_id set not null;
    alter table notifications add primary key (id);
    alter table notifications add constraint notifications_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    alter table roadmaps add column snowflake_id bigint;
    alter table roadmaps add column snowflake_user_id bigint;
    update roadmaps t set snowflake_id = m.new_id from roadmaps_id_map m where t.id = m.old_id;
    update roadmaps t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table roadmaps drop column id;
    alter table roadmaps drop column user_id;
    alter table roadmaps rename column snowflake_id to id;
    alter table roadmaps rename column snowflake_user_id to user_id;
    alter table roadmaps alter column id set not null;
    alter table roadmaps alter column user_id set not null;
    alter table roadmaps add primary key (id);
    alter table roadmaps add constraint roadmaps_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    alter table roadmap_tasks add column snowflake_id bigint;
    alter table roadmap_tasks add column snowflake_roadmap_id bigint;
    update roadmap_tasks t set snowflake_id = m.new_id from roadmap_tasks_id_map m where t.id = m.old_id;
    update roadmap_tasks t set snowflake_roadmap_id = m.new_id from roadmaps_id_map m where t.roadmap_id = m.old_id;
    alter table roadmap_tasks drop column id;
    alter table roadmap_tasks drop column roadmap_id;
    alter table roadmap_tasks rename column snowflake_id to id;
    alter table roadmap_tasks rename column snowflake_roadmap_id to roadmap_id;
    alter table roadmap_tasks alter column id set not null;
    alter table roadmap_tasks alter column roadmap_id set not null;
    alter table roadmap_tasks add primary key (id);
    alter table roadmap_tasks add constraint roadmap_tasks_roadmap_id_fkey foreign key (roadmap_id) references roadmaps(id) on delete cascade;

    alter table coach_sessions add column snowflake_id bigint;
    alter table coach_sessions add column snowflake_user_id bigint;
    update coach_sessions t set snowflake_id = m.new_id from coach_sessions_id_map m where t.id = m.old_id;
    update coach_sessions t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table coach_sessions drop column id;
    alter table coach_sessions drop column user_id;
    alter table coach_sessions rename column snowflake_id to id;
    alter table coach_sessions rename column snowflake_user_id to user_id;
    alter table coach_sessions alter column id set not null;
    alter table coach_sessions alter column user_id set not null;
    alter table coach_sessions add primary key (id);
    alter table coach_sessions add constraint coach_sessions_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    alter table chat_messages add column snowflake_id bigint;
    alter table chat_messages add column snowflake_session_id bigint;
    update chat_messages t set snowflake_id = m.new_id from chat_messages_id_map m where t.id = m.old_id;
    update chat_messages t set snowflake_session_id = m.new_id from coach_sessions_id_map m where t.session_id = m.old_id;
    alter table chat_messages drop column id;
    alter table chat_messages drop column session_id;
    alter table chat_messages rename column snowflake_id to id;
    alter table chat_messages rename column snowflake_session_id to session_id;
    alter table chat_messages alter column id set not null;
    alter table chat_messages alter column session_id set not null;
    alter table chat_messages add primary key (id);
    alter table chat_messages add constraint chat_messages_session_id_fkey foreign key (session_id) references coach_sessions(id) on delete cascade;

    alter table projects add column snowflake_id bigint;
    alter table projects add column snowflake_user_id bigint;
    update projects t set snowflake_id = m.new_id from projects_id_map m where t.id = m.old_id;
    update projects t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table projects drop column id;
    alter table projects drop column user_id;
    alter table projects rename column snowflake_id to id;
    alter table projects rename column snowflake_user_id to user_id;
    alter table projects alter column id set not null;
    alter table projects alter column user_id set not null;
    alter table projects add primary key (id);
    alter table projects add constraint projects_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    alter table project_tasks add column snowflake_id bigint;
    alter table project_tasks add column snowflake_project_id bigint;
    update project_tasks t set snowflake_id = m.new_id from project_tasks_id_map m where t.id = m.old_id;
    update project_tasks t set snowflake_project_id = m.new_id from projects_id_map m where t.project_id = m.old_id;
    alter table project_tasks drop column id;
    alter table project_tasks drop column project_id;
    alter table project_tasks rename column snowflake_id to id;
    alter table project_tasks rename column snowflake_project_id to project_id;
    alter table project_tasks alter column id set not null;
    alter table project_tasks alter column project_id set not null;
    alter table project_tasks add primary key (id);
    alter table project_tasks add constraint project_tasks_project_id_fkey foreign key (project_id) references projects(id) on delete cascade;

    alter table code_reviews add column snowflake_id bigint;
    alter table code_reviews add column snowflake_user_id bigint;
    update code_reviews t set snowflake_id = m.new_id from code_reviews_id_map m where t.id = m.old_id;
    update code_reviews t set snowflake_user_id = m.new_id from users_id_map m where t.user_id = m.old_id;
    alter table code_reviews drop column id;
    alter table code_reviews drop column user_id;
    alter table code_reviews rename column snowflake_id to id;
    alter table code_reviews rename column snowflake_user_id to user_id;
    alter table code_reviews alter column id set not null;
    alter table code_reviews alter column user_id set not null;
    alter table code_reviews add primary key (id);
    alter table code_reviews add constraint code_reviews_user_id_fkey foreign key (user_id) references users(id) on delete cascade;

    create index if not exists idx_notifications_user_read on notifications(user_id, read);
    create unique index if not exists ux_roadmaps_one_active on roadmaps(user_id) where active;
    create index if not exists idx_chat_messages_session on chat_messages(session_id, created_at);

    comment on column users.id is 'Primary key: user snowflake id.';
    comment on column growth.user_id is 'Primary key and foreign key to users.id snowflake id.';
    comment on column notifications.id is 'Primary key: notification snowflake id.';
    comment on column notifications.user_id is 'Owner user snowflake id.';
    comment on column roadmaps.id is 'Primary key: roadmap snowflake id.';
    comment on column roadmaps.user_id is 'Owner user snowflake id.';
    comment on column roadmap_tasks.id is 'Primary key: roadmap task snowflake id.';
    comment on column roadmap_tasks.roadmap_id is 'Parent roadmap snowflake id.';
    comment on column coach_sessions.id is 'Primary key: coach session snowflake id.';
    comment on column coach_sessions.user_id is 'Owner user snowflake id.';
    comment on column chat_messages.id is 'Primary key: chat message snowflake id.';
    comment on column chat_messages.session_id is 'Parent coach session snowflake id.';
    comment on column projects.id is 'Primary key: project snowflake id.';
    comment on column projects.user_id is 'Owner user snowflake id.';
    comment on column project_tasks.id is 'Primary key: project task snowflake id.';
    comment on column project_tasks.project_id is 'Parent project snowflake id.';
    comment on column code_reviews.id is 'Primary key: code review snowflake id.';
    comment on column code_reviews.user_id is 'Owner user snowflake id.';
end $$;
