export interface ServicePost {
  id: number;
  title: string;
  description: string;
  price: number;
  created_at: string;
  author: number;
  author_username: string;
  author_email: string;
  author_phone: string;
  author_telegram: string;
  category: number;
  category_name: string;
  average_rating: number;
  total_votes: number;
}