import { Box, Divider, IconButton, InputAdornment, Paper, TextField, Tooltip } from "@mui/material";
import { DeleteOutlined, Edit, Favorite, FavoriteBorder, Menu } from "@mui/icons-material";
import EmojiPicker from "../components/common/EmojiPicker";
import Kanban from "../components/common/Kanban";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import boardApi from "../api/boardApi";
import { setFavouriteList } from "../redux/features/favouriteSlice";
import { setBoards } from "../redux/features/boardSlice";

let timer;
const timeout = 500;

const Board = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useOutletContext();

  const { boardId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [icon, setIcon] = useState("");

  const boards = useSelector((state) => state.board.value);
  const favouriteList = useSelector((state) => state.favourites.value);

  const handleClick = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setSections(res.data.sections);
        setIsFavourite(res.data.favourite);
        setIcon(res.data.icon);
      } catch (err) {
        console.log(err);
      }
    };
    getBoard();
  }, [boardId]);

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    setTitle(newTitle);

    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], title: newTitle };
      dispatch(setFavouriteList(tempFavourite));
    }

    dispatch(setBoards(temp));

    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { title: newTitle });
      } catch (err) {
        console.log(err);
      }
    }, timeout);
  };

  const updateDescription = async (e) => {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setDescription(newDescription);
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, { description: newDescription });
      } catch (err) {
        console.log(err);
      }
    }, timeout);
  };

  const addFavourite = async () => {
    try {
      //add / remove
      const board = await boardApi.update(boardId, { favourite: !isFavourite });
      let newFavouriteList = [...favouriteList];
      //if its already fav ,and if we click it , it becomes unfav.so this happens
      if (isFavourite) {
        newFavouriteList = newFavouriteList.filter((e) => e.id !== boardId);
      } else {
        newFavouriteList.unshift(board.data);
      }
      dispatch(setFavouriteList(newFavouriteList));
      setIsFavourite(!isFavourite);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId);
      if (isFavourite) {
        const newFavouriteList = favouriteList.filter((e) => e.id !== boardId);
        dispatch(setFavouriteList(newFavouriteList));
      }

      const newList = boards.filter((e) => e.id !== boardId);
      if (newList.length === 0) {
        navigate("/boards");
      } else {
        navigate(`/boards/${newList[0].id}`);
      }
      dispatch(setBoards(newList));
    } catch (err) {
      console.log(err);
    }
  };

  const onIconChange = async (newIcon) => {
    let temp = [...boards];
    const index = temp.findIndex((e) => e.id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };

    if (isFavourite) {
      let tempFavourite = [...favouriteList];
      const favouriteIndex = tempFavourite.findIndex((e) => e.id === boardId);
      tempFavourite[favouriteIndex] = { ...tempFavourite[favouriteIndex], icon: newIcon };
      dispatch(setFavouriteList(tempFavourite));
    }

    setIcon(newIcon);
    dispatch(setBoards(temp));
    try {
      await boardApi.update(boardId, { icon: newIcon });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m={drawerOpen ? 0 : 2}>
      <Tooltip title="Sidebar">
        <IconButton onClick={handleClick} edge="start" aria-label="open drawer">
          <Menu />
        </IconButton>
      </Tooltip>
      <Paper elevation={2} sx={{ mt: 2, mr: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" paddingX={2}>
          <IconButton variant="outlined" onClick={addFavourite}>
            {isFavourite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
          <IconButton variant="outlined" color="error" onClick={deleteBoard}>
            <DeleteOutlined />
          </IconButton>
        </Box>
        <Box p={3} borderRadius={2}>
          {/* <EmojiPicker icon={icon} onChange={onIconChange} /> */}
          <TextField
            value={title}
            onChange={updateTitle}
            placeholder="Untitled"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 12 }}
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": { fontSize: "2rem", fontWeight: "600" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            value={description}
            onChange={updateDescription}
            placeholder="Add a description"
            variant="outlined"
            multiline
            fullWidth
            sx={{
              "& .MuiOutlinedInput-input": { padding: 0 },
              "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
              "& .MuiOutlinedInput-root": { fontSize: "1rem" },
            }}
          />
        </Box>
        <Divider />
      </Paper>
      <Box>
        <Kanban data={sections} boardId={boardId} />
      </Box>
    </Box>
  );
};

export default Board;
