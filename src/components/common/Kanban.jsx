import { AddCircle, Delete, DeleteOutline, Edit } from "@mui/icons-material";
import { Box, Button, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import sectionApi from "../../api/sectionApi";
import taskApi from "../../api/taskApi";
import TaskModal from "./TaskModal";

import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

let timer;
const timeout = 500;

const Kanban = (props) => {
  const boardId = props.boardId;
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(undefined);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  //~Drag and Drop
  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
    const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId);
    const sourceCol = data[sourceColIndex];
    const destinationCol = data[destinationColIndex];

    const sourceSectionId = sourceCol.id;
    const destinationSectionId = destinationCol.id;

    const sourceTasks = [...sourceCol.tasks];
    const destinationTasks = [...destinationCol.tasks];

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1);
      // console.log(removed);
      destinationTasks.splice(destination.index, 0, removed);
      data[sourceColIndex].tasks = sourceTasks;
      data[destinationColIndex].tasks = destinationTasks;
    } else {
      const [removed] = destinationTasks.splice(source.index, 1); //removed element
      // console.log(removed);
      destinationTasks.splice(destination.index, 0, removed); //add removed element in its destination
      data[destinationColIndex].tasks = destinationTasks; //update destination
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId,
      });
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId);
      setData([...data, section.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId);
      const newData = [...data].filter((e) => e.id !== sectionId);
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer);
    const newTitle = e.target.value;
    const newData = [...data];
    const index = newData.findIndex((e) => e.id === sectionId);
    newData[index].title = newTitle;
    setData(newData);
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle });
      } catch (err) {
        console.log(err);
      }
    }, timeout);
  };

  //~Tasks

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId });
      const newData = [...data];
      const index = newData.findIndex((e) => e.id === sectionId);
      newData[index].tasks.unshift(task.data);
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const onUpdateTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id);
    newData[sectionIndex].tasks[taskIndex] = task;
    setData(newData);
  };

  const onDeleteTask = (task) => {
    const newData = [...data];
    const sectionIndex = newData.findIndex((e) => e.id === task.section.id);
    const taskIndex = newData[sectionIndex].tasks.findIndex((e) => e.id === task.id);
    newData[sectionIndex].tasks.splice(taskIndex, 1);
    setData(newData);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 3,
        }}
      >
        <Button variant="outlined" onClick={createSection} color="success">
          Add section
        </Button>

        <Typography variant="body2" fontWeight="700">
          Sections <span style={{ color: "gray" }}>{data?.length}</span>
        </Typography>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            overflowX: "scroll",
            alignItems: "flex-start",
          }}
        >
          {data?.map((section) => (
            <Box
              sx={{ display: "flex", alignItems: "flex-start", width: "320px", flexDirection: "column", mr: 2.5 }}
              key={section.id}
            >
              <Droppable key={section.id} droppableId={section.id}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "320px",
                      }}
                    >
                      <Box>
                        <TextField
                          value={section?.title}
                          onChange={(e) => updateSectionTitle(e, section?.id)}
                          placeholder="Untitled"
                          variant="outlined"
                          sx={{
                            // flexGrow: 1,
                            "& .MuiOutlinedInput-input": { padding: 0 },
                            "& .MuiOutlinedInput-notchedOutline": { border: "unset " },
                            "& .MuiOutlinedInput-root": { fontSize: "1rem", fontWeight: "500" },
                          }}
                          // InputProps={{
                          //   startAdornment: (
                          //     <InputAdornment position="start">
                          //       <IconButton size="small">
                          //         <Edit fontSize="12px" />
                          //       </IconButton>
                          //     </InputAdornment>
                          //   ),
                          // }}
                        />
                        <span style={{ color: "black", fontWeight: "bold", fontSize: "14px" }}>
                          {(section?.tasks.map((task) => task.title)).length}
                        </span>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => createTask(section.id)}
                          sx={{
                            color: "gray",
                            "&:hover": { color: "green" },
                          }}
                        >
                          <AddCircle />
                        </IconButton>
                        <IconButton
                          onClick={() => deleteSection(section.id)}
                          sx={{
                            color: "gray",
                            "&:hover": { color: "red" },
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </Box>
                    </Box>

                    {section?.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap={2}
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            sx={{ width: "300px", my: 1, cursor: snapshot.isDragging ? "grab" : "pointer!important" }}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Paper elevation={2}>
                              {/* <Box p={3}>{task.title === "" ? "Untitled" : task.title}</Box> */}
                              <Box sx={{ p: 2 }}>
                                <Typography>{task.title === "" ? "Untitled" : task.title}</Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    backgroundColor: "paleturquoise",
                                    width: "fit-content",
                                    borderRadius: 1.4,
                                    p: 0.7,
                                  }}
                                >
                                  Success
                                </Typography>
                              </Box>
                            </Paper>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>

      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  );
};

export default Kanban;
