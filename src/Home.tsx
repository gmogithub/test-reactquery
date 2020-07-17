import React, { FC, useState } from "react";
import { PostComponent } from "./PostComponent";
import { CreatePostComponent } from "./CreatePostComponent";
import { ReactQueryDevtools } from "react-query-devtools";
import { useQuery } from "react-query";
import { getPosts, Post, sleep } from "./repository/JSONPlaceholderRepository";

const usePosts = () => {
  return useQuery<Post[], string>("posts", async () => {
    await sleep(2000);
    const { success, payload } = await getPosts();
    if (success) {
      return payload;
    }

    return [];
  })
}

export const Home: FC = () => {
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<null | number>(null);
  const { isLoading, data } = usePosts();
  if (isLoading) {
    return <div>loading</div>
  }


  const handleClick = (id: number) => () => {
    setOpen(openPrev => !openPrev);
    setSelectedId(id);
  }

  function handleClickCreatePost() {
    setOpenCreate(prev => !prev);
  }
  if(!data) {
    return <div>error</div>
  }

  return (
    <>
      <button onClick={handleClickCreatePost}>Add post</button>
      {open && selectedId != null && <PostComponent id={selectedId}/>}
      {openCreate && <CreatePostComponent onClose={handleClickCreatePost}/>}
      <ReactQueryDevtools initialIsOpen/>
      <div>
        {data.map(({ title, body, id, userId }) => <div key={id} onClick={handleClick(id)} style={{
          padding: 5,
          margin: 10,
          border: '1px solid red'
        }}>
          <div>user id: {userId}</div>
          <div>post id: {id}</div>
          <div>titre : {title}</div>
          <div>boby: {body}</div>
        </div>)}
      </div>
    </>
  );
};