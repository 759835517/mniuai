-- V16__hls_video_support.sql
-- HLS 流播放支持：为 lessons 表添加 hls_manifest_url 字段
-- 当 hls_manifest_url 不为空时，前端使用 hls.js 播放 m3u8 流；否则 fallback 到 video_url 直接播放 MP4

ALTER TABLE lessons ADD COLUMN IF NOT EXISTS hls_manifest_url TEXT;
COMMENT ON COLUMN lessons.hls_manifest_url IS 'HLS m3u8 manifest URL. If set, frontend uses hls.js for streaming; otherwise falls back to video_url (direct MP4).';
