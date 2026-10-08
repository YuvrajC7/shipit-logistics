/**
 * Creates the DB trigger for auto-logging tracking events
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating DB Trigger for auto-tracking events...')

  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION log_shipment_status_change()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO tracking_events (id, "shipmentId", status, location, note, "createdAt")
        VALUES (
          gen_random_uuid(),
          NEW.id,
          NEW.status,
          'System Auto-Update',
          'Status updated to ' || NEW.status,
          now()
        );
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await prisma.$executeRawUnsafe(`
    DROP TRIGGER IF EXISTS trigger_log_shipment_status ON shipments;
  `)

  await prisma.$executeRawUnsafe(`
    CREATE TRIGGER trigger_log_shipment_status
    AFTER UPDATE OF status ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION log_shipment_status_change();
  `)

  console.log('✅ Trigger created successfully')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
