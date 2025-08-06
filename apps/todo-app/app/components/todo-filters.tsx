import { Button } from '@todo-starter/ui';
import type { TodoFilter } from '@todo-starter/utils';

interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

const filters: { key: TodoFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
];

export function TodoFilters({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted
}: TodoFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 border rounded-lg bg-card">
      <div className="flex gap-1">
        {filters.map(filter => (
          <Button
            key={filter.key}
            variant={currentFilter === filter.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{activeCount} active</span>
        {completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="text-destructive hover:text-destructive"
          >
            Clear completed
          </Button>
        )}
      </div>
    </div>
  );
}

