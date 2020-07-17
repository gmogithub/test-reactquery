import React, { FC } from "react";
import { useQuery } from "react-query";
import { getPost, Post } from "./repository/JSONPlaceholderRepository";

interface PostComponentProps {
  id: number
}


type PostKey = ["post", number];


const usePost = (id: number) => {
  return useQuery<Post | null, PostKey>(["post", id], async () => {
    const { success, payload } = await getPost(id);
    if (success) {
      return payload;
    } else {
      return null;
    }
  })
}

export const PostComponent: FC<PostComponentProps> = ({ id: idProp }) => {
  const { isLoading, data } = usePost(idProp);
  if (isLoading) {
    return <div style={{ position: "fixed", border: "5px solid black" }}>Loading</div>
  }

  if (!data) {
    return <div>error</div>
  }

  const { title, body, id, userId } = data;

  return <>
    <div style={{
      padding: 20,
      margin: 10,
      border: '5px solid blue',
      position: "fixed",
      backgroundColor: "#FFF"
    }}>
      <div>user id: {userId}</div>
      <div>post id: {id}</div>
      <div>titre : {title}</div>
      <div>boby: {body}</div>
    </div>
  </>
};