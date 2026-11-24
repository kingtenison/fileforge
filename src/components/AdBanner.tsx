'use client';

export default function AdBanner() {
  return (
    <div className="mb-8 md:mb-12 flex flex-col items-center px-4 sm:px-6 lg:px-10">
      <div className="text-center mb-2">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          Ads keep FileForge free for everyone
        </p>
      </div>
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white max-w-[728px] w-full shadow-sm">
        <iframe
          src="https://www.profitablecpmratenetwork.com/jpu5xippg?key=6338972fc5b07b3a0c19b8ac58a4142e"
          className="w-full"
          style={{ height: '90px', maxWidth: '728px' }}
          frameBorder="0"
          scrolling="no"
          title="Advertisement"
        />
      </div>
    </div>
  );
}
