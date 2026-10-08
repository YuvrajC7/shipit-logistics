"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

export async function addUserAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as any;
  const password = formData.get("password") as string;
  
  // 1. Create Supabase Auth User
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Failed to create Auth User");
  }

  // 2. Create Prisma User
  await prisma.user.create({
    data: {
      id: authData.user.id,
      email: authData.user.email!,
      fullName,
      role,
    }
  });

  // 3. If driver, create driver subtype
  if (role === "DRIVER") {
    await prisma.driver.create({
      data: {
        id: authData.user.id,
        licenseNo: `DL-${Math.floor(Math.random() * 1000000)}`,
        availability: true,
      }
    });
  }

  revalidatePath("/admin/users");
}
