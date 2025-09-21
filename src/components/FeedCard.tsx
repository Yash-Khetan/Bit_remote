import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Utensils, Activity as ActivityIcon, Lightbulb } from 'lucide-react';
import { HealthFeedItem } from '../types';

interface FeedCardProps {
  item: HealthFeedItem;
}

const FeedCard: React.FC<FeedCardProps> = ({ item }) => {
  const { t, i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    switch (item.type) {
      case 'diet': return <Utensils className="w-5 h-5 text-green-600" />;
      case 'exercise': return <ActivityIcon className="w-5 h-5 text-blue-600" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'diet': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-blue-100 text-blue-800';
      case 'tip': return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleAudioPlay = () => {
    // TODO: Implement audio playback with TTS or prerecorded audio
    setIsPlaying(!isPlaying);
    
    // Simulate audio playback
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  // Filter items by current language
  if (item.language !== i18n.language) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {item.imageUrl && (
        <div className="h-40 bg-gray-200">
          <img 
            src={item.imageUrl} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor()}`}>
              {t(`healthFeed.${item.type}`)}
            </span>
          </div>
          
          <button
            onClick={handleAudioPlay}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title={t('healthFeed.playAudio')}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-600" />
            ) : (
              <Play className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">
          {item.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {item.description}
        </p>

        <div className="mt-3 text-xs text-gray-400">
          {item.category}
        </div>
      </div>
    </div>
  );
};

export default FeedCard;