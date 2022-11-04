import { Box, ListItem, ListItemButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import boardApi from "../../api/boardApi";
import { setFavouriteList } from "../../redux/features/favouriteSlice";

const Draganddrop = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.favourites.value);
  const [activeIndex, setActiveIndex] = useState(0);
  const { boardId } = useParams();

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites();
        dispatch(setFavouriteList(res));
      } catch (err) {
        console.log(err);
      }
    };
    getBoards();
  }, []);

  useEffect(() => {
    const index = list.findIndex((e) => e.id === boardId);
    setActiveIndex(index);
  }, [list, boardId]);

  function DragStart(ev, id, index) {
    console.log(ev, id, index);
    ev.dataTransfer.setData("id", id);
  }
  function Dragover(ev) {
    ev.preventDefault();
  }
  function OnDrop(ev, cat) {
    let source = ev.dataTransfer.getData("id");
    console.log(source);
  }

  return (
    <>
      <ListItem>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" fontWeight="700">
            Favourites
          </Typography>
        </Box>
      </ListItem>
      <div onDragOver={(e) => Dragover(e)} onDrop={(e) => OnDrop(e, "fav")}>
        {list.map((item, index) => (
          <ListItemButton
            selected={index === activeIndex}
            component={Link}
            to={`/boards/${item.id}`}
            sx={{
              pl: "20px",
              //   cursor: snapshot.isDragging ? "grab" : "pointer!important",
            }}
            key={index}
            draggable
            onDragStart={(e) => DragStart(e, item.id, index)}
          >
            <Typography
              variant="body2"
              fontWeight="700"
              sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {item.icon} {item.title}
            </Typography>
          </ListItemButton>
        ))}
      </div>
    </>
  );
};

export default Draganddrop;
