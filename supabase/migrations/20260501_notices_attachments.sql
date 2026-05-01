-- Update notices table to support attachments
ALTER TABLE notices ADD COLUMN IF NOT EXISTS attachment_url TEXT;

ALTER TABLE notices ADD COLUMN IF NOT EXISTS attachment_type TEXT;
-- 'image' or 'pdf'