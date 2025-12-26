import React, { useState, useEffect } from 'react';
import { CareerRecommendation } from '../lib/types';
import { CareerRecommendationCard } from './CareerRecommendationCard';
import { CareerComparison } from './CareerComparison';
import { NBButton } from './NBButton';
import { NBCard } from './NBCard';
import { cn } from '../lib/utils';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  BarChart3, 
  Bookmark,
  Target,
  DollarSign,
  TrendingUp,
  Search,
  X
} from 'lucide-react';

interface CareerRecommendationsListProps {
  recommendations: CareerRecommendation[];
  onSelectCareer?: (recommendation: CareerRecommendation) => void;
  onSaveCareer?: (recommendation: CareerRecommendation) => void;
  onViewDetails?: (recommendation: CareerRecommendation) => void;
  savedCareerIds?: string[];
  selectedCareerId?: string;
  className?: string;
}

type SortOption = 'fitScore' | 'salary' | 'growth' | 'demand' | 'title';
type FilterOption = 'all' | 'high-fit' | 'high-salary' | 'high-growth' | 'saved';

export const CareerRecommendationsList: React.FC<CareerRecommendationsListProps> = ({
  recommendations,
  onSelectCareer,
  onSaveCareer,
  onViewDetails,
  savedCareerIds = [],
  selectedCareerId,
  className
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('fitScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filteredRecommendations, setFilteredRecommendations] = useState<CareerRecommendation[]>(recommendations);

  // Update filtered recommendations when inputs change
  useEffect(() => {
    let filtered = [...recommendations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.relatedRoles?.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'high-fit':
        filtered = filtered.filter(rec => rec.fitScore >= 80);
        break;
      case 'high-salary':
        filtered = filtered.filter(rec => rec.salaryRange.max >= 100000);
        break;
      case 'high-growth':
        filtered = filtered.filter(rec => rec.growthProspects === 'high');
        break;
      case 'saved':
        filtered = filtered.filter(rec => savedCareerIds.includes(rec.id));
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'fitScore':
          aValue = a.fitScore;
          bValue = b.fitScore;
          break;
        case 'salary':
          aValue = a.salaryRange.max;
          bValue = b.salaryRange.max;
          break;
        case 'growth':
          aValue = a.growthProspects === 'high' ? 3 : a.growthProspects === 'medium' ? 2 : 1;
          bValue = b.growthProspects === 'high' ? 3 : b.growthProspects === 'medium' ? 2 : 1;
          break;
        case 'demand':
          aValue = a.jobMarketData?.demand === 'high' ? 3 : a.jobMarketData?.demand === 'medium' ? 2 : 1;
          bValue = b.jobMarketData?.demand === 'high' ? 3 : b.jobMarketData?.demand === 'medium' ? 2 : 1;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        default:
          aValue = a.fitScore;
          bValue = b.fitScore;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

    setFilteredRecommendations(filtered);
  }, [recommendations, sortBy, sortOrder, filterBy, searchTerm, savedCareerIds]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  const handleCompareToggle = (recommendation: CareerRecommendation) => {
    setSelectedForComparison(prev => {
      if (prev.includes(recommendation.id)) {
        return prev.filter(id => id !== recommendation.id);
      } else if (prev.length < 4) { // Limit to 4 comparisons
        return [...prev, recommendation.id];
      }
      return prev;
    });
  };

  const handleShowComparison = () => {
    setShowComparison(true);
  };

  const getComparisonRecommendations = () => {
    return recommendations.filter(rec => selectedForComparison.includes(rec.id));
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  const getFilterCount = (filter: FilterOption) => {
    switch (filter) {
      case 'high-fit':
        return recommendations.filter(rec => rec.fitScore >= 80).length;
      case 'high-salary':
        return recommendations.filter(rec => rec.salaryRange.max >= 100000).length;
      case 'high-growth':
        return recommendations.filter(rec => rec.growthProspects === 'high').length;
      case 'saved':
        return savedCareerIds.length;
      default:
        return recommendations.length;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Controls */}
      <NBCard className="p-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search careers, skills, or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex space-x-1">
                {[
                  { key: 'all', label: 'All', icon: null },
                  { key: 'high-fit', label: 'High Fit', icon: Target },
                  { key: 'high-salary', label: 'High Salary', icon: DollarSign },
                  { key: 'high-growth', label: 'High Growth', icon: TrendingUp },
                  { key: 'saved', label: 'Saved', icon: Bookmark }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setFilterBy(key as FilterOption)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1',
                      filterBy === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{label}</span>
                    <span className="bg-background/20 px-1 rounded">
                      {getFilterCount(key as FilterOption)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Sort by:</span>
              <div className="flex space-x-1">
                {[
                  { key: 'fitScore', label: 'Fit Score' },
                  { key: 'salary', label: 'Salary' },
                  { key: 'growth', label: 'Growth' },
                  { key: 'demand', label: 'Demand' },
                  { key: 'title', label: 'Name' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => handleSort(key as SortOption)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center space-x-1',
                      sortBy === key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    <span>{label}</span>
                    {getSortIcon(key as SortOption)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comparison Controls */}
          {selectedForComparison.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedForComparison.length} career{selectedForComparison.length > 1 ? 's' : ''} selected for comparison
                </span>
              </div>
              <div className="flex space-x-2">
                <NBButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedForComparison([])}
                >
                  Clear
                </NBButton>
                <NBButton
                  size="sm"
                  onClick={handleShowComparison}
                  disabled={selectedForComparison.length < 2}
                >
                  Compare ({selectedForComparison.length})
                </NBButton>
              </div>
            </div>
          )}
        </div>
      </NBCard>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredRecommendations.length} of {recommendations.length} career recommendations
          {searchTerm && ` for "${searchTerm}"`}
        </div>
        {filteredRecommendations.length === 0 && (
          <NBButton
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterBy('all');
            }}
          >
            Clear Filters
          </NBButton>
        )}
      </div>

      {/* Recommendations Grid */}
      {filteredRecommendations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecommendations.map((recommendation) => (
            <CareerRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              isSelected={selectedCareerId === recommendation.id}
              isSaved={savedCareerIds.includes(recommendation.id)}
              onSelect={onSelectCareer}
              onSave={onSaveCareer}
              onViewDetails={onViewDetails}
              onCompare={handleCompareToggle}
              showCompareButton={selectedForComparison.length < 4}
            />
          ))}
        </div>
      ) : (
        <NBCard className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-secondary rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No careers found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `No careers match your search for "${searchTerm}"`
                  : 'No careers match your current filters'
                }
              </p>
            </div>
            <NBButton
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterBy('all');
              }}
            >
              Clear all filters
            </NBButton>
          </div>
        </NBCard>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <CareerComparison
          recommendations={getComparisonRecommendations()}
          onClose={() => setShowComparison(false)}
          onSelect={(rec) => {
            onSelectCareer?.(rec);
            setShowComparison(false);
          }}
        />
      )}
    </div>
  );
};