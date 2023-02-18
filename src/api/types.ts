declare module Article {

  export interface CategoryId {
    _id: string;
    name: string;
    keyword: string;
    __v: number;
  }

  export interface Result {
    browse: number;
    _id: string;
    title: string;
    author: string;
    cover: string;
    keyword: string;
    description: string;
    content: string;
    category_id: CategoryId;
    created: Date;
    updated: Date;
  }

  export interface Data {
    result: Result[];
    pagenum: string;
    pagesize: string;
    tootal: number;
  }

  export interface RootObject {
    msg: string;
    errorCode: number;
    code: number;
    data: Data;
  }
}

declare module ArcirleDetail {
  export interface CategoryId {
    _id: string;
    name: string;
    keyword: string;
    __v: number;
  }

  export interface ArticleDetail {
    browse: number;
    _id: string;
    title: string;
    author: string;
    cover: string;
    keyword: string;
    description: string;
    content: string;
    category_id: CategoryId;
    created: Date;
    updated: Date;
  }

  export interface CommentList {
    _id: string;
    nickname: string;
    content: string;
    target_id: string;
  }

  export interface Data {
    articleDetail: ArticleDetail;
    commentList: CommentList[];
  }

  export interface RootObject {
    msg: string;
    errorCode: number;
    code: number;
    data: Data;
  }

}

declare module MusicTypes {

  export interface Datum {
    id?: string | number
    name?: string;
    artist?: string;
    url?: string;
    cover?: string;
    lrc?: string;
  }

  export interface RootObject {
    msg: string;
    errorCode: number;
    code: number;
    data: Datum[];
  }

}

declare module DeleteArticle {

  export interface RootObject {
    msg: string;
    errorCode: number;
    code: number;
    data: string;
  }

}


declare module CategroyData {

  export interface ErrRootObject {
    errorMessage: string;
    error_code: number;
    request: string;
  }

  export interface Result {
    _id: string;
    name: string;
    keyword: string;
  }

  export interface Data {
    result: Result[];
    tootal: number;
  }

  export interface RootObject {
    msg: string;
    errorCode: number;
    code: number;
    data: Data;
  }

}



