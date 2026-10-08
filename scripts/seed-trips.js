const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get all drivers
  const drivers = await prisma.driver.findMany();
  if (drivers.length === 0) {
    console.log("No drivers found. Creating one...");
  }

  // Also get the first user to act as a sender
  const sender = await prisma.user.findFirst();
  if (!sender) {
    console.log("No users found.");
    return;
  }

  for (const driver of drivers) {
    // Check if this driver already has shipments
    const existing = await prisma.shipment.count({ where: { driverId: driver.id } });
    if (existing > 0) continue;

    console.log(`Creating shipments for driver: ${driver.id}`);
    
    await prisma.shipment.create({
      data: {
        trackingNo: "TRK" + Math.random().toString().substring(2, 10).toUpperCase(),
        senderId: sender.id,
        driverId: driver.id,
        originCity: "Mumbai",
        destCity: "Pune",
        receiverName: "Rahul Sharma",
        receiverPhone: "+91 9876543210",
        weightKg: 12.5,
        charge: 800,
        serviceType: "STANDARD",
        status: "IN_TRANSIT",
        notes: "Deliver to back door.",
        trackingEvents: {
          create: [
            { note: "Shipment details received.", location: "Mumbai", status: "CREATED" },
            { note: "Picked up by driver.", location: "Mumbai", status: "PICKED_UP" },
            { note: "In transit to destination.", location: "Navi Mumbai", status: "IN_TRANSIT" }
          ]
        }
      }
    });

    await prisma.shipment.create({
      data: {
        trackingNo: "TRK" + Math.random().toString().substring(2, 10).toUpperCase(),
        senderId: sender.id,
        driverId: driver.id,
        originCity: "Delhi",
        destCity: "Jaipur",
        receiverName: "Anita Desai",
        receiverPhone: "+91 8876543211",
        weightKg: 3.0,
        charge: 450,
        serviceType: "EXPRESS",
        status: "OUT_FOR_DELIVERY",
        notes: "Call before reaching.",
        trackingEvents: {
          create: [
            { note: "Shipment details received.", location: "Delhi", status: "CREATED" },
            { note: "Out for delivery.", location: "Jaipur", status: "OUT_FOR_DELIVERY" }
          ]
        }
      }
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
