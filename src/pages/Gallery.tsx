import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getGallery } from "../services/firebase";
import { DEFAULT_GALLERY, LOCAL_ASSETS } from "../lib/defaults";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Gallery() {
  const [photos, setPhotos] = useState<any[]>(DEFAULT_GALLERY);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await getGallery();
        if (data && data.length > 0) {
          setPhotos(data);
        }
      } catch (e) {
        console.warn("Using default corporate gallery", e);
      }
    };
    fetchGallery();
  }, []);

  const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category || "General")))];
  const filteredPhotos =
    filter === "All" ? photos : photos.filter((p) => (p.category || "General") === filter);

  return (
    <div className="space-y-14 pb-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Visual Archive
        </p>
        <h1 className="font-heading text-4xl md:text-6xl font-semibold tracking-tight gold-gradient">
          Corporate Gallery
        </h1>
        <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
          Documenting our executive team, architectural spaces, and flagship ventures.
        </p>
      </div>

      {/* Interactive Filter Segmented Control */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-[#111114] text-zinc-400 border border-white/10 hover:text-zinc-100 hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, i) => (
          <div key={photo.id || i}>
            <Dialog>
              <DialogTrigger asChild>
                <motion.button
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04, ease: EASE_OUT_EXPO }}
                  className="group relative text-left cursor-zoom-in overflow-hidden rounded-2xl surface-card aspect-[4/3] w-full"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[11px] font-medium text-primary mb-1">
                      {photo.category || "Archive"}
                    </span>
                    <h3 className="text-base font-semibold text-white">{photo.title}</h3>
                    <div className="absolute top-4 right-4 bg-black/60 border border-white/15 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Maximize2 className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#09090b] border border-white/10">
                <DialogTitle className="sr-only">{photo.title}</DialogTitle>
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-auto max-h-[80vh] object-contain bg-black"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = LOCAL_ASSETS.corporateHq;
                  }}
                />
                <div className="p-6 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">{photo.title}</h3>
                    <p className="text-xs text-primary mt-1">{photo.category || "Archive"}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
