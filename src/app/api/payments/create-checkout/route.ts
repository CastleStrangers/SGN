import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      amount, 
      description = "SGN Lidmaatschap / Donatie", 
      issuer = "ing", 
      locale = "nl",
      type = "membership",
      planId = "supporter"
    } = body;

    const parsedAmount = typeof amount === "number" ? amount.toFixed(2) : parseFloat(amount || "2.99").toFixed(2);
    const session = await getServerSession(authOptions);

    const mollieApiKey = process.env.MOLLIE_API_KEY;

    if (mollieApiKey && mollieApiKey.startsWith("live_") || (mollieApiKey && mollieApiKey.startsWith("test_"))) {
      try {
        const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${mollieApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: {
              currency: "EUR",
              value: parsedAmount,
            },
            description,
            redirectUrl: `https://sgn-indol.vercel.app/${locale}/pricing?payment=success`,
            webhookUrl: `https://sgn-indol.vercel.app/api/payments/webhook`,
            method: "ideal",
            metadata: {
              userId: session?.user?.id || null,
              type,
              planId,
            },
          }),
        });

        if (mollieRes.ok) {
          const mollieData = await mollieRes.json();
          return NextResponse.json({
            success: true,
            checkoutUrl: mollieData._links?.checkout?.href,
            paymentId: mollieData.id,
          });
        }
      } catch (e) {
        console.error("Mollie API error, falling back to direct bank flow:", e);
      }
    }

    // Direct Dutch ABN AMRO ANBI Official Bank Transfer & iDEAL fallback flow
    const paymentRef = `SGN-${Math.floor(100000 + Math.random() * 900000)}`;

    return NextResponse.json({
      success: true,
      mode: "direct_ideal_transfer",
      paymentReference: paymentRef,
      amount: parsedAmount,
      currency: "EUR",
      bankAccount: {
        accountName: "Stichting De Syrische Gemeenschap in Nederland",
        iban: "NL90 ABNA 0148 7498 95",
        bic: "ABNANL2A",
        bankName: "ABN AMRO Bank N.V.",
        kvk: "96718943",
        rsin: "867730286",
      },
      instructions: locale === "ar"
        ? `يرجى استخدام الرمز المرجعي (${paymentRef}) عند التحويل عبر بنكك الهولندي لتوثيق السداد تلقائياً.`
        : locale === "nl"
        ? `Gebruik het betalingskenmerk (${paymentRef}) bij uw overboeking voor automatische verwerking.`
        : `Please include the reference (${paymentRef}) in your Dutch bank transfer for automated processing.`,
    });
  } catch (error: any) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to initiate payment session" },
      { status: 500 }
    );
  }
}
