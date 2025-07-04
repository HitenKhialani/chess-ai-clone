import { useState } from 'react';
import { grandmasterData, GrandmasterInfo as GMInfo } from '@/lib/grandmasterData';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

import { useRouter } from 'next/navigation';



interface GrandmasterInfoProps {
  grandmasterName: string;
}

export function GrandmasterInfo({ grandmasterName }: GrandmasterInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const gmData = grandmasterData[grandmasterName];

  const router = useRouter();



  if (!gmData) {
    return null;
  }

  return (
    <div className="w-full mt-6">
      <Button
        onClick={() => setIsOpen(true)}
        className="btn w-full border border-[var(--accent)] text-white bg-[var(--accent)] font-bold px-6 py-2 rounded-lg shadow"
      >
        Grandmaster Info
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-[var(--modal-bg)] bg-opacity-80 backdrop-blur-sm flex items-center justify-center" onClick={() => setIsOpen(false)} />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative bg-[var(--card)] rounded-xl card-shadow border border-[var(--accent)] max-w-lg w-full mx-4 p-8 text-[var(--card-foreground)] animate-fade-in">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden border border-white border-opacity-20 bg-black/30">
                  <Image
                    src={gmData.imagePath}
                    alt={gmData.fullName}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold mb-2">{gmData.fullName}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-400">Birthplace</span>
                      <div>{gmData.birthplace}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Country</span>
                      <div>{gmData.country}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">FIDE Rating</span>
                      <div>{gmData.fideRating}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">World Championships</span>
                      <div>{gmData.worldChampionships}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Opening Style</span>
                    <div>{gmData.openingStyle}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Playing Style</span>
                    <div>{gmData.playingStyle}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Interesting Facts</span>
                    <div>{gmData.interestingFacts}</div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white btn-glow"
                      onClick={() => {
                        setIsOpen(false);
                        router.push(`/game/grandmaster/${grandmasterName.toLowerCase()}`);
                      }}
                    >
                      View Game
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 