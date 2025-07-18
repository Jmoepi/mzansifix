export type IssueCategory =
  | 'Road Maintenance'
  | 'Water and Sanitation'
  | 'Electricity'
  | 'Waste Management'
  | 'Public Safety'
  | 'Other';

export type IssueStatus = 'Open' | 'Acknowledged' | 'In Progress' | 'Resolved';

export interface Reporter {
    name: string;
    avatarUrl: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  location: string;
  imageUrl?: string;
  aiHint?: string;
  createdAt: string;
  updatedAt: string;
  reporterId: string; // Changed from an object to just the ID
  reporter: Reporter;
  votes: number;
  comments: number;
}
