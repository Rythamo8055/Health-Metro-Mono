import ProviderRegistrationForm from '@/components/ProviderRegistrationForm';

export default function PharmacyPage() {
  return (
    <main className="h-screen w-full bg-white selection:bg-[#027473]/10 selection:text-[#027473]">
      <ProviderRegistrationForm
        preselectedType="Pharmacy"
        tagline="Pharmacy Network"
        heroTitle="Connecting the"
        heroSubtitle="health supply chain."
      />
    </main>
  );
}
