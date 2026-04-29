import React from 'react';

interface LinkifyProps {
  text: string;
}

const Linkify: React.FC<LinkifyProps> = ({ text }) => {
  if (!text) return null;

  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split text by URLs and keep the matches
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
              onClick={(e) => e.stopPropagation()} // Prevent card click if inside a card
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
};

export default Linkify;
