"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addVehicleAction(formData: FormData) {
  const plateNo = formData.get("plateNo") as string;
  const type = formData.get("type") as string;
  const capacity = Number(formData.get("capacity"));

  await prisma.vehicle.create({
    data: {
      plateNo: plateNo.toUpperCase(),
      type: type,
      capacityKg: capacity,
      status: "AVAILABLE",
    }
  });

  revalidatePath("/admin/fleet");
}
