'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatDate, getRatingColor, getRatingBgColor } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { NormalizedReview } from '../../../shared/types/review.types';
import { LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'property'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, error } = useQuery({
    queryKey: ['reviews'],
    queryFn: reviewsApi.getAllReviews,
  });

  const { data: approvals } = useQuery({
    queryKey: ['approvals'],
    queryFn: reviewsApi.getAllApprovals,
  });

  const approveMutation = useMutation({
    mutationFn: ({ reviewId, approved }: { reviewId: number; approved: boolean }) =>
      reviewsApi.updateApprovalStatus(reviewId, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
  });

  const parsedReviews = useMemo(
    () =>
      (data?.reviews || []).map((r) => ({
        ...r,
        submittedAt: new Date(r.submittedAt),
      })),
    [data]
  );

  const filteredAndSortedReviews = useMemo(() => {
    if (!parsedReviews.length) return [];

    let filtered = [...parsedReviews];

    if (selectedProperty !== 'all') {
      filtered = filtered.filter((r) => r.listingName === selectedProperty);
    }

    if (selectedRating !== 'all') {
      const rating = parseInt(selectedRating);
      filtered = filtered.filter((r) => r.rating === rating);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((r) =>
        r.reviewCategory.some((cat) => cat.category === selectedCategory)
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = a.submittedAt.getTime() - b.submittedAt.getTime();
      } else if (sortBy === 'rating') {
        const aRating = a.rating ?? 0;
        const bRating = b.rating ?? 0;
        comparison = aRating - bRating;
      } else if (sortBy === 'property') {
        comparison = a.listingName.localeCompare(b.listingName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [
    parsedReviews,
    selectedProperty,
    selectedRating,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedReviews.length / pageSize));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const paginatedReviews = filteredAndSortedReviews.slice(
    (currentPageSafe - 1) * pageSize,
    currentPageSafe * pageSize
  );

  const properties = useMemo(() => {
    if (!data?.summary.byProperty) return [];
    return data.summary.byProperty.map((p) => p.propertyName);
  }, [data]);

  const stats = useMemo(() => {
    const total = data?.summary.totalReviews ?? 0;
    const avg = data?.summary.averageRating ?? 0;
    const fallbackPublished = parsedReviews.filter((r) => r.status === 'published').length;
    const fallbackPending = parsedReviews.filter((r) => r.status === 'pending').length;
    const fallbackDraft = parsedReviews.filter((r) => r.status === 'draft').length;
    const published = data?.summary.publishedCount ?? fallbackPublished;
    const pending = data?.summary.pendingCount ?? fallbackPending;
    const draftCount = data?.summary.draftCount ?? fallbackDraft;
    return { total, avg, published, pending, draftCount, propertiesCount: properties.length };
  }, [data, properties, parsedReviews]);

  const categories = useMemo(() => {
    if (!data?.summary.byCategory) return [];
    return data.summary.byCategory.map((c) => c.category);
  }, [data]);

  const ratingTrendData = useMemo(() => {
    if (!parsedReviews.length) return [];
    const monthlyData: Record<string, { month: string; avgRating: number; count: number }> = {};

    parsedReviews.forEach((review) => {
      const month = review.submittedAt.toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { month, avgRating: 0, count: 0 };
      }
      if (review.rating !== null) {
        monthlyData[month].avgRating += review.rating;
        monthlyData[month].count += 1;
      }
    });

    return Object.values(monthlyData)
      .map((d) => ({
        month: d.month,
        avgRating: d.count > 0 ? d.avgRating / d.count : 0,
        count: d.count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data]);

  const categoryPerformanceData = useMemo(() => {
    if (!data?.summary.byCategory) return [];
    return data.summary.byCategory.map((cat) => ({
      category: cat.category.replace(/_/g, ' '),
      rating: cat.averageRating,
    }));
  }, [data]);

  const ratingChartConfig: ChartConfig = {
    avgRating: { label: 'Avg Rating', color: '#045a38' },
  };

  const categoryChartConfig: ChartConfig = {
    rating: { label: 'Rating', color: '#045a38' },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-600">Error loading reviews</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 px-3 sm:px-4 md:px-6">
      <div className="rounded-2xl border bg-card/90 text-card-foreground shadow-sm backdrop-blur">
        <div className="flex flex-col gap-2 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground/90 dark:text-foreground/90">
              Flex Living · Reviews
            </p>
            <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor performance and curate public-facing reviews.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t bg-card/70 px-6 py-5 md:grid-cols-4 lg:grid-cols-5">
          <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground">Total Reviews</CardDescription>
              <CardTitle className="text-2xl text-foreground">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground">Average Rating</CardDescription>
              <CardTitle className="text-2xl text-foreground">{stats.avg.toFixed(1)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground">Published</CardDescription>
              <CardTitle className="text-2xl text-foreground">{stats.published}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground">Pending</CardDescription>
              <CardTitle className="text-2xl text-foreground">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
            <CardHeader className="p-4 pb-2">
              <CardDescription className="text-muted-foreground">Properties</CardDescription>
              <CardTitle className="text-2xl text-foreground">{stats.propertiesCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/90 text-card-foreground shadow-sm backdrop-blur p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Property Performance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.summary.byProperty.map((property) => {
            const propertyUrl = `/properties/${encodeURIComponent(property.propertyName)}`;
            return (
              <Link key={property.propertyName} href={propertyUrl}>
                <Card className="border border-border bg-card/90 text-card-foreground shadow-none hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-foreground hover:text-primary transition-colors">
                      {property.propertyName}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {property.reviewCount} review{property.reviewCount !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${getRatingColor(property.averageRating)}`}
                      >
                        {property.averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 5.0</span>
                    </div>
                    <div
                      className={`mt-3 h-2 rounded-full ${getRatingBgColor(property.averageRating)}`}
                    />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Rating Trends</CardTitle>
            <CardDescription className="text-muted-foreground">
              Average rating over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={ratingChartConfig}
              className="h-[240px] sm:h-[280px] md:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ratingTrendData}
                  accessibilityLayer
                  margin={{ top: 12, right: 12, bottom: 8, left: 12 }}
                >
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const d = new Date(`${value}-01`);
                      return Number.isNaN(d.getTime())
                        ? value
                        : d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    defaultIndex={ratingTrendData.length ? ratingTrendData.length - 1 : 0}
                  />
                  <Line
                    type="natural"
                    dataKey="avgRating"
                    stroke="var(--color-avgRating, #4f46e5)"
                    name="Avg Rating"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <div className="flex flex-col gap-2 px-6 pb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Showing average rating over time.</div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Category Performance</CardTitle>
            <CardDescription className="text-muted-foreground">
              Average ratings by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={categoryChartConfig}
              className="h-[240px] sm:h-[280px] md:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryPerformanceData}
                  accessibilityLayer
                  margin={{ top: 12, right: 12, bottom: 8, left: 12 }}
                >
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => String(value).slice(0, 10)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    defaultIndex={
                      categoryPerformanceData.length ? categoryPerformanceData.length - 1 : 0
                    }
                  />
                  <Bar dataKey="rating" fill="var(--color-rating, #16a34a)" radius={8}>
                    <LabelList
                      dataKey="rating"
                      position="top"
                      offset={12}
                      className="fill-foreground"
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <div className="flex flex-col gap-2 px-6 pb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground">Average category ratings.</div>
          </div>
        </Card>
      </div>

      <Card className="shadow-sm border border-border bg-card/90 text-card-foreground">
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>Filter, sort, and approve reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((prop) => (
                  <SelectItem key={prop} value={prop}>
                    {prop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [by, order] = value.split('-');
                setSortBy(by as 'date' | 'rating' | 'property');
                setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="rating-desc">Rating (Highest)</SelectItem>
                <SelectItem value="rating-asc">Rating (Lowest)</SelectItem>
                <SelectItem value="property-asc">Property (A-Z)</SelectItem>
                <SelectItem value="property-desc">Property (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {paginatedReviews.map((review) => (
              <Card
                key={review.id}
                className={`border ${review.approvedForPublic ? 'border-green-500/60' : 'border-border'} shadow-sm bg-card/90 text-card-foreground`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{review.guestName}</h3>
                        <Badge variant={review.status === 'published' ? 'success' : 'warning'}>
                          {review.status}
                        </Badge>
                        <Badge variant="outline">{review.type}</Badge>
                        {review.rating !== null && (
                          <span className={`font-semibold ${getRatingColor(review.rating)}`}>
                            {review.rating}/5
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.listingName}</p>
                      <p className="text-foreground leading-relaxed">{review.publicReview}</p>
                      <div className="flex flex-wrap gap-2">
                        {review.reviewCategory.map((cat) => (
                          <Badge key={cat.category} variant="secondary">
                            {cat.category.replace(/_/g, ' ')}: {cat.rating ?? 'N/A'}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 md:pl-4">
                      <Checkbox
                        checked={review.approvedForPublic || false}
                        onCheckedChange={(checked) => {
                          approveMutation.mutate({
                            reviewId: review.id,
                            approved: checked as boolean,
                          });
                        }}
                      />
                      <span className="text-sm text-muted-foreground">Approve</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredAndSortedReviews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reviews match the selected filters
              </div>
            )}
            {filteredAndSortedReviews.length > 0 && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                    />
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const page = idx + 1;
                      if (totalPages > 7) {
                        const show =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPageSafe) <= 1 ||
                          (currentPageSafe <= 3 && page <= 4) ||
                          (currentPageSafe >= totalPages - 2 && page >= totalPages - 3);
                        if (!show) {
                          if (page === 2 || page === totalPages - 1) {
                            return (
                              <PaginationItem key={`ellipsis-${page}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }
                      }
                      return (
                        <PaginationLink
                          key={page}
                          href="#"
                          isActive={page === currentPageSafe}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      );
                    })}
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
