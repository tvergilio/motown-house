import RecommendationsForm from "@/components/recommendations-form";

export default function RecommendationsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Themed Recommendations</h1>
        <p className="text-lg text-muted-foreground">
          Get personalized album recommendations from our AI-powered music assistant.
          Just provide your listening habits and a theme!
        </p>
      </div>
      <RecommendationsForm />
    </div>
  );
}
