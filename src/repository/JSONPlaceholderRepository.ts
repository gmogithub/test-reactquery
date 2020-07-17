import { HttpRestServiceBuilder } from "../http/builder/HttpRestServiceBuilder";
export const sleep = (time: number): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), time);
  });
};
 const BASE_URL = "https://jsonplaceholder.typicode.com";
export type Post = {
  id: number,
  userId: number,
  body: string,
  title: string
}
const httpRestServiceBuilder = new HttpRestServiceBuilder();

const httpApi = () => httpRestServiceBuilder.withBaseUrl(BASE_URL).withGenerateApiResponse().build();

export const getPosts = () => {
  return httpApi().get<Post[]>(`/posts`)
}

export const getPost = (postId: number) => {
  return httpApi().get<Post>(`/posts/${postId}`)
}

export interface PostRequest {
  userId: number,
  body: string,
  title: string
}

export interface PostResponse extends Post{
  userId: number,
  body: string,
  title: string,
  id: number
}

export const createPost = (post: PostRequest) => {
  return httpApi().post<PostResponse>(`/posts`, post);
}