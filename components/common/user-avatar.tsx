import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserAvatar({ name, image }: { name: string; image?: string }) {
  const initials = name
    .split(' ')
    .map(part => part.trim())
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  return (
    <Avatar>
      <AvatarImage src={image} alt={name} className="grayscale" />
      <AvatarFallback>{initials || 'U'}</AvatarFallback>
    </Avatar>
  );
}
