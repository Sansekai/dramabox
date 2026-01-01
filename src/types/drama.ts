export interface TagV3 {
  tagId: number;
  tagName: string;
  tagEnName: string;
}

export interface Corner {
  cornerType: number;
  name: string;
  color: string;
}

export interface RankVo {
  rankType: number;
  hotCode: string;
  sort: number;
}

export interface Drama {
  bookId: string;
  bookName: string;
  coverWap?: string;
  cover?: string;
  chapterCount: number;
  introduction: string;
  tags?: string[];
  tagNames?: string[];
  tagV3s?: TagV3[];
  protagonist?: string;
  playCount?: string;
  corner?: Corner;
  rankVo?: RankVo;
  shelfTime?: string;
  inLibrary: boolean;
}

export interface SearchResult {
  bookId: string;
  bookName: string;
  introduction: string;
  author: string;
  cover: string;
  protagonist: string;
  tagNames: string[];
  inLibrary: boolean;
}
