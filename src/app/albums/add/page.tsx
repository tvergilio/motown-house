'use client';

import { useState } from 'react';
import AlbumForm from '@/components/album-form';
import ITunesSearch, { type iTunesSearchResult } from '@/components/itunes-search';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Search } from 'lucide-react';

export default function AddAlbumPage() {
  const [selectedAlbumData, setSelectedAlbumData] = useState<iTunesSearchResult | null>(null);
  const [activeTab, setActiveTab] = useState('itunes');

  const handleSelectAlbum = (albumData: iTunesSearchResult) => {
    setSelectedAlbumData(albumData);
    setActiveTab('manual'); // Switch to manual form with pre-filled data
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-headline font-bold">Add New Album</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Search iTunes for albums or enter details manually.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="itunes" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find on iTunes
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Enter Manually
          </TabsTrigger>
        </TabsList>

        <TabsContent value="itunes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search iTunes Store
              </CardTitle>
              <CardDescription>
                Search for albums on iTunes and select one to add to the shop. 
                Album details will be automatically filled in for you to review.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ITunesSearch onSelectAlbum={handleSelectAlbum} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          {selectedAlbumData && (
            <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Album selected from iTunes
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      &quot;{selectedAlbumData.title}&quot; by {selectedAlbumData.artist} - Review and save below
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <AlbumForm prefilledData={selectedAlbumData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
