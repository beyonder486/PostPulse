import FeatureTabs from "@/components/featureTabs";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0b25] via-[#201c42] to-[#1f1f32] text-center">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00a6ff] to-[#00ff77] bg-clip-text text-transparent mt-30">Explore Our Best Features</h1>
        <p className="text-gray-300 mb-8">
          Choose a tool and supercharge your LinkedIn growth.
        </p>
        <FeatureTabs />
      </main>
    </div>
  );
}
