import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Podcast, Clapperboard, Music, Timer } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const musicTracks = [
  { id: 1, title: 'Gentle Waves', duration: '5:23', image_id: 'relax-music-1' },
  { id: 2, title: 'Forest Whispers', duration: '4:48', image_id: 'relax-music-2' },
  { id: 3, title: 'Sunset Serenity', duration: '6:12', image_id: 'relax-music-3' },
];

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


export default function RelaxationEntertainmentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Relaxation & Entertainment Resources</h1>
        <p className="text-muted-foreground">
          Find inner peace, lift your spirits, and take a break with our curated collection of resources.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-6 w-6" />
            <span>Calming Music</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {musicTracks.map((track) => {
            const image = PlaceHolderImages.find((img) => img.id === track.image_id);
            return (
              <Card key={track.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.duration}</p>
                </div>
                <CardFooter>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Play
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </CardContent>
      </Card>
      
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
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-6 w-6" />
            <span>Meditation Timer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl font-bold font-mono text-primary">10:00</div>
          <p className="text-muted-foreground">Set your desired meditation duration.</p>
          <div className="flex gap-2">
            <Button variant="outline">5 min</Button>
            <Button>10 min</Button>
            <Button variant="outline">15 min</Button>
            <Button variant="outline">30 min</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button size="lg" className="px-12 py-6 rounded-full">
            <Play className="mr-2 h-5 w-5" />
            Start Session
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
