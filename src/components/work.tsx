import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowLeft, ArrowRight } from 'lucide-react';

type MediaItem = {
  driveUrl: string;
  mediaType: 'image' | 'video';
};

type ProjectItem = {
  title: string;
  category: string;
  year: string;
  color: string;
  media: MediaItem[];
};

const projects: ProjectItem[] = [
  {
    title: "Short Form Video Suite",
    category: "Short Form Video Editor + AI Toolkit",
    year: "2024",
    color: "bg-[#111]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1OnVe4ru9pnSv63gOGuhvqtVqFHTy2EYM/view?usp=sharing",
        mediaType: "video",
      },
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1AbCdEfGhIjKlMnOpQrStUvWxYz",
        mediaType: "image",
      },
    ],
  },
  {
    title: "Graphic Asset Library",
    category: "Creative Direction",
    year: "2024",
    color: "bg-[#161616]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1to90lMe8Rz5PAUPfVnYhhcKQxbTBxOK1/view?usp=sharing",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1CdEfGhIjKlMnOpQrStUvWxYzAb",
        mediaType: "image",
      },
    ],
  },
  {
    title: "Amazon Listing",
    category: "Graphic Design for Products",
    year: "2024",
    color: "bg-[#0c0c0c]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1xbKUw5iWyg5O_06o7bMt8WEzIXbbuKX3/view?usp=sharing",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1EfGhIjKlMnOpQrStUvWxYzAbCd",
        mediaType: "image",
      },
    ],
  },
  {
    title: "Photoshop Image Edits",
    category: "Design and Photo Editing",
    year: "2024",
    color: "bg-[#141414]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1zjFMIK6E-0e2x5OOoNrtoNYFR0KwDpVx/view?usp=sharing",
        mediaType: "video",
      },
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1GhIjKlMnOpQrStUvWxYzAbCdEf",
        mediaType: "image",
      },
    ],
  },
];

const articleProjects: ProjectItem[] = [
  {
    title: "News Article Creation",
    category: "Editorial Content and Storytelling",
    year: "2024",
    color: "bg-[#111]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1HXERqpXRRftV6T3gRy8N9lgO2jbcFuaY/view?usp=sharing",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/file/d/1ae_GLqt1xfZAJQagGFNVUh8r4F2AjeHJ/view?usp=sharing",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/file/d/1LYjNRJcwZcjkhcpi_ah73XTfBeO8FZVv/view?usp=sharing",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/file/d/19y_a39SVJa9H0Wn3mrVvJYM-lzZF1Z21/view?usp=sharing",
        mediaType: "image",
      },
    ],
  },
  {
    title: "News Carousel Design",
    category: "Thumbnail and Social Preview Assets",
    year: "2024",
    color: "bg-[#161616]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1dviQ4rfNTJQtICieJ4hV4XVfRFD0f2rL/view?usp=drive_link",
        mediaType: "image",
      },
      {
        driveUrl: "https://drive.google.com/file/d/1-ja-arpL6Nx2pr1R1b3tHbf0b-EffV1c/view?usp=drive_link",
        mediaType: "image",
      },
    ],
  },
  {
    title: "Short-form News Ad",
    category: "News Ad Creation for Social",
    year: "2024",
    color: "bg-[#0d0d0d]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/18kpsK8a-PCUFuINDy5mvskSpLs7fxzvl/view?usp=sharing",
        mediaType: "video",
      },
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1MxNzOoPaRStUvWx0YzAbCdEfGh",
        mediaType: "image",
      },
    ],
  },
  {
    title: "Short-form News Edit",
    category: "News Video Editing Showcase",
    year: "2024",
    color: "bg-[#1b1b1b]",
    media: [
      {
        driveUrl: "https://drive.google.com/file/d/1xvDrZoOkj3kmMlBRMhnrvu0y1OUNyayh/view?usp=sharing",
        mediaType: "video",
      },
    
     {
        driveUrl: "https://drive.google.com/file/d/1RTUV6YFzm9Pc-Soh6q1bOuwooZIfYiJj/view?usp=sharing",
        mediaType: "video",
      },
      
      {
        driveUrl: "https://drive.google.com/uc?export=view&id=1OpQrStUvWxYzAbCdEfGhIjKlMn",
        mediaType: "image",
      },
    ],
  },
];

