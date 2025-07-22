'use client';

import { Button } from '@nextui-org/react';

type Tip = {
  _id: string;
  region: string;
  title: string;
  tip: string;
  createdAt: string;
  image?: string;
};

interface TipCardProps {
  tip: Tip;
  onUpdate?: (tip: Tip) => void;
  onDelete?: (id: string) => void;
}

export default function TipCard({ tip, onUpdate, onDelete }: TipCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 my-2 rounded shadow text-black dark:text-white flex flex-col gap-1">
      <span>✅ {tip.title}</span>
      <div className="text-sm text-gray-500">{tip.tip}</div>
      <div className="flex gap-2 mt-2">
        {onUpdate && <Button size="sm" onClick={() => onUpdate(tip)}>Update</Button>}
        {onDelete && <Button size="sm" color="danger" onClick={() => onDelete(tip._id)}>Delete</Button>}
      </div>
    </div>
  );
}