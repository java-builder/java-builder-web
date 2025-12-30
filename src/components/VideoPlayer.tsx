"use client";

import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function VideoPlayer({ src, poster, autoPlay = false, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Determine if HLS
    const isHLS = src.includes(".m3u8");

    // Create video element
    const videoElement = document.createElement("video-js");
    videoElement.classList.add("vjs-big-play-centered", "vjs-fluid");
    videoRef.current.appendChild(videoElement);

    // Initialize player
    const player = videojs(videoElement, {
      autoplay: autoPlay,
      controls: true,
      responsive: true,
      fluid: true,
      poster: poster,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          "playToggle",
          "volumePanel",
          "currentTimeDisplay",
          "timeDivider",
          "durationDisplay",
          "progressControl",
          "playbackRateMenuButton",
          "qualitySelector",
          "fullscreenToggle",
        ],
      },
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
      sources: [
        {
          src: src,
          type: isHLS ? "application/x-mpegURL" : "video/mp4",
        },
      ],
    });

    playerRef.current = player;

    // Disable right-click on video
    player.on("contextmenu", (e: Event) => {
      e.preventDefault();
    });

    // Cleanup
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoPlay]);

  return (
    <div className={className}>
      <div 
        ref={videoRef} 
        data-vjs-player
        onContextMenu={(e) => e.preventDefault()}
      />
      <style jsx global>{`
        .video-js {
          font-family: inherit;
        }
        .video-js .vjs-big-play-button {
          background-color: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 70px;
          height: 70px;
          line-height: 70px;
          margin-left: -35px;
          margin-top: -35px;
        }
        .video-js .vjs-big-play-button:hover {
          background-color: rgba(59, 130, 246, 0.8);
        }
        .video-js .vjs-control-bar {
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          height: 40px;
        }
        .video-js .vjs-play-progress,
        .video-js .vjs-volume-level {
          background-color: #3b82f6;
        }
        .video-js .vjs-slider:focus {
          box-shadow: none;
        }
        /* Hide download button if browser adds one */
        video::-webkit-media-controls-enclosure {
          overflow: hidden;
        }
        video::-webkit-media-controls-panel {
          width: calc(100% + 30px);
        }
        video::-internal-media-controls-download-button {
          display: none !important;
        }
        video::-webkit-media-controls-download-button {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
