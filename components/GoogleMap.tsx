"use client";

interface GoogleMapProps {
  address: string;
  height?: string;
  className?: string;
}

export default function GoogleMap({ address, height = "400px", className = "" }: GoogleMapProps) {
  const mapsAddress = encodeURIComponent(address);
  
  // Use Google Maps Embed API if key is available, otherwise use basic embed
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapsAddress}&zoom=15`
    : `https://www.google.com/maps?q=${mapsAddress}&output=embed&zoom=15`;

  return (
    <div className={`w-full overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Elite Surgical Coders Location"
        className="w-full"
      />
    </div>
  );
}

