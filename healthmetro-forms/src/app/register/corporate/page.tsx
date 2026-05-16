import ProviderRegistrationForm from '@/components/ProviderRegistrationForm';

export default function CorporatePage() {
  return (
    <main className="h-screen w-full bg-white selection:bg-[#027473]/10 selection:text-[#027473]">
      <ProviderRegistrationForm
        preselectedType="Hospital"
        tagline="Corporate & Hospital"
        heroTitle="Enterprise health,"
        heroSubtitle="built to scale."
        iconSrc="/icons/hm-trust.png"
      />
    </main>
  );
}
