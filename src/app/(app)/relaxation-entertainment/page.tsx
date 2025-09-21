'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Podcast, Clapperboard, Music, Timer, Loader2, Pause, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { searchYoutubeVideos, YoutubeSearchOutput } from '@/ai/flows/youtube-search';

export default function RelaxationEntertainmentPage() {
  const [comedyVideos, setComedyVideos] = useState<YoutubeSearchOutput['videos']>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  const [musicVideos, setMusicVideos] = useState<YoutubeSearchOutput['videos']>([]);
  const [loadingMusic, setLoadingMusic] = useState(true);

  const [podcastVideos, setPodcastVideos] = useState<YoutubeSearchOutput['videos']>([]);
  const [loadingPodcasts, setLoadingPodcasts] = useState(true);
  
  // Meditation Timer State
  const [duration, setDuration] = useState(10 * 60); // default 10 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    async function fetchContent() {
      // Fetch Comedy Videos
      try {
        setLoadingVideos(true);
        const comedyResults = await searchYoutubeVideos({ query: 'stand up comedy', maxResults: 3 });
        setComedyVideos(comedyResults.videos);
      } catch (error) {
        console.error("Failed to fetch YouTube comedy videos:", error);
      } finally {
        setLoadingVideos(false);
      }
      
      // Fetch Calming Music
      try {
        setLoadingMusic(true);
        const musicResults = await searchYoutubeVideos({ query: 'calming meditation music', maxResults: 3 });
        setMusicVideos(musicResults.videos);
      } catch (error) {
        console.error("Failed to fetch YouTube music videos:", error);
      } finally {
        setLoadingMusic(false);
      }

      // Fetch Motivational Podcasts
      try {
        setLoadingPodcasts(true);
        const podcastResults = await searchYoutubeVideos({ query: 'motivational podcasts', maxResults: 3 });
        setPodcastVideos(podcastResults.videos);
      } catch (error) {
        console.error("Failed to fetch YouTube podcast videos:", error);
      } finally {
        setLoadingPodcasts(false);
      }
    }
    fetchContent();
  }, []);

  // Meditation Timer Effects
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Pre-load the audio element on the client
    audioRef.current = new Audio('/finish-sound.mp3');
  }, []);
  
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const selectDuration = (minutes: number) => {
    setIsRunning(false);
    setDuration(minutes * 60);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


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
          {loadingMusic ? (
            <div className="flex items-center justify-center col-span-3 min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            musicVideos.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video relative">
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white fill-white"/>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                  </div>
                </Card>
              </a>
            ))
          )}
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
          {loadingVideos ? (
            <div className="flex items-center justify-center col-span-3 min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            comedyVideos.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video relative">
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white fill-white"/>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                  </div>
                </Card>
              </a>
            ))
          )}
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
           {loadingPodcasts ? (
            <div className="flex items-center justify-center col-span-3 min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            podcastVideos.map((video) => (
              <a 
                key={video.id} 
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video relative">
                    <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white fill-white"/>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                  </div>
                </Card>
              </a>
            ))
          )}
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
          <div className="text-6xl font-bold font-mono text-primary">{formatTime(timeLeft)}</div>
          <p className="text-muted-foreground">Set your desired meditation duration.</p>
          <div className="flex gap-2">
            <Button variant={duration === 5 * 60 ? 'default' : 'outline'} onClick={() => selectDuration(5)}>5 min</Button>
            <Button variant={duration === 10 * 60 ? 'default' : 'outline'} onClick={() => selectDuration(10)}>10 min</Button>
            <Button variant={duration === 15 * 60 ? 'default' : 'outline'} onClick={() => selectDuration(15)}>15 min</Button>
            <Button variant={duration === 30 * 60 ? 'default' : 'outline'} onClick={() => selectDuration(30)}>30 min</Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button size="lg" className="px-12 py-6 rounded-full" onClick={handleStartPause}>
            {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
            {isRunning ? 'Pause' : 'Start Session'}
          </Button>
          <Button size="lg" variant="outline" className="px-8 py-6 rounded-full" onClick={handleReset} disabled={!isRunning && timeLeft === duration}>
            <RotateCcw className="mr-2 h-5 w-5" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
