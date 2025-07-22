'use client';
import React from 'react';

type Challenge = {
  id: string;
  title: string;
  category: string;
  type?: 'active' | 'featured';
  description?: string;
  daysLeft?: number;
  progress?: number;
  total?: number;
  status?: 'Ongoing' | 'Completed';
};

interface Props {
  challenge: Challenge;
  onJoin: (id: string) => void;
  onRemove: (id: string) => void;
}

const ChallengeCard = ({ challenge, onJoin, onRemove }: Props) => {
  const {
    id,
    title,
    description,
    category,
    daysLeft,
    progress,
    total,
    status,
    type,
  } = challenge;

  const progressPercent = progress && total ? (progress / total) * 100 : 0;

  return (
    <div
      className={`relative rounded-xl p-4 shadow ${
        type === 'featured' ? 'bg-blue-500 text-white' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {daysLeft !== undefined && (
          <span
            className={`text-xs rounded-full px-2 py-0.5 font-medium ${
              type === 'featured'
                ? 'bg-white text-black'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {daysLeft} days left
          </span>
        )}
      </div>

      {description && <p className="text-sm mb-2">{description}</p>}

      {status && (
        <span
          className={`inline-block mb-2 px-2 py-1 text-xs rounded-full ${
            status === 'Completed'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {status}
        </span>
      )}

      {progress !== undefined && total !== undefined && (
        <div className="mt-1">
          <p className="text-sm mb-1">
            {progress} of {total} days completed
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor:
                  category === 'diet'
                    ? '#3b82f6'
                    : category === 'home'
                    ? '#f59e0b'
                    : '#10b981',
              }}
            />
          </div>
        </div>
      )}

      {/* Button logic based on status */}
      <div className="mt-4">
        {status === 'Completed' ? (
          <button
            disabled
            className="w-full py-2 rounded bg-gray-300 text-gray-700 text-sm font-medium cursor-not-allowed"
          >
            Completed
          </button>
        ) : status === 'Ongoing' ? (
          <button
            onClick={() => onRemove(id)}
            className="w-full py-2 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => onJoin(id)}
            className={`w-full py-2 rounded text-sm font-medium ${
              type === 'featured'
                ? 'bg-white text-blue-600 hover:bg-blue-100'
                : 'text-blue-600 hover:underline'
            }`}
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
