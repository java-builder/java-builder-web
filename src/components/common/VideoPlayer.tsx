"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  initialTime?: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ src, poster, autoPlay = false, className = "", initialTime, onTimeUpdate }, ref) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
          playerRef.current.currentTime(time);
        }
      },
      getCurrentTime: () => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
          return (playerRef.current.currentTime() as number) || 0;
        }
        return 0;
      },
      getDuration: () => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
          return (playerRef.current.duration() as number) || 0;
        }
        return 0;
      },
    }));

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

      // Seek to initial time when ready
      if (initialTime && initialTime > 0) {
        player.on("loadedmetadata", () => {
          player.currentTime(initialTime);
        });
      }

      // Time update callback
      if (onTimeUpdate) {
        player.on("timeupdate", () => {
          const currentTime = player.currentTime();
          const duration = player.duration();
          if (typeof currentTime === "number" && typeof duration === "number") {
            onTimeUpdate(Math.floor(currentTime), Math.floor(duration));
          }
        });
      }

      // Cleanup
      return () => {
        if (playerRef.current && !playerRef.current.isDisposed()) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }, [src, poster, autoPlay, initialTime, onTimeUpdate]);

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
            font-size: 13px !important;
            color: #ffffff !important;
          }
          .video-js .vjs-big-play-button {
            background-color: rgba(255, 90, 31, 0.92) !important;
            color: #ffffff !important;
            border: 2px solid rgba(255, 255, 255, 0.85) !important;
            border-radius: 50%;
            width: 68px;
            height: 68px;
            line-height: 64px;
            margin-left: -34px;
            margin-top: -34px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
            transition: transform 0.2s ease, background-color 0.2s ease;
          }
          .video-js:hover .vjs-big-play-button,
          .video-js .vjs-big-play-button:hover {
            background-color: #ff5a1f !important;
            transform: scale(1.06);
          }
          /* Keep height at exactly 3em so all native video.js 3em-centered controls align on one axis */
          .video-js .vjs-control-bar {
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(0, 0, 0, 0.55) 75%,
              transparent 100%
            ) !important;
            height: 3em !important;
            color: #ffffff !important;
          }
          .video-js .vjs-control,
          .video-js .vjs-control button,
          .video-js .vjs-icon-placeholder,
          .video-js .vjs-icon-placeholder::before,
          .video-js .vjs-time-control,
          .video-js .vjs-playback-rate .vjs-playback-rate-value {
            color: #ffffff !important;
            opacity: 1 !important;
          }
          .video-js .vjs-control:hover .vjs-icon-placeholder::before,
          .video-js .vjs-control:hover {
            color: #ff5a1f !important;
          }
          .video-js .vjs-play-progress,
          .video-js .vjs-volume-level {
            background-color: #ff5a1f !important;
          }
          .video-js .vjs-play-progress::before,
          .video-js .vjs-volume-level::before {
            color: #ffffff !important;
          }
          .video-js .vjs-load-progress,
          .video-js .vjs-load-progress div {
            background: rgba(255, 255, 255, 0.35) !important;
          }
          .video-js .vjs-slider {
            background-color: rgba(255, 255, 255, 0.25) !important;
          }
          .video-js .vjs-slider:focus {
            box-shadow: none;
          }
          .video-js .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
            background-color: rgba(15, 23, 42, 0.95) !important;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.15);
          }
          .video-js .vjs-menu li {
            color: #f8fafc !important;
          }
          .video-js .vjs-menu li.vjs-selected {
            background-color: #ff5a1f !important;
            color: #ffffff !important;
            font-weight: 700;
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
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
