import React, { FC, useState } from "react";
import { createPost, Post, PostRequest } from "./repository/JSONPlaceholderRepository";
import { queryCache, useMutation } from "react-query";
interface CreatePostComponentProps {
  onClose: () => void
}
export const CreatePostComponent: FC<CreatePostComponentProps> = ({onClose}) => {
  const [form, setForm] = useState<{ title: string, body: string }>({ title: "", body: "" });
  const { title, body } = form;

  const [addPost] = useMutation(createPost, {
    onMutate(post: PostRequest) {
      const newPost = { ...post, id: 0 };

      const previousPosts = queryCache.getQueryData('posts')

      queryCache.setQueryData<Post[]>("posts", (data) => {
        return (data ? [newPost, ...data] : [newPost])
      });

      return () => queryCache.setQueryData("posts", previousPosts);
    },
    onSettled: () => {
      queryCache.invalidateQueries('posts');
      onClose();
    }
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  }

  function handleClickCreatePost() {
    const request: PostRequest = {
      userId: 1,
      ...form
    }
    addPost(request);

  }

  return <div style={{ position: "fixed", border: "solid 1px green", backgroundColor: "#FFF" }}>
    titre <input name={"title"} value={title} onChange={handleChange}/>
    <br/>
    body <input name={"body"} value={body} onChange={handleChange}/>
    <br/>
    <button onClick={handleClickCreatePost}>save</button>
  </div>
};