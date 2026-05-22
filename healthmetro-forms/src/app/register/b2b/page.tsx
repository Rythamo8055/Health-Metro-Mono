import B2BRegistrationForm from '@/components/B2BRegistrationForm';

export default function B2BPage() {
  return (
    <main className="min-h-screen w-full bg-white selection:bg-[#027473]/10 selection:text-[#027473]">
      <B2BRegistrationForm
        tagline="B2B Partner Network"
        heroTitle="Clinical network,"
        heroSubtitle="streamlined for scale."
        iconSrc="/icons/hm-trust.png"
      />
    </main>
  );
}
