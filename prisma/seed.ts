import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const prisma = new PrismaClient()

// ─── Helper ───────────────────────────────────────────────
async function createAuthUser(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (error) {
    if (error.message.includes('already been registered')) {
      const { data: list } = await supabase.auth.admin.listUsers()
      return list.users.find(u => u.email === email)!
    }
    throw error
  }
  return data.user!
}

async function main() {
  console.log('🚀 Seeding SwiftFreight database...\n')

  // ─── 1. Create Auth Users ───────────────────────────────
  console.log('Creating auth users...')

  const adminAuth    = await createAuthUser('admin@swiftfreight.com',      'Admin@1234',      'Aditya Sharma')
  const dispatchAuth = await createAuthUser('dispatch@swiftfreight.com',   'Dispatch@1234',   'Neha Kapoor')
  const driver1Auth  = await createAuthUser('raj.kumar@swiftfreight.com',  'Driver@1234',     'Raj Kumar')
  const driver2Auth  = await createAuthUser('priya.singh@swiftfreight.com','Driver@1234',     'Priya Singh')
  const driver3Auth  = await createAuthUser('arjun.mehta@swiftfreight.com','Driver@1234',     'Arjun Mehta')
  const cust1Auth    = await createAuthUser('techcorp@swiftfreight.com',   'Customer@1234',   'TechCorp India')
  const cust2Auth    = await createAuthUser('globex@swiftfreight.com',     'Customer@1234',   'Globex Exports')
  const cust3Auth    = await createAuthUser('fashionhub@swiftfreight.com', 'Customer@1234',   'FashionHub')
  const cust4Auth    = await createAuthUser('medisupply@swiftfreight.com', 'Customer@1234',   'MediSupply Co.')
  const cust5Auth    = await createAuthUser('homemart@swiftfreight.com',   'Customer@1234',   'HomeMart')

  console.log('✅ Auth users created\n')

  // ─── 2. Upsert User profiles ────────────────────────────
  console.log('Upserting user profiles...')

  await prisma.user.upsert({ where: { id: adminAuth.id },    update: {}, create: { id: adminAuth.id,    email: 'admin@swiftfreight.com',      fullName: 'Aditya Sharma',   phone: '+91-98100-11111', role: 'ADMIN' } })
  await prisma.user.upsert({ where: { id: dispatchAuth.id }, update: {}, create: { id: dispatchAuth.id, email: 'dispatch@swiftfreight.com',   fullName: 'Neha Kapoor',    phone: '+91-98100-22222', role: 'DISPATCHER' } })
  await prisma.user.upsert({ where: { id: driver1Auth.id },  update: {}, create: { id: driver1Auth.id,  email: 'raj.kumar@swiftfreight.com',  fullName: 'Raj Kumar',      phone: '+91-98100-33333', role: 'DRIVER' } })
  await prisma.user.upsert({ where: { id: driver2Auth.id },  update: {}, create: { id: driver2Auth.id,  email: 'priya.singh@swiftfreight.com',fullName: 'Priya Singh',    phone: '+91-98100-44444', role: 'DRIVER' } })
  await prisma.user.upsert({ where: { id: driver3Auth.id },  update: {}, create: { id: driver3Auth.id,  email: 'arjun.mehta@swiftfreight.com',fullName: 'Arjun Mehta',    phone: '+91-98100-55555', role: 'DRIVER' } })
  await prisma.user.upsert({ where: { id: cust1Auth.id },    update: {}, create: { id: cust1Auth.id,    email: 'techcorp@swiftfreight.com',   fullName: 'TechCorp India', phone: '+91-80-4567-1234', role: 'CUSTOMER' } })
  await prisma.user.upsert({ where: { id: cust2Auth.id },    update: {}, create: { id: cust2Auth.id,    email: 'globex@swiftfreight.com',     fullName: 'Globex Exports', phone: '+91-22-6754-9090', role: 'CUSTOMER' } })
  await prisma.user.upsert({ where: { id: cust3Auth.id },    update: {}, create: { id: cust3Auth.id,    email: 'fashionhub@swiftfreight.com', fullName: 'FashionHub',     phone: '+91-44-2345-6789', role: 'CUSTOMER' } })
  await prisma.user.upsert({ where: { id: cust4Auth.id },    update: {}, create: { id: cust4Auth.id,    email: 'medisupply@swiftfreight.com', fullName: 'MediSupply Co.', phone: '+91-40-6789-0123', role: 'CUSTOMER' } })
  await prisma.user.upsert({ where: { id: cust5Auth.id },    update: {}, create: { id: cust5Auth.id,    email: 'homemart@swiftfreight.com',   fullName: 'HomeMart',       phone: '+91-33-9012-3456', role: 'CUSTOMER' } })

  console.log('✅ User profiles done\n')

  // ─── 3. Drivers ─────────────────────────────────────────
  console.log('Creating driver profiles...')

  await prisma.driver.upsert({ where: { id: driver1Auth.id }, update: {}, create: { id: driver1Auth.id, licenseNo: 'DL-MH-2019-0034521', availability: true,  rating: 4.8, totalTrips: 312 } })
  await prisma.driver.upsert({ where: { id: driver2Auth.id }, update: {}, create: { id: driver2Auth.id, licenseNo: 'DL-KA-2021-0087643', availability: true,  rating: 4.6, totalTrips: 198 } })
  await prisma.driver.upsert({ where: { id: driver3Auth.id }, update: {}, create: { id: driver3Auth.id, licenseNo: 'DL-TN-2020-0056129', availability: false, rating: 4.9, totalTrips: 427 } })

  console.log('✅ Drivers done\n')

  // ─── 4. Vehicles ────────────────────────────────────────
  console.log('Creating vehicles...')

  const vehicles = await Promise.all([
    prisma.vehicle.upsert({ where: { plateNo: 'MH-01-AB-1234' }, update: {}, create: { plateNo: 'MH-01-AB-1234', type: 'Van',        capacityKg: 500,  status: 'ON_TRIP'    } }),
    prisma.vehicle.upsert({ where: { plateNo: 'KA-02-CD-5678' }, update: {}, create: { plateNo: 'KA-02-CD-5678', type: 'Bike',       capacityKg: 30,   status: 'AVAILABLE'  } }),
    prisma.vehicle.upsert({ where: { plateNo: 'TN-03-EF-9012' }, update: {}, create: { plateNo: 'TN-03-EF-9012', type: 'Truck',      capacityKg: 2000, status: 'ON_TRIP'    } }),
    prisma.vehicle.upsert({ where: { plateNo: 'DL-04-GH-3456' }, update: {}, create: { plateNo: 'DL-04-GH-3456', type: 'Mini-Truck', capacityKg: 800,  status: 'MAINTENANCE'} }),
    prisma.vehicle.upsert({ where: { plateNo: 'GJ-05-IJ-7890' }, update: {}, create: { plateNo: 'GJ-05-IJ-7890', type: 'Van',        capacityKg: 500,  status: 'AVAILABLE'  } }),
  ])

  console.log('✅ Vehicles done\n')

  // ─── 5. Shipments ───────────────────────────────────────
  console.log('Creating shipments...')

  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000)

  const shipmentData = [
    // TechCorp India shipments
    { trackingNo: 'SWF-2026-000001', senderId: cust1Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[0].id, originCity: 'Mumbai',    destCity: 'Delhi',     receiverName: 'Rohan Verma',    receiverPhone: '+91-98765-10001', status: 'DELIVERED'       as const, serviceType: 'EXPRESS'   as const, weightKg: 12.5,  charge: 850,  eta: daysAgo(2),  createdAt: daysAgo(5) },
    { trackingNo: 'SWF-2026-000002', senderId: cust1Auth.id, driverId: driver2Auth.id, vehicleId: vehicles[1].id, originCity: 'Bangalore', destCity: 'Chennai',   receiverName: 'Anita Menon',    receiverPhone: '+91-98765-10002', status: 'IN_TRANSIT'      as const, serviceType: 'STANDARD' as const, weightKg: 5.2,   charge: 420,  eta: daysAgo(-1), createdAt: daysAgo(3) },
    { trackingNo: 'SWF-2026-000003', senderId: cust1Auth.id, driverId: driver3Auth.id, vehicleId: vehicles[2].id, originCity: 'Hyderabad', destCity: 'Pune',      receiverName: 'Karan Bose',     receiverPhone: '+91-98765-10003', status: 'OUT_FOR_DELIVERY'as const, serviceType: 'SAME_DAY' as const, weightKg: 3.8,   charge: 1200, eta: daysAgo(0),  createdAt: daysAgo(1) },
    { trackingNo: 'SWF-2026-000004', senderId: cust1Auth.id, driverId: null,           vehicleId: null,           originCity: 'Delhi',     destCity: 'Jaipur',    receiverName: 'Sunita Rao',     receiverPhone: '+91-98765-10004', status: 'CREATED'         as const, serviceType: 'STANDARD' as const, weightKg: 7.1,   charge: 560,  eta: daysAgo(-3), createdAt: daysAgo(0) },
    { trackingNo: 'SWF-2026-000005', senderId: cust1Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[0].id, originCity: 'Chennai',   destCity: 'Bangalore', receiverName: 'Vivek Nair',     receiverPhone: '+91-98765-10005', status: 'DELIVERED'       as const, serviceType: 'EXPRESS'   as const, weightKg: 22.0,  charge: 1400, eta: daysAgo(7),  createdAt: daysAgo(9) },
    // Globex Exports shipments
    { trackingNo: 'SWF-2026-000006', senderId: cust2Auth.id, driverId: driver2Auth.id, vehicleId: vehicles[1].id, originCity: 'Kolkata',   destCity: 'Mumbai',    receiverName: 'Deepa Ghosh',    receiverPhone: '+91-98765-10006', status: 'DELIVERED'       as const, serviceType: 'EXPRESS'   as const, weightKg: 45.0,  charge: 2800, eta: daysAgo(4),  createdAt: daysAgo(8) },
    { trackingNo: 'SWF-2026-000007', senderId: cust2Auth.id, driverId: driver3Auth.id, vehicleId: vehicles[2].id, originCity: 'Surat',     destCity: 'Delhi',     receiverName: 'Manish Joshi',   receiverPhone: '+91-98765-10007', status: 'PICKED_UP'       as const, serviceType: 'EXPRESS'   as const, weightKg: 80.0,  charge: 3500, eta: daysAgo(-2), createdAt: daysAgo(1) },
    { trackingNo: 'SWF-2026-000008', senderId: cust2Auth.id, driverId: null,           vehicleId: null,           originCity: 'Ahmedabad', destCity: 'Surat',     receiverName: 'Pooja Shah',     receiverPhone: '+91-98765-10008', status: 'CREATED'         as const, serviceType: 'STANDARD' as const, weightKg: 15.5,  charge: 780,  eta: daysAgo(-4), createdAt: daysAgo(0) },
    { trackingNo: 'SWF-2026-000009', senderId: cust2Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[4].id, originCity: 'Pune',      destCity: 'Mumbai',    receiverName: 'Rahul Desai',    receiverPhone: '+91-98765-10009', status: 'DELIVERED'       as const, serviceType: 'STANDARD' as const, weightKg: 9.3,   charge: 540,  eta: daysAgo(10), createdAt: daysAgo(13) },
    { trackingNo: 'SWF-2026-000010', senderId: cust2Auth.id, driverId: driver2Auth.id, vehicleId: vehicles[1].id, originCity: 'Mumbai',    destCity: 'Kolkata',   receiverName: 'Swati Pandey',   receiverPhone: '+91-98765-10010', status: 'IN_TRANSIT'      as const, serviceType: 'EXPRESS'   as const, weightKg: 62.0,  charge: 4200, eta: daysAgo(-1), createdAt: daysAgo(2) },
    // FashionHub shipments
    { trackingNo: 'SWF-2026-000011', senderId: cust3Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[0].id, originCity: 'Delhi',     destCity: 'Lucknow',   receiverName: 'Aarav Singh',    receiverPhone: '+91-98765-10011', status: 'DELIVERED'       as const, serviceType: 'STANDARD' as const, weightKg: 4.5,   charge: 320,  eta: daysAgo(6),  createdAt: daysAgo(9) },
    { trackingNo: 'SWF-2026-000012', senderId: cust3Auth.id, driverId: driver3Auth.id, vehicleId: vehicles[2].id, originCity: 'Chennai',   destCity: 'Coimbatore',receiverName: 'Lakshmi Iyer',   receiverPhone: '+91-98765-10012', status: 'OUT_FOR_DELIVERY'as const, serviceType: 'SAME_DAY' as const, weightKg: 2.1,   charge: 950,  eta: daysAgo(0),  createdAt: daysAgo(1) },
    { trackingNo: 'SWF-2026-000013', senderId: cust3Auth.id, driverId: null,           vehicleId: null,           originCity: 'Mumbai',    destCity: 'Nagpur',    receiverName: 'Pradeep Patil',  receiverPhone: '+91-98765-10013', status: 'CREATED'         as const, serviceType: 'EXPRESS'   as const, weightKg: 8.7,   charge: 680,  eta: daysAgo(-2), createdAt: daysAgo(0) },
    { trackingNo: 'SWF-2026-000014', senderId: cust3Auth.id, driverId: driver2Auth.id, vehicleId: vehicles[4].id, originCity: 'Bangalore', destCity: 'Mysore',    receiverName: 'Girish Kumar',   receiverPhone: '+91-98765-10014', status: 'DELIVERED'       as const, serviceType: 'STANDARD' as const, weightKg: 3.2,   charge: 280,  eta: daysAgo(11), createdAt: daysAgo(14) },
    // MediSupply shipments
    { trackingNo: 'SWF-2026-000015', senderId: cust4Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[0].id, originCity: 'Hyderabad', destCity: 'Bangalore', receiverName: 'Dr. Kavitha',    receiverPhone: '+91-98765-10015', status: 'DELIVERED'       as const, serviceType: 'EXPRESS'   as const, weightKg: 18.0,  charge: 1100, eta: daysAgo(3),  createdAt: daysAgo(5) },
    { trackingNo: 'SWF-2026-000016', senderId: cust4Auth.id, driverId: driver3Auth.id, vehicleId: vehicles[2].id, originCity: 'Pune',      destCity: 'Nashik',    receiverName: 'Dr. Nilesh',     receiverPhone: '+91-98765-10016', status: 'IN_TRANSIT'      as const, serviceType: 'SAME_DAY' as const, weightKg: 6.5,   charge: 1800, eta: daysAgo(-1), createdAt: daysAgo(1) },
    { trackingNo: 'SWF-2026-000017', senderId: cust4Auth.id, driverId: driver2Auth.id, vehicleId: vehicles[1].id, originCity: 'Chennai',   destCity: 'Vellore',   receiverName: 'Dr. Radhika',    receiverPhone: '+91-98765-10017', status: 'DELIVERED'       as const, serviceType: 'EXPRESS'   as const, weightKg: 11.2,  charge: 870,  eta: daysAgo(8),  createdAt: daysAgo(10) },
    // HomeMart shipments
    { trackingNo: 'SWF-2026-000018', senderId: cust5Auth.id, driverId: driver1Auth.id, vehicleId: vehicles[0].id, originCity: 'Delhi',     destCity: 'Agra',      receiverName: 'Mohit Gupta',    receiverPhone: '+91-98765-10018', status: 'DELIVERED'       as const, serviceType: 'STANDARD' as const, weightKg: 35.0,  charge: 1600, eta: daysAgo(1),  createdAt: daysAgo(4) },
    { trackingNo: 'SWF-2026-000019', senderId: cust5Auth.id, driverId: null,           vehicleId: null,           originCity: 'Mumbai',    destCity: 'Surat',     receiverName: 'Heena Contractor',receiverPhone: '+91-98765-10019', status: 'CREATED'         as const, serviceType: 'STANDARD' as const, weightKg: 50.0,  charge: 2100, eta: daysAgo(-3), createdAt: daysAgo(0) },
    { trackingNo: 'SWF-2026-000020', senderId: cust5Auth.id, driverId: driver3Auth.id, vehicleId: vehicles[2].id, originCity: 'Kolkata',   destCity: 'Bhubaneswar',receiverName:'Samir Das',       receiverPhone: '+91-98765-10020', status: 'PICKED_UP'       as const, serviceType: 'EXPRESS'   as const, weightKg: 28.0,  charge: 1950, eta: daysAgo(-2), createdAt: daysAgo(1) },
  ]

  for (const s of shipmentData) {
    const { createdAt, ...rest } = s
    await prisma.shipment.upsert({
      where:  { trackingNo: s.trackingNo },
      update: {},
      create: rest,
    })
  }

  console.log('✅ Shipments done\n')

  // ─── 6. Tracking Events ─────────────────────────────────
  console.log('Creating tracking events...')

  const allShipments = await prisma.shipment.findMany({ where: { trackingNo: { in: shipmentData.map(s => s.trackingNo) } } })
  const existingEvents = await prisma.trackingEvent.count()

  if (existingEvents === 0) {
    const statusProgressions: Record<string, { status: string; location: string; note: string }[]> = {
      CREATED: [
        { status: 'CREATED', location: 'Origin Warehouse', note: 'Shipment registered in system' },
      ],
      PICKED_UP: [
        { status: 'CREATED', location: 'Origin Warehouse', note: 'Shipment registered in system' },
        { status: 'PICKED_UP', location: 'Sender Address', note: 'Package collected from sender' },
      ],
      IN_TRANSIT: [
        { status: 'CREATED', location: 'Origin Warehouse', note: 'Shipment registered in system' },
        { status: 'PICKED_UP', location: 'Sender Address', note: 'Package collected from sender' },
        { status: 'IN_TRANSIT', location: 'Transit Hub', note: 'Package in transit to destination city' },
      ],
      OUT_FOR_DELIVERY: [
        { status: 'CREATED', location: 'Origin Warehouse', note: 'Shipment registered in system' },
        { status: 'PICKED_UP', location: 'Sender Address', note: 'Package collected from sender' },
        { status: 'IN_TRANSIT', location: 'Transit Hub', note: 'Package in transit to destination city' },
        { status: 'OUT_FOR_DELIVERY', location: 'Local Delivery Hub', note: 'Out for delivery with driver' },
      ],
      DELIVERED: [
        { status: 'CREATED', location: 'Origin Warehouse', note: 'Shipment registered in system' },
        { status: 'PICKED_UP', location: 'Sender Address', note: 'Package collected from sender' },
        { status: 'IN_TRANSIT', location: 'Transit Hub', note: 'Package in transit to destination city' },
        { status: 'OUT_FOR_DELIVERY', location: 'Local Delivery Hub', note: 'Out for delivery with driver' },
        { status: 'DELIVERED', location: 'Receiver Address', note: 'Package delivered and signed for' },
      ],
    }

    for (const shipment of allShipments) {
      const events = statusProgressions[shipment.status] || statusProgressions['CREATED']
      for (const ev of events) {
        await prisma.trackingEvent.create({
          data: {
            shipmentId: shipment.id,
            status: ev.status as any,
            location: ev.location,
            note: ev.note,
          }
        })
      }
    }
  }

  console.log('✅ Tracking events done\n')
  console.log('🎉 SwiftFreight database seeded successfully!\n')
  console.log('Demo Accounts:')
  console.log('  Admin:      admin@swiftfreight.com      / Admin@1234')
  console.log('  Dispatcher: dispatch@swiftfreight.com   / Dispatch@1234')
  console.log('  Driver 1:   raj.kumar@swiftfreight.com  / Driver@1234')
  console.log('  Driver 2:   priya.singh@swiftfreight.com/ Driver@1234')
  console.log('  Driver 3:   arjun.mehta@swiftfreight.com/ Driver@1234')
  console.log('  Customer 1: techcorp@swiftfreight.com   / Customer@1234')
  console.log('  Customer 2: globex@swiftfreight.com     / Customer@1234')
  console.log('  Customer 3: fashionhub@swiftfreight.com / Customer@1234')
  console.log('  Customer 4: medisupply@swiftfreight.com / Customer@1234')
  console.log('  Customer 5: homemart@swiftfreight.com   / Customer@1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