const placeholderDriveFileIds = new Set([
  '1AbCdEfGhIjKlMnOpQrStUvWxYz',
  '1CdEfGhIjKlMnOpQrStUvWxYzAb',
  '1EfGhIjKlMnOpQrStUvWxYzAbCd',
  '1GhIjKlMnOpQrStUvWxYzAbCdEf',
  '1MxNzOoPaRStUvWx0YzAbCdEfGh',
  '1OpQrStUvWxYzAbCdEfGhIjKlMn',
]);

function getDriveFileId(url: string) {
  const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  return idMatch?.[1] ?? null;
}

function hasDisplayableDriveLink(url: string) {
  const id = getDriveFileId(url);
  return id !== null && !placeholderDriveFileIds.has(id);
}

function getDriveMediaUrl(url: string, mediaType: string) {
  const id = getDriveFileId(url);
  if (!id) return url;

  if (mediaType === 'image') {
    return getDriveImageModalUrl(url);
  }

  return `https://drive.google.com/file/d/${id}/preview`;
}

function isValidDriveLink(url: string) {
  return hasDisplayableDriveLink(url);
}

function getDriveThumbnailUrl(url: string) {
  const id = getDriveFileId(url);
  if (!id) return url;

  return `https://drive.google.com/thumbnail?authuser=0&sz=w1080&id=${id}`;
}

function getDriveImageThumbnailUrl(url: string) {
  return getDriveThumbnailUrl(url);
}

function getDriveImageModalUrl(url: string) {
  const id = getDriveFileId(url);
  if (!id) return url;

  return `https://drive.google.com/thumbnail?authuser=0&sz=w2400&id=${id}`;
}

function getDrivePreviewUrl(url: string) {
  const id = getDriveFileId(url);
  if (!id) return url;

  return `https://drive.google.com/file/d/${id}/preview`;
}

