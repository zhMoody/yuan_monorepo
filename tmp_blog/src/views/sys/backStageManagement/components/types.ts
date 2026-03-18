declare module RowData {
  interface Category {
    name?: string
    keyword?: string
  }

  interface Data {
    key: string
    author: string
    title: number
    created: string
    keyword: string
    category_id: Category
    tags: string[]
  }
}

declare module CRowData {
  interface Data {
    _id: string
    name: string
    keyword: string
  }
}
