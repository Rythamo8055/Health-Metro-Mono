import ProviderRegistrationForm from '@/components/ProviderRegistrationForm';

export default function Home() {
  return (
    <main className="h-screen w-full bg-white selection:bg-[#027473]/10 selection:text-[#027473]">
      <ProviderRegistrationForm
        tagline="Partner Network"
        heroTitle="Clinical excellence,"
        heroSubtitle="digitally mastered."
        iconSrc="/icons/hm-clin.png"
      />
    </main>
  );
}
