"use server";

import { PrismaClient, ShipmentStatus } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function bookShipment(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const originCity = formData.get("originCity") as string;
  const destCity = formData.get("destCity") as string;
  const receiverName = formData.get("receiverName") as string;
  const receiverPhone = formData.get("receiverPhone") as string;
  const weightKg = parseFloat(formData.get("weightKg") as string);
  const serviceType = formData.get("serviceType") as "STANDARD" | "EXPRESS" | "SAME_DAY";
  const notes = formData.get("notes") as string;

  // Calculate generic charge based on weight and service type
  let baseCharge = weightKg * 50; // 50 INR per kg
  if (serviceType === "EXPRESS") baseCharge *= 1.5;
  if (serviceType === "SAME_DAY") baseCharge *= 2.5;

  const trackingNo = "TRK" + Math.random().toString().substring(2, 10).toUpperCase();

  // Auto-dispatch logic: Find available driver and vehicle
  const availableDriver = await prisma.driver.findFirst({ where: { availability: true } });
  const availableVehicle = await prisma.vehicle.findFirst({ where: { status: 'AVAILABLE' } });

  const isAutoDispatched = availableDriver && availableVehicle;
  const finalStatus: ShipmentStatus = isAutoDispatched ? "IN_TRANSIT" : "CREATED";

  const trackingEventsData: { note: string; location: string; status: ShipmentStatus }[] = [
    { note: "Shipment details received and label generated.", location: originCity, status: "CREATED" }
  ];

  if (isAutoDispatched) {
    trackingEventsData.push({ note: "Auto-dispatched to driver.", location: originCity, status: "PICKED_UP" });
    trackingEventsData.push({ note: "Package is in transit.", location: originCity, status: "IN_TRANSIT" });
    
    // Mark driver and vehicle as busy
    await prisma.driver.update({ where: { id: availableDriver.id }, data: { availability: false } });
    await prisma.vehicle.update({ where: { id: availableVehicle.id }, data: { status: 'ON_TRIP' } });
  }

  await prisma.shipment.create({
    data: {
      trackingNo,
      senderId: user.id,
      driverId: availableDriver?.id || null,
      vehicleId: availableVehicle?.id || null,
      originCity,
      destCity,
      receiverName,
      receiverPhone,
      weightKg,
      charge: baseCharge,
      serviceType,
      notes,
      status: finalStatus,
      trackingEvents: {
        create: trackingEventsData
      }
    }
  });

  redirect("/customer");
}
