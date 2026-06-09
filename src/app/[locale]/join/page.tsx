import { getTranslations } from "next-intl/server";
import MembershipForm from "@/components/membership/MembershipForm";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'membership' });
  return {
    title: t('title'),
    description: t('subtitle') + " - Aanmeldingsformulier Syrische Gemeenschap in Nederland",
  };
}

export default function JoinPage() {
  return <MembershipForm />;
}
