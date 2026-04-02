-- Prevent UPDATE and DELETE on billing_override table.
-- BillingOverride records are IMMUTABLE — append-only audit trail.
CREATE OR REPLACE FUNCTION prevent_billing_override_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'billing_override records are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER billing_override_immutable
  BEFORE UPDATE OR DELETE ON billing_override
  FOR EACH ROW
  EXECUTE FUNCTION prevent_billing_override_mutation();
