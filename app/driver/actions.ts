"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function advanceShipmentStatus(formData: FormData) {
  const shipmentId = formData.get("shipmentId") as string;
  const currentStatus = formData.get("currentStatus") as string;
  const destCity = formData.get("destCity") as string;

  let nextStatus: "OUT_FOR_DELIVERY" | "DELIVERED" = "OUT_FOR_DELIVERY";
  let note = "Out for delivery.";

  if (currentStatus === "OUT_FOR_DELIVERY") {
    nextStatus = "DELIVERED";
    note = "Package has been successfully delivered.";
  }

  // If it's already delivered, do nothing
  if (currentStatus === "DELIVERED") return;

  await prisma.shipment.update({
    where: { id: shipmentId },
    data: {
      status: nextStatus,
      trackingEvents: {
        create: {
          note,
          location: destCity,
          status: nextStatus
        }
      }
    }
  });

  // If we just delivered it, let's also free up the driver (simplification)
  if (nextStatus === "DELIVERED") {
    const ship = await prisma.shipment.findUnique({ where: { id: shipmentId } });
    if (ship?.driverId) {
      // Check if driver has other active shipments
      const activeCount = await prisma.shipment.count({
        where: { driverId: ship.driverId, status: { in: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'] } }
      });
      if (activeCount === 0) {
        await prisma.driver.update({ where: { id: ship.driverId }, data: { availability: true } });
        if (ship.vehicleId) {
          await prisma.vehicle.update({ where: { id: ship.vehicleId }, data: { status: 'AVAILABLE' } });
        }
      }
    }
  }

  revalidatePath("/driver");
}
