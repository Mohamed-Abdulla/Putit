import {
  Avatar,
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  MarkEmailUnread,
  ModeNight,
  CalendarMonth,
  Favorite,
  ArrowDropDown,
  ArrowRight,
  Help,
  Settings,
  Logout,
  Assignment,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/features/userSlice";
import { setBoards } from "../../redux/features/boardSlice";
import { setFavouriteList } from "../../redux/features/favouriteSlice";
import boardApi from "../../api/boardApi";

const Sidebar = ({ mode, setMode, drawerOpen, setDrawerOpen }) => {
  const drawerWidth = 300;
  const [openTask, setOpenTask] = useState(false);
  const [openFav, setOpenFav] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.currentUser);
  const boards = useSelector((state) => state.board.value);
  const fav = useSelector((state) => state.favourites.value);

  const { boardId } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out")) dispatch(logOut());
    navigate("/login");
  };

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll();
        dispatch(setBoards(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    getBoards();
  }, [dispatch]);

  useEffect(() => {
    const index = fav.findIndex((e) => e.id === boardId);
    setActiveIndex(index);
  }, [fav, boardId]);

  useEffect(() => {
    const activeItem = boards.findIndex((e) => e.id === boardId);
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`);
    }
    setActiveIndex(activeItem);
  }, [boards, boardId, navigate]);

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getFavourites();
        dispatch(setFavouriteList(res.data));
      } catch (err) {
        console.log(err);
      }
    };
    getBoards();
  }, []);

  const addBoard = async () => {
    try {
      const res = await boardApi.create();
      const newList = [res.data, ...boards];
      dispatch(setBoards(newList));
      navigate(`/boards/${res.data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  //~Drag and Drop - task

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]; //old list
    const [removed] = newList.splice(source.index, 1); //dragged one
    newList.splice(destination.index, 0, removed); //add removed

    const activeItem = newList.findIndex((e) => e.id === boardId);
    setActiveIndex(activeItem);
    dispatch(setBoards(newList));

    try {
      await boardApi.updatePosition({ boards: newList });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Drawer
      container={window.document.body}
      variant="persistent"
      open={drawerOpen}
      anchor="left"
      sx={{
        width: drawerWidth,
        height: "100vh",
        display: drawerOpen ? "block" : "none",
      }}
    >
      <>
        <Box margin={2} display="flex" alignItems="center" gap={2}>
          <Tooltip title="Profile">
            <Avatar src="https://www.pngarts.com/files/3/Avatar-PNG-Download-Image.png" />
          </Tooltip>
          <Typography variant="h6" fontWeight="semi-bold">
            Hey,
            <span style={{ fontWeight: "bold" }}>
              {" "}
              {(user?.username || user?.user?.username || "User").split(" ").slice(0, 1).join(" ")}
            </span>
          </Typography>
          <IconButton onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Box>
        <Divider />
        <Button variant="contained" color="success" sx={{ m: 2, mb: 0 }} onClick={addBoard}>
          New Task
        </Button>
        <Box flex={1} p={2}>
          <List>
            <ListItem
              disablePadding
              sx={{
                ":hover": {
                  borderRadius: "5px",
                },
              }}
            >
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <Badge badgeContent={4} color="error">
                    <MarkEmailUnread />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Calender" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton component="a" href="#simple-list">
                <ListItemIcon>
                  <ModeNight />
                </ListItemIcon>
                <Switch onChange={(e) => setMode(mode === "light" ? "dark" : "light")} />
              </ListItemButton>
            </ListItem>
            <Divider />

            <ListItemButton
              onClick={() => {
                setOpenFav((prev) => !prev);
              }}
            >
              {openFav ? <ArrowDropDown htmlColor="gray" /> : <ArrowRight htmlColor="gray" />}
              <ListItemText primary="Favourites" />
            </ListItemButton>
            <Collapse in={openFav} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {fav.map((item, index) => (
                  <ListItemButton
                    ListItemButton
                    sx={{ pl: 4 }}
                    key={index}
                    selected={index === activeIndex}
                    component={Link}
                    to={`/boards/${item.id}`}
                  >
                    <ListItemIcon>
                      <Favorite color="error" />
                    </ListItemIcon>
                    {/* <ListItemText primary={item.title} /> */}
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <ListItemButton
              onClick={() => {
                setOpenTask((prev) => !prev);
              }}
            >
              {openTask ? <ArrowDropDown htmlColor="gray" /> : <ArrowRight htmlColor="gray" />}
              <ListItemText primary="Tasks" />
            </ListItemButton>
            <Collapse in={openTask} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {boards?.map((item, index) => (
                  <ListItemButton
                    ListItemButton
                    sx={{ pl: 4 }}
                    key={index}
                    selected={index === activeIndex}
                    component={Link}
                    to={`/boards/${item.id}`}
                  >
                    <ListItemIcon>
                      <Assignment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </>
      <Box>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
