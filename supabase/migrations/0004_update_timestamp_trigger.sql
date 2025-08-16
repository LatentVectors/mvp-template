-- Update updated_at trigger function to use statement_timestamp()
-- This ensures updated_at changes within a single transaction across statements

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = statement_timestamp();
    RETURN NEW;
END;
$$ language 'plpgsql';


