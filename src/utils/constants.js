export const CATEGORIES = [
  { value: 'work', label: 'Work', color: '#3B82F6' },
  { value: 'home', label: 'Home', color: '#10B981' },
  { value: 'travel', label: 'Travel', color: '#F59E0B' },
  { value: 'dining', label: 'Dining', color: '#EF4444' },
  { value: 'hiking', label: 'Hiking', color: '#8B5CF6' },
  { value: 'other', label: 'Other', color: '#6B7280' },
];

export const getCategoryColor = (category) => {
  const cat = CATEGORIES.find((c) => c.value === category);
  return cat ? cat.color : '#6B7280';
};

export const getCategoryLabel = (category) => {
  const cat = CATEGORIES.find((c) => c.value === category);
  return cat ? cat.label : 'Other';
};