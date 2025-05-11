import { Play } from "lucide-react";
import { useState } from "react";
import { getImagePath } from "@/App";

export const Testimonials = () => {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section 
      className="py-16 bg-white" 
      style={{ 
        borderBottom: 'none', 
        marginBottom: '-1px',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            {!showVideo ? (
              <>
                <picture>
                  <source srcSet={getImagePath("/images/f.webp")} type="image/webp" />
                  <img 
                    src={getImagePath("/images/f.jpeg")}
                    alt="AI Program Video"
                    className="w-full aspect-video object-cover"
                    loading="lazy" 
                    width="1280"
                    height="720"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/1280x720/333/fff?text=Video+Thumbnail";
                    }}
                  />
                </picture>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
                    onClick={() => setShowVideo(true)}
                    aria-label="Play video"
                  >
                    <Play size={30} />
                  </button>
                </div>
              </>
            ) : (
              <div className="aspect-video w-full">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="https://www.youtube.com/embed/t48AxhKTMc4?autoplay=1&cc_load_policy=1&cc_lang_pref=he&rel=0" 
                  title="AI Program Video"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="aspect-video"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
