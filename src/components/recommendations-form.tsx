'use client';

import { useState } from 'react';
import { getPersonalizedRecommendations } from '@/ai/flows/themed-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

export default function RecommendationsForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const browsingHistory = formData.get('browsingHistory') as string;
    const theme = formData.get('theme') as string;

    try {
      const response = await getPersonalizedRecommendations({ browsingHistory, theme });
      setResult(response.recommendations);
    } catch (e) {
      setError('Sorry, we couldn\'t get recommendations at this time. Please try again later.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand2 className="text-accent" />
            Discover New Music
          </CardTitle>
          <CardDescription>Tell us what you like and we'll find your next favorite album.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="browsingHistory">Your Listening Habits</Label>
              <Textarea
                id="browsingHistory"
                name="browsingHistory"
                placeholder="e.g., I've been listening to a lot of Stevie Wonder, soul music from the 70s, and artists with strong political messages."
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Recommendation Theme</Label>
              <Input
                id="theme"
                name="theme"
                placeholder="e.g., 'Upbeat and Funky' or 'Rainy Day Soul'"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Get Recommendations'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">An Error Occurred</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Here Are Your Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-foreground">
              {result.split('\n').filter(item => item.trim()).map((item, index) => (
                <li key={index}>{item.trim().replace(/^- /, '')}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
