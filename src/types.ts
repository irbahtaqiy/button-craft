export interface ButtonItem {
  id: string;
  name: string;
  category: 'minimal' | 'glow' | 'cyberpunk' | '3d' | 'brutalist' | 'glass' | 'retro' | 'playful';
  tags: string[];
  description: string;
  html: string;
  css: string;
  render: (container: HTMLElement) => void;
}
