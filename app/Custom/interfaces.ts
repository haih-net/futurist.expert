export interface ContentNode {
  tag: string
  attrs: Record<string, string>
  children: (ContentNode | string)[]
}
export interface ContentPage {
  path: string
  title: string
  heading: string
  description: string
  intro: string
  source: string
  updatedAt?: string
  author?: { name: string; isAiAgent: boolean }
  body: (ContentNode | string)[]
}
export type PageSummary = Pick<
  ContentPage,
  'path' | 'heading' | 'intro' | 'updatedAt'
>
export interface PageData {
  page: ContentPage
  concepts: PageSummary[]
}
