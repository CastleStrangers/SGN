import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApiMessage } from "@/lib/api-messages";

function t(req: Request, key: string, vars?: Record<string, string>) {
  const locale = (req as any).cookies?.get?.('NEXT_LOCALE')?.value || 'ar';
  return getApiMessage(locale, key, vars);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, amount, message, paymentMethod } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0" }, { status: 400 });
    }

    const donation = await prisma.donation.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        amount: parseFloat(amount),
        message: message?.trim() || null,
        paymentMethod: paymentMethod || "bank",
        status: "pending",
      },
    });

    // Notify admin users
    const admins = await prisma.user.findMany({ where: { role: "admin" } });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: t(req, 'api.newDonation'),
          message: t(req, 'api.newDonationMessage', { amount: `€${amount}`, name }),
          link: "/dashboard/donations",
        },
      });
    }

    if (paymentMethod === "mollie") {
      return NextResponse.json({
        success: true,
        donationId: donation.id,
        paymentUrl: "https://mollie.com/pay/placeholder",
      });
    }

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      bankDetails: {
        iban: process.env.NEXT_PUBLIC_DONATION_IBAN || "NL13INGB0001234567",
        bankName: process.env.NEXT_PUBLIC_DONATION_BANK || "ING Bank",
        accountHolder: process.env.NEXT_PUBLIC_DONATION_HOLDER || "Syrian Community in the Netherlands",
      },
    });
  } catch (error) {
    console.error("[DONATE_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
