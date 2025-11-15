import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
};

export function SearchInput({ wrapperClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative max-w-md w-full', wrapperClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input {...props} className={cn('pl-10', className)} type="search" />
    </div>
  )
}
