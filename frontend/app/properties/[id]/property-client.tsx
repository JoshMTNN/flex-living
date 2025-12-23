'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { reviewsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { formatDate, getRatingColor } from '@/lib/utils';
import { Star, MapPin, Bed, Bath, Users, Wifi, Tv, Car, UtensilsCrossed } from 'lucide-react';

type DateRange = { from?: Date; to?: Date };

export default function PropertyClientPage({ propertyId }: { propertyId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publicReviews', propertyId],
    queryFn: () => reviewsApi.getPublicReviewsForProperty(propertyId),
  });

  const { data: details } = useQuery({
    queryKey: ['propertyDetails', propertyId],
    queryFn: () => reviewsApi.getPropertyDetails(propertyId),
  });

  const getPropertyDetails = (name: string) => {
    const parts = name.split(' - ');
    const address = parts.length > 1 ? parts[1] : name;
    const roomInfo = parts[0] || '';
    const bedrooms = roomInfo.match(/(\d+)B/)?.[1] || '2';
    const bathrooms = roomInfo.match(/N(\d+)/)?.[1] || '1';

    return {
      address,
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      guests: parseInt(bedrooms) * 2,
    };
  };

  const propertyDetails = details
    ? {
        address: details.address,
        bedrooms: details.bedrooms,
        bathrooms: details.bathrooms,
        guests: details.guests,
      }
    : getPropertyDetails(propertyId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading property details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading property</div>
      </div>
    );
  }

  const stayPolicies: {
    title: string;
    content: { label: string; value?: string; details?: string[] }[];
  }[] = [
    {
      title: 'Check-in & Check-out',
      content: [
        { label: 'Check-in Time', value: '3:00 PM' },
        { label: 'Check-out Time', value: '10:00 AM' },
      ],
    },
    {
      title: 'House Rules',
      content: [
        { label: 'No smoking' },
        { label: 'No pets' },
        { label: 'No parties or events' },
        { label: 'Security deposit required' },
      ],
    },
    {
      title: 'Cancellation Policy',
      content: [
        {
          label: 'For stays less than 28 days',
          details: [
            'Full refund up to 14 days before check-in',
            'No refund for bookings less than 14 days before check-in',
          ],
        },
        {
          label: 'For stays of 28 days or more',
          details: [
            'Full refund up to 30 days before check-in',
            'No refund for bookings less than 30 days before check-in',
          ],
        },
      ],
    },
  ];

  const heroImages = details?.images?.length
    ? details.images
    : [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484156818044-c040038b0710?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      ];

  const amenityGroups = details?.amenities?.map((label) => ({ icon: Wifi, label })) || [
    { icon: Wifi, label: 'Internet' },
    { icon: WashingMachineIcon, label: 'Washing Machine' },
    { icon: SmokeDetectorIcon, label: 'Smoke Detector' },
    { icon: HairDryerIcon, label: 'Hair Dryer' },
    { icon: CarbonMonoxideIcon, label: 'Carbon Monoxide Detector' },
    { icon: UtensilsCrossed, label: 'Kitchen' },
    { icon: FlameIcon, label: 'Heating' },
    { icon: ShieldIcon, label: 'Essentials' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Flex Living
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Home
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-4 gap-2 md:gap-3 h-[300px] sm:h-[420px] md:h-[520px] rounded-lg overflow-hidden">
            <div className="col-span-4 md:col-span-2 md:row-span-2">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[0]})` }}
              />
            </div>
            <div className="hidden md:block">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[1]})` }}
              />
            </div>
            <div className="hidden md:block">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[2]})` }}
              />
            </div>
            <div className="hidden md:block">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[3]})` }}
              />
            </div>
            <div className="relative">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImages[4]})` }}
              />
              <button className="absolute bottom-3 right-3 bg-card text-sm px-3 py-2 rounded-md shadow hover:shadow-md border border-border">
                View all photos
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">{details?.title || propertyId}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{propertyDetails.guests} Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4" />
              <span>{propertyDetails.bedrooms} Bedrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-4 w-4" />
              <span>{propertyDetails.bathrooms} Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{details?.address || 'London'}</span>
            </div>
            {data && data.averageRating > 0 ? (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="text-foreground font-medium">
                  {data.averageRating.toFixed(1)} ({data.totalCount})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>No ratings yet</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">About this property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {details?.description ||
                    `This apartment is located on ${propertyDetails.address}, a quiet yet convenient spot in the heart of London. It’s a spacious unit with all the essentials you’ll need, including top-quality amenities. The location is ideal, with easy access to transport and nearby shops and cafes.`}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Amenities</h2>
                  <button className="text-sm text-primary hover:underline">View all amenities</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {amenityGroups.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-foreground">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-xl font-semibold">Stay Policies</h2>
                {stayPolicies.map((policy, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="font-semibold text-foreground">{policy.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {policy.content.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground"
                        >
                          {item.label && <p className="font-medium">{item.label}</p>}
                          {item.value && <p className="text-muted-foreground">{item.value}</p>}
                          {item.details && (
                            <ul className="mt-2 space-y-1 text-muted-foreground text-xs list-disc list-inside">
                              {item.details.map((d: string, di: number) => (
                                <li key={di}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">Location</h2>
                {details?.location ? (
                  <iframe
                    title="map"
                    className="h-64 w-full rounded-md border border-border"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${details.location.lng - 0.02}%2C${details.location.lat - 0.02}%2C${details.location.lng + 0.02}%2C${details.location.lat + 0.02}&layer=mapnik&marker=${details.location.lat}%2C${details.location.lng}`}
                  />
                ) : (
                  <div className="h-64 w-full rounded-md border border-border bg-muted flex items-center justify-center text-muted-foreground">
                    Map placeholder
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border bg-card">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Guest Reviews</h2>
                  {data && data.averageRating > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="font-medium text-foreground">{data.averageRating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{data.totalCount} reviews</span>
                    </div>
                  )}
                </div>

                {data && data.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {data.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{review.guestName}</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(review.submittedAt)}</p>
                          </div>
                          {review.rating !== null && (
                            <div className="flex items-center gap-1.5 ml-4">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating!
                                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                                        : 'text-muted-foreground/50 fill-muted-foreground/50'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className={`text-lg font-bold ml-1 ${getRatingColor(review.rating)}`}>
                                {review.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-foreground leading-relaxed mb-3">{review.publicReview}</p>
                        {review.reviewCategory && review.reviewCategory.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {review.reviewCategory.map((cat) => (
                              <Badge
                                key={cat.category}
                                variant="secondary"
                                className="text-xs bg-muted text-foreground border-0"
                              >
                                {cat.category.replace(/_/g, ' ')}: {cat.rating ?? 'N/A'}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-lg">No reviews yet</p>
                    <p className="text-sm">No approved reviews available for this property at the moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-border sticky top-6 bg-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Book Your Stay</h3>
                <div className="space-y-4">
                  <DateRangePicker />
                  <label className="text-xs text-muted-foreground flex flex-col gap-1">
                    <span>Guests</span>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      defaultValue={propertyDetails.guests}
                    />
                  </label>
                  <button className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium hover:opacity-90">
                    Check availability
                  </button>
                  <button className="w-full rounded-md border border-border bg-muted/60 py-2 text-sm font-medium hover:bg-muted">
                    Send inquiry
                  </button>
                  <p className="text-xs text-muted-foreground text-center">Instant booking confirmation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function WashingMachineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 7h8" />
      <path d="M9 5h2" />
    </svg>
  );
}

function SmokeDetectorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6a9 3 0 0 0 18 0V5" />
      <path d="M12 16v3" />
      <path d="M8 17v2" />
      <path d="M16 17v2" />
    </svg>
  );
}

function HairDryerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 10h6l7-4v8l-7-4H3z" />
      <path d="M14 14v2a2 2 0 0 1-2 2H9" />
      <path d="M16 10h3" />
    </svg>
  );
}

function CarbonMonoxideIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="8" cy="12" r="3" />
      <circle cx="16" cy="12" r="3" />
      <path d="M11 12h2" />
    </svg>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3s-3 4-3 7a3 3 0 0 0 6 0c0-3-3-7-3-7Z" />
      <path d="M12 12.5a2.5 2.5 0 1 0 2 4" />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
    </svg>
  );
}

function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({});

  const formatted = useMemo(() => {
    if (range.from && range.to) {
      return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
    }
    if (range.from) return `${range.from.toLocaleDateString()} - Select end`;
    return 'dd/mm/yyyy';
  }, [range]);

  const months = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    const next = new Date(start);
    next.setMonth(next.getMonth() + 1);
    return [start, next];
  }, []);

  const onSelectDate = (date: Date) => {
    if (!range.from || (range.from && range.to)) {
      setRange({ from: date, to: undefined });
    } else if (range.from && !range.to) {
      if (date < range.from) {
        setRange({ from: date, to: range.from });
      } else {
        setRange({ from: range.from, to: date });
      }
      setOpen(false);
    }
  };

  const renderMonth = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (Date | null)[][] = [];
    let current: (Date | null)[] = Array(startDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      current.push(new Date(year, month, d));
      if (current.length === 7) {
        weeks.push(current);
        current = [];
      }
    }
    if (current.length) {
      while (current.length < 7) current.push(null);
      weeks.push(current);
    }

    const isSelected = (day: Date) => {
      if (!range.from) return false;
      if (range.from && !range.to) return day.toDateString() === range.from.toDateString();
      return day >= range.from! && day <= range.to!;
    };

    return (
      <div key={`${year}-${month}`} className="space-y-3 rounded-md border border-border/60 bg-background p-3">
        <div className="text-sm font-semibold text-foreground">
          {monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-sm">
          {weeks.flat().map((day, idx) =>
            day ? (
              <button
                key={idx}
                onClick={() => onSelectDate(day)}
                className={`h-9 w-9 mx-auto rounded-md transition-colors ${
                  isSelected(day) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                }`}
              >
                {day.getDate()}
              </button>
            ) : (
              <span key={idx} />
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
      <span>Select dates</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-left"
        >
          {formatted}
        </button>
        {open && (
          <div className="absolute z-50 mt-2 w-[380px] rounded-lg border border-border bg-card p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-3">{months.map(renderMonth)}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => setRange({})}
              >
                Clear
              </button>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

