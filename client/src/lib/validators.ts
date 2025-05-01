import { z } from "zod";
import { getYouTubeVideoId } from "./utils";

export const urlSchema = z
  .string()
  .trim()
  .min(1, { message: "YouTube URL is required" })
  .refine(
    (value) => {
      const videoId = getYouTubeVideoId(value);
      return videoId !== null;
    },
    {
      message: "Invalid YouTube URL",
    }
  );
