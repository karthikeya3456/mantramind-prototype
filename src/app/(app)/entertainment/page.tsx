import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Podcast, Clapperboard } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const comedyVideos = [
  { id: 1, title: 'Hilarious Stand-up Special', channel: 'Comedy Central', image_id: 'entertainment-video-1' },
  { id: 2, title: 'Funny Animal Fails', channel: 'CritterClips', image_id: 'entertainment-video-1' },
  { id: 3, title: 'Improv Comedy Show', channel: 'Laugh Riot', image_id: 'entertainment-video-1' },
];

const motivationalPodcasts = [
  { id: 1, title: 'The Daily Stoic', host: 'Ryan Holiday', image_id: 'entertainment-podcast-1' },
  { id: 2, title: 'Unlocking Us', host: 'Brené Brown', image_id: 'entertainment-podcast-1' },
  { id: 3, title: 'Feel Better, Live More', host: 'Dr Rangan Chatterjee', image_id: 'entertainment-podcast-1' },
];

export default function EntertainmentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Entertainment Resources</h1>
        <p className="text-muted-foreground">
          Lift your spirits with our selection of funny videos and inspiring podcasts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clapperboard className="h-6 w-6" />
            <span>Comedy Videos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {comedyVideos.map((video) => {
            const image = PlaceHolderImages.find((img) => img.id === video.image_id);
            return (
              <Card key={video.id} className="overflow-hidden group">
                <div className="aspect-video relative">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white fill-white"/>
                    </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.channel}</p>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Podcast className="h-6 w-6" />
            <span>Motivational Podcasts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {motivationalPodcasts.map((podcast) => {
            const image = PlaceHolderImages.find((img) => img.id === podcast.image_id);
            return (
              <Card key={podcast.id} className="overflow-hidden group">
                <div className="aspect-video relative">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white fill-white"/>
                    </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{podcast.title}</h3>
                  <p className="text-sm text-muted-foreground">{podcast.host}</p>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}
