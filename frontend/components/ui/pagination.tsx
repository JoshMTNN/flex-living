import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  )
);
PaginationItem.displayName = 'PaginationItem';

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<typeof Link>;

const PaginationLink = ({ className, isActive, href, ...props }: PaginationLinkProps) => (
  <PaginationItem>
    <Link
      href={href ?? '#'}
      className={cn(
        'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground border-border hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    />
  </PaginationItem>
);
PaginationLink.displayName = 'PaginationLink';

const PaginationPrevious = ({ className, href, ...props }: React.ComponentProps<typeof Link>) => (
  <PaginationItem>
    <Link
      href={href ?? '#'}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    >
      Previous
    </Link>
  </PaginationItem>
);
PaginationPrevious.displayName = 'PaginationPrevious';

const PaginationNext = ({ className, href, ...props }: React.ComponentProps<typeof Link>) => (
  <PaginationItem>
    <Link
      href={href ?? '#'}
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
        className
      )}
      {...props}
    >
      Next
    </Link>
  </PaginationItem>
);
PaginationNext.displayName = 'PaginationNext';

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span
    className={cn('inline-flex h-9 items-center justify-center px-2 text-sm', className)}
    {...props}
  >
    ...
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