function getVideoThumbnailUrl(title: string) {
  const seed = Array.from(title).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const gradients = [
    ['#111827', '#374151'],
    ['#0f172a', '#1e293b'],
    ['#1f2937', '#334155'],
    ['#111827', '#475569'],
  ];
  const [start, end] = gradients[seed % gradients.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${start}"/>
          <stop offset="100%" stop-color="${end}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(%23g)"/>
      <text x="50%" y="45%" text-anchor="middle" font-family="Inter, sans-serif" font-size="64" fill="#ffffff" opacity="0.92">VIDEO</text>
      <text x="50%" y="60%" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" fill="#d1d5db" opacity="0.85">${title}</text>
      <text x="50%" y="75%" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#9ca3af" opacity="0.75">VIDEO PREVIEW</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
}

export default function Work() {
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [thumbLoadError, setThumbLoadError] = useState<Record<string, boolean>>({});
  const [isMediaTransitioning, setIsMediaTransitioning] = useState(false);
  const [pendingMediaIndex, setPendingMediaIndex] = useState<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const [mediaRatios, setMediaRatios] = useState<Record<string, number>>({});

  const handleMediaLoaded = (projectKey: string, width: number, height: number) => {
    if (!width || !height || mediaRatios[projectKey]) return;
    const ratio = Math.round((width / height) * 100) / 100;
    setMediaRatios((prev) => ({ ...prev, [projectKey]: ratio }));
  };

  const openProject = (project: ProjectItem) => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setActiveProject(project);
    setActiveMediaIndex(0);
    setZoomed(false);
    setImageLoadError(false);
    setPendingMediaIndex(null);
    setIsMediaTransitioning(false);
  };

  const commitMediaIndex = (index: number) => {
    setActiveMediaIndex(index);
    setPendingMediaIndex(null);
    setIsMediaTransitioning(false);
  };

  const changeMediaIndex = (direction: number) => {
    if (!activeProject || pendingMediaIndex !== null) return;
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    const nextIndex = (activeMediaIndex + direction + activeProject.media.length) % activeProject.media.length;
    setIsMediaTransitioning(true);
    setZoomed(false);
    setImageLoadError(false);
    setPendingMediaIndex(nextIndex);

    const nextMedia = activeProject.media[nextIndex];
    if (nextMedia.mediaType === 'video' || !hasDisplayableDriveLink(nextMedia.driveUrl)) {
      transitionTimeoutRef.current = window.setTimeout(() => commitMediaIndex(nextIndex), 240);
    }
  };

  const pendingMedia = activeProject && pendingMediaIndex !== null ? activeProject.media[pendingMediaIndex] : null;

  const renderMediaPreview = (project: ProjectItem, index = 0) => {
    const media = project.media[index];
    const previewKey = `${project.title}-${index}`;
    const validDriveLink = isValidDriveLink(media.driveUrl);
    const previewError = thumbLoadError[previewKey] || !validDriveLink;

    if (previewError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-center text-sm text-slate-500">
          <div className="px-4">
            <div className="mb-2 text-xs uppercase tracking-[0.28em] text-slate-400">Stay tuned</div>
            <div className="leading-tight">Stay tuned for more uploads.</div>
          </div>
        </div>
      );
    }

    return (
      <img
        src={
          media.mediaType === 'image'
            ? getDriveImageThumbnailUrl(media.driveUrl)
            : getDriveThumbnailUrl(media.driveUrl)
        }
        alt={project.title}
        onError={() => {
          setThumbLoadError((prev) => ({ ...prev, [previewKey]: true }));
        }}
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          handleMediaLoaded(previewKey, naturalWidth, naturalHeight);
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  };

  const renderCard = (project: ProjectItem, idx: number) => {
    const previewMediaKey = `${project.title}-0`;
    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: idx * 0.1 }}
        className="group cursor-pointer block break-inside-avoid mb-6 md:mb-8"
        onClick={() => openProject(project)}
      >
        <div className="bg-white mb-6 relative overflow-hidden transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[0.98]">
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: mediaRatios[previewMediaKey] || 0.8 }}
          >
            <div className="absolute inset-0 border border-white/5 group-hover:border-white/10 transition-colors z-10" />
            <div className="h-full w-full overflow-hidden">
              {renderMediaPreview(project, 0)}
            </div>
            {project.media[0].mediaType === 'video' && (
              <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-1 ring-white/20">
                  <Play className="h-8 w-8" />
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-start p-4">
            <div>
              <h4 className="text-xl md:text-2xl font-medium text-black mb-2">{project.title}</h4>
              <p className="text-sm font-mono text-[#666] uppercase tracking-widest">{project.category}</p>
            </div>
            <span className="text-sm font-mono text-[#999]">{project.year}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderProjectSection = (sectionTitle: string, sectionDescription: string, items: ProjectItem[]) => (
    <div id={sectionTitle.replace(/\s+/g, '-').toLowerCase()} className="mt-20">
      <div className="mb-8">
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-semibold text-white mb-3"
        >
          {sectionTitle}
        </motion.h4>
        <p className="max-w-2xl text-sm text-[#888] leading-relaxed">
          {sectionDescription}
        </p>
      </div>

      <div className="columns-1 md:columns-2 gap-6 md:gap-8">
        {items.map((project, idx) => renderCard(project, idx))}
      </div>
    </div>
  );

  const activeMedia = activeProject?.media[activeMediaIndex] ?? null;
  const activeMediaValid = activeMedia ? isValidDriveLink(activeMedia.driveUrl) : false;
  const activeMediaPlaceholder = activeMedia && !activeMediaValid;

  return (
    <section id="work" className="py-32 px-6 md:px-12 lg:px-24 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-sm font-mono text-[#666] tracking-widest uppercase"
          >
            02 / Selected Works and Past Experiences
          </motion.h3>
        </div>

        <div className="columns-1 md:columns-2 gap-6 md:gap-8">
          {projects.map((project, idx) => renderCard(project, idx))}
        </div>

        {renderProjectSection(
          'News & Article Creations',
          'A dedicated frame for editorial work, article thumbnail design, and published content layouts that adapts to the natural ratio of the uploaded media.',
          articleProjects,
        )}
      </div>

      {activeProject && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-20 rounded-full border border-white/20 bg-black/70 px-3 py-2 text-sm text-white hover:border-white"
            >
              Close
            </button>
            <div className="rounded-xl border border-white/10 bg-[#050505] p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">{activeProject.title}</h3>
                  <p className="text-sm text-[#aaa]">{activeProject.category}</p>
                </div>
                <div className="text-sm text-[#888]">
                  {activeMediaIndex + 1} / {activeProject.media.length}
                </div>
              </div>

              <div className={`relative mx-auto max-h-[70vh] max-w-full overflow-hidden rounded-xl border border-white/10 bg-black transition-opacity duration-300 ${isMediaTransitioning ? 'opacity-30' : 'opacity-100'}`}>
                {pendingMedia?.mediaType === 'image' && hasDisplayableDriveLink(pendingMedia.driveUrl) && (
                  <img
                    src={getDriveImageModalUrl(pendingMedia.driveUrl)}
                    alt=""
                    className="hidden"
                    onLoad={() => commitMediaIndex(pendingMediaIndex!)}
                    onError={() => commitMediaIndex(pendingMediaIndex!)}
                  />
                )}
                {activeMediaPlaceholder ? (
                  <div className="flex h-[70vh] w-full items-center justify-center bg-[#111] text-center text-sm text-slate-300">
                    <div className="px-6">
                      <div className="mb-2 text-xs uppercase tracking-[0.28em] text-slate-500">Stay tuned</div>
                      <div className="max-w-sm leading-7">Stay tuned for more uploads.</div>
                    </div>
                  </div>
                ) : activeMedia?.mediaType === 'image' ? (
                  imageLoadError ? (
                    <iframe
                      src={getDrivePreviewUrl(activeMedia.driveUrl)}
                      title={activeProject.title}
                      className="h-[70vh] w-full rounded-xl border border-white/10 bg-white"
                      allow="autoplay; fullscreen; encrypted-media"
                    />
                  ) : (
                    <img
                      src={getDriveImageModalUrl(activeMedia.driveUrl)}
                      alt={activeProject.title}
                      onClick={() => setZoomed((prev) => !prev)}
                      onError={() => setImageLoadError(true)}
                      style={{
                        cursor: zoomed ? 'zoom-out' : 'zoom-in',
                        transform: zoomed ? 'scale(1.8)' : 'scale(1)',
                        transition: 'transform 250ms ease',
                      }}
                      className="block mx-auto max-h-[70vh] w-auto max-w-full rounded-xl object-contain"
                    />
                  )
                ) : (
                  <iframe
                    src={getDriveMediaUrl(activeProject.media[activeMediaIndex].driveUrl, 'video')}
                    title={activeProject.title}
                    className="h-[70vh] w-full rounded-xl border border-white/10"
                    allow="autoplay; fullscreen; encrypted-media"
                  />
                )}

                {isMediaTransitioning && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 backdrop-blur-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white shadow-xl">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                    </div>
                  </div>
                )}

                {activeProject.media.length > 1 && (
                  <>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        changeMediaIndex(-1);
                      }}
                      disabled={isMediaTransitioning}
                      className={`absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white shadow-lg md:p-4 transition-opacity duration-200 ${isMediaTransitioning ? 'opacity-60 cursor-not-allowed' : 'hover:bg-black/80'}`}
                      aria-label="Previous media"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        changeMediaIndex(1);
                      }}
                      disabled={isMediaTransitioning}
                      className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/70 p-3 text-white shadow-lg md:p-4 transition-opacity duration-200 ${isMediaTransitioning ? 'opacity-60 cursor-not-allowed' : 'hover:bg-black/80'}`}
                      aria-label="Next media"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                      {activeProject.media.map((_, dotIndex) => (
                        <span
                          key={dotIndex}
                          className={`h-2 w-2 rounded-full ${dotIndex === activeMediaIndex ? 'bg-white' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <p className="mt-4 text-sm text-[#888]">
                {activeProject.media.length > 1
                  ? 'Tap next or use the arrows to see more of this project.'
                  : 'Tap the image to zoom in and out.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
