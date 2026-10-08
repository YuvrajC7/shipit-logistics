"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function assignDriverAction(shipmentId: string, driverId: string) {
  await prisma.shipment.update({
    where: { id: shipmentId },
    data: { 
      driverId,
      status: "PICKED_UP"
    }
  });

  await prisma.driver.update({
    where: { id: driverId },
    data: { availability: false }
  });

  revalidatePath("/dispatcher");
}
