export type FavoriteTargetType = 'case' | 'organization';

export interface Favorite {
  id: string;
  userId: string;
  targetType: FavoriteTargetType;
  targetId: string;
  caseType?: 'lost' | 'found' | 'adoption' | 'transit';
  createdAt: Date;
}
