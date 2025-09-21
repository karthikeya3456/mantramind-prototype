'use server';
/**
 * @fileOverview Searches YouTube for videos.
 *
 * - searchYoutubeVideos - A function that searches YouTube for videos.
 * - YoutubeSearchInput - The input type for the searchYoutubeVideos function.
 * - YoutubeSearchOutput - The return type for the searchYoutubeVideos function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { google } from 'googleapis';

const youtube = google.youtube('v3');

const YoutubeSearchInputSchema = z.object({
  query: z.string().describe('The search query for YouTube videos.'),
  maxResults: z.number().optional().default(3).describe('The maximum number of results to return.'),
});
export type YoutubeSearchInput = z.infer<typeof YoutubeSearchInputSchema>;

const YoutubeVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  channelTitle: z.string(),
  thumbnailUrl: z.string(),
});

const YoutubeSearchOutputSchema = z.object({
  videos: z.array(YoutubeVideoSchema),
});
export type YoutubeSearchOutput = z.infer<typeof YoutubeSearchOutputSchema>;

async function search(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set.');
  }

  const response = await youtube.search.list({
    key: apiKey,
    part: ['snippet'],
    q: input.query,
    type: ['video'],
    maxResults: input.maxResults,
    videoEmbeddable: 'true',
  });

  const videos = response.data.items?.map(item => ({
    id: item.id?.videoId || '',
    title: item.snippet?.title || '',
    channelTitle: item.snippet?.channelTitle || '',
    thumbnailUrl: item.snippet?.thumbnails?.high?.url || '',
  })) || [];

  return { videos };
}

const searchTool = ai.defineTool(
    {
      name: 'searchYoutubeVideos',
      description: 'Search for videos on YouTube.',
      inputSchema: YoutubeSearchInputSchema,
      outputSchema: YoutubeSearchOutputSchema,
    },
    async (input) => search(input)
);

export const searchYoutubeVideosFlow = ai.defineFlow(
  {
    name: 'searchYoutubeVideosFlow',
    inputSchema: YoutubeSearchInputSchema,
    outputSchema: YoutubeSearchOutputSchema,
  },
  async (input) => {
    return await search(input);
  }
);


export async function searchYoutubeVideos(input: YoutubeSearchInput): Promise<YoutubeSearchOutput> {
    return searchYoutubeVideosFlow(input);
}
