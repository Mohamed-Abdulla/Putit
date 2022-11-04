import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider, Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  AccessAlarmOutlined,
  AssignmentTurnedInOutlined,
  DeleteOutlined,
  Description,
  DesignServices,
} from "@mui/icons-material";
import Moment from "moment";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import taskApi from "../../api/taskApi";

// import "../../css/custom-editor.css";
// import Calendar from "react-calendar";

const modalStyle = {
  outline: "none",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 1,
  height: "80%",
  borderRadius: "8px",
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = (props) => {
  const boardId = props.boardId;
  const [task, setTask] = useState(props.task);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const editorWrapperRef = useRef();

  useEffect(() => {
    setTask(props.task);
    setTitle(props.task !== undefined ? props.task.title : "");
    setContent(props.task !== undefined ? props.task.content : "");
    if (props.task !== undefined) {
      isModalClosed = false;

      updateEditorHeight();
    }
  }, [props.task]);

  const updateEditorHeight = () => {
    setTimeout(() => {
      if (editorWrapperRef.current) {
        const box = editorWrapperRef.current;
        box.querySelector(".ck-editor__editable_inline").style.height = box.offsetHeight - 50 + "px";
      }
    }, timeout);
  };

  const onClose = () => {
    isModalClosed = true;
    props.onUpdate(task);
    props.onClose();
  };

  const deleteTask = async () => {
    try {
      await taskApi.delete(boardId, task.id);
      props.onDelete(task);
      setTask(undefined);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (e) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    timer = setTimeout(async () => {
      try {
        await taskApi.update(boardId, task.id, { title: newTitle });
      } catch (err) {
        console.log(err);
      }
    }, timeout);

    task.title = newTitle;
    setTitle(newTitle);
    props.onUpdate(task);
  };

  const updateContent = async (event, editor) => {
    clearTimeout(timer);
    const data = editor.getData();

    console.log({ isModalClosed });

    if (!isModalClosed) {
      timer = setTimeout(async () => {
        try {
          await taskApi.update(boardId, task.id, { content: data });
        } catch (err) {
          console.log(err);
        }
      }, timeout);

      task.content = data;
      setContent(data);
      props.onUpdate(task);
    }
  };

  return (
    <Modal
      open={task !== undefined}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      sx={{ height: "750px" }}
    >
      <Fade in={task !== undefined}>
        <Box sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <IconButton variant="outlined" color="error" onClick={deleteTask}>
              <DeleteOutlined />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              padding: "1rem 3rem 3rem",
            }}
          >
            <Box display="flex" gap={2} alignItems="center" mb={2}>
              <AssignmentTurnedInOutlined htmlColor="gray" />
              <TextField
                value={title}
                onChange={updateTitle}
                placeholder="Task Title"
                variant="outlined"
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-input": { padding: 0 },
                  "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                  "& .MuiOutlinedInput-root": { fontSize: "1.7rem", fontWeight: "550", opacity: "0.9" },
                  // marginBottom: "10px",
                }}
              />
            </Box>
            {/* <Typography variant="body2" fontWeight="700">
            {task !== undefined ? Moment(task.createdAt).format("YYYY-MM-DD") : ""}
          </Typography> */}

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 1, sm: 0 } }}>
              <Box display="flex" gap={2} alignItems="center" ml={3}>
                <Typography>in</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#e3f2fd",
                    width: "fit-content",
                    p: "6px",
                    borderRadius: "5px",
                    color: "#3f51b5",
                    fontSize: "14px",
                  }}
                >
                  Personal Tasks
                </Typography>
              </Box>
              <Box display="flex" gap={2} alignItems="center" mx={3} width="20%">
                •
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={"age"}
                    label="Priority"
                    onChange={() => {}}
                    sx={{
                      backgroundColor: "",
                    }}
                  >
                    <MenuItem value={1}>❕High</MenuItem>
                    <MenuItem value={2} sx={{ backgroundColor: "" }}>
                      ❕ Medium
                    </MenuItem>
                    <MenuItem value={3} sx={{ backgroundColor: "" }}>
                      ❕ Low
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                display="flex"
                gap={1}
                alignItems="center"
                sx={{ backgroundColor: "#ffebee", borderRadius: "5px", fontSize: "13px", p: "8px" }}
              >
                <AccessAlarmOutlined />
                Set Remainder
              </Box>

              <Box display="flex" gap={1} alignItems="center" ml={3}>
                <Button variant="outlined" color="success">
                  In
                </Button>
                <Button variant="outlined" color="error">
                  Out
                </Button>
              </Box>
            </Box>
            {/* <Divider sx={{ margin: "1.5rem 0" }} /> */}
            <Box
              ref={editorWrapperRef}
              sx={{
                position: "relative",
                height: "80%",
                overflowX: "hidden",
                overflowY: "auto",
                mt: 3,
              }}
            >
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Description htmlColor="gray" />
                <Typography variant="body1" fontSize="20px">
                  Description
                </Typography>
              </Box>
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={updateContent}
                onFocus={updateEditorHeight}
                onBlur={updateEditorHeight}
              />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TaskModal;
